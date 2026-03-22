import fs from "fs/promises";
import path from "path";
import { extractVisionFeatures } from "../../src/services/cropVisionUtils.js";
import { cosineSimilarity } from "../../src/services/cropVisionUtils.js";

const manifestPath = path.resolve("ai/data/processed/manifest.json");
const outputPath = path.resolve("src/ai/customCropDiseaseModel.json");
const reportPath = path.resolve("ai/data/processed/training-report.json");

const averageVectors = (vectors) => {
  const width = vectors[0].length;
  const accumulator = Array(width).fill(0);

  vectors.forEach((vector) => {
    vector.forEach((value, index) => {
      accumulator[index] += value;
    });
  });

  return accumulator.map((value) => value / vectors.length);
};

const averageScalar = (items, key) =>
  items.reduce((sum, item) => sum + item[key], 0) / items.length;

const scoreLabel = (sample, labelEntry) => {
  const embeddingScore = cosineSimilarity(sample.embedding, labelEntry.centroid);
  const greenDelta = Math.abs(sample.greenRatio - labelEntry.featureMeans.greenRatio);
  const yellowDelta = Math.abs(sample.yellowRatio - labelEntry.featureMeans.yellowRatio);
  const brownDelta = Math.abs(sample.brownRatio - labelEntry.featureMeans.brownRatio);
  const darkSpotDelta = Math.abs(sample.darkSpotRatio - labelEntry.featureMeans.darkSpotRatio);
  const ratioPenalty = (greenDelta + yellowDelta + brownDelta + darkSpotDelta) / 4;
  const cropBonus = sample.cropType === labelEntry.cropType ? 0.06 : 0;

  return embeddingScore - ratioPenalty + cropBonus;
};

const predictLabel = (sample, labels) =>
  labels
    .map((labelEntry) => ({
      label: labelEntry.label,
      score: scoreLabel(sample, labelEntry)
    }))
    .sort((left, right) => right.score - left.score)[0];

const splitItems = (items, ratio = 0.8) => {
  if (items.length <= 2) {
    return {
      train: items,
      validation: []
    };
  }

  const trainCount = Math.max(1, Math.floor(items.length * ratio));

  return {
    train: items.slice(0, trainCount),
    validation: items.slice(trainCount)
  };
};

const run = async () => {
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

  if (!manifest.samples?.length) {
    throw new Error("No dataset samples found. Run ai:prepare after adding labeled images.");
  }

  const grouped = new Map();

  for (const sample of manifest.samples) {
    const imageBuffer = await fs.readFile(sample.filePath);
    const features = await extractVisionFeatures(imageBuffer);

    if (!grouped.has(sample.label)) {
      grouped.set(sample.label, []);
    }

    grouped.get(sample.label).push({
      ...features,
      cropType: sample.cropType
    });
  }

  const trainSamples = [];
  const validationSamples = [];

  [...grouped.values()].forEach((items) => {
    const split = splitItems(items);
    trainSamples.push(...split.train);
    validationSamples.push(...split.validation);
  });

  const labels = [...grouped.entries()].map(([label, items]) => {
    const trainingItems = trainSamples.filter((sample) => sample.label === label);
    return {
      label,
      cropType: items[0].cropType,
      sampleCount: items.length,
      trainCount: trainingItems.length,
      validationCount: validationSamples.filter((sample) => sample.label === label).length,
      centroid: averageVectors(trainingItems.map((item) => item.embedding)).map((value) =>
        Number(value.toFixed(8))
      ),
      featureMeans: {
        greenRatio: Number(averageScalar(trainingItems, "greenRatio").toFixed(6)),
        yellowRatio: Number(averageScalar(trainingItems, "yellowRatio").toFixed(6)),
        brownRatio: Number(averageScalar(trainingItems, "brownRatio").toFixed(6)),
        darkSpotRatio: Number(averageScalar(trainingItems, "darkSpotRatio").toFixed(6))
      }
    };
  });

  const catalog = manifest.labels.reduce((accumulator, labelEntry) => {
    accumulator[labelEntry.label] = {
      cropType: labelEntry.cropType,
      description: labelEntry.description,
      treatment: labelEntry.treatment
    };
    return accumulator;
  }, {});

  const validationPredictions = validationSamples.map((sample) => {
    const prediction = predictLabel(sample, labels);
    return {
      actualLabel: sample.label,
      predictedLabel: prediction?.label || "Unknown",
      score: Number((prediction?.score || 0).toFixed(4))
    };
  });

  const validationCorrect = validationPredictions.filter(
    (entry) => entry.actualLabel === entry.predictedLabel
  ).length;
  const validationAccuracy = validationPredictions.length
    ? Number((validationCorrect / validationPredictions.length).toFixed(4))
    : null;

  const perLabelMetrics = labels.map((labelEntry) => {
    const labelPredictions = validationPredictions.filter(
      (entry) => entry.actualLabel === labelEntry.label
    );
    const labelCorrect = labelPredictions.filter(
      (entry) => entry.actualLabel === entry.predictedLabel
    ).length;

    return {
      label: labelEntry.label,
      trainCount: labelEntry.trainCount,
      validationCount: labelEntry.validationCount,
      accuracy: labelPredictions.length
        ? Number((labelCorrect / labelPredictions.length).toFixed(4))
        : null
    };
  });

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        version: 1,
        trainedAt: new Date().toISOString(),
        totalSamples: manifest.samples.length,
        trainSamples: trainSamples.length,
        validationSamples: validationSamples.length,
        labels,
        catalog
      },
      null,
      2
    )
  );

  await fs.writeFile(
    reportPath,
    JSON.stringify(
      {
        trainedAt: new Date().toISOString(),
        totalSamples: manifest.samples.length,
        trainSamples: trainSamples.length,
        validationSamples: validationSamples.length,
        validationAccuracy,
        perLabelMetrics,
        validationPredictions
      },
      null,
      2
    )
  );

  console.log("Custom crop disease model written to:", outputPath);
  console.log("Training report written to:", reportPath);
  console.table(labels.map((labelEntry) => ({
    label: labelEntry.label,
    cropType: labelEntry.cropType,
    sampleCount: labelEntry.sampleCount,
    trainCount: labelEntry.trainCount,
    validationCount: labelEntry.validationCount
  })));

  if (validationAccuracy !== null) {
    console.log(`Validation accuracy: ${(validationAccuracy * 100).toFixed(2)}%`);
    console.table(perLabelMetrics);
  } else {
    console.log("Validation accuracy unavailable: add more labeled images per class.");
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
