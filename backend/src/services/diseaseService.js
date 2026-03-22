import fs from "fs/promises";
import path from "path";
import { diseaseProfiles } from "../config/cropDiseaseCatalog.js";
import {
  cosineSimilarity,
  extractVisionFeatures
} from "./cropVisionUtils.js";

const detectDiseaseFromFeatures = ({
  normalizedCrop,
  isLikelyLeaf,
  greenRatio,
  yellowRatio,
  brownRatio,
  darkSpotRatio,
  red,
  green,
  blue
}) => {
  if (!isLikelyLeaf) {
    return { diseaseName: "Inconclusive", confidence: 0.32 };
  }

  if (["Tomato", "Potato"].includes(normalizedCrop) && (brownRatio > 0.16 || darkSpotRatio > 0.08)) {
    return { diseaseName: "Early Blight", confidence: 0.84 };
  }

  if (normalizedCrop === "Maize" && yellowRatio > 0.2 && greenRatio < 0.34) {
    return { diseaseName: "Nitrogen Deficiency", confidence: 0.83 };
  }

  if (greenRatio > 0.45 && yellowRatio < 0.12 && brownRatio < 0.08 && darkSpotRatio < 0.04) {
    return { diseaseName: "Healthy", confidence: 0.88 };
  }

  if (brownRatio > 0.18 || darkSpotRatio > 0.1 || (red > green * 1.12 && brownRatio > 0.12)) {
    return { diseaseName: "Leaf Blight", confidence: 0.82 };
  }

  if (yellowRatio > 0.22 && greenRatio < 0.34) {
    return { diseaseName: "Nitrogen Deficiency", confidence: 0.79 };
  }

  if (brownRatio > 0.1 && red > 110 && green > 80 && blue < 95) {
    return { diseaseName: "Rust Infection", confidence: 0.77 };
  }

  if (green > red * 1.03 && green > blue * 1.08) {
    return { diseaseName: "Healthy", confidence: 0.7 };
  }

  return { diseaseName: "Inconclusive", confidence: 0.4 };
};

const trainedModelPath = path.resolve("src/ai/customCropDiseaseModel.json");
let customModelPromise;

const getCustomModel = async () => {
  if (!customModelPromise) {
    customModelPromise = fs
      .readFile(trainedModelPath, "utf8")
      .then((content) => JSON.parse(content))
      .catch(() => null);
  }

  return customModelPromise;
};

const scoreCustomModelLabel = (vision, labelEntry) => {
  const embeddingScore = cosineSimilarity(vision.embedding, labelEntry.centroid);
  const greenDelta = Math.abs(vision.greenRatio - labelEntry.featureMeans.greenRatio);
  const yellowDelta = Math.abs(vision.yellowRatio - labelEntry.featureMeans.yellowRatio);
  const brownDelta = Math.abs(vision.brownRatio - labelEntry.featureMeans.brownRatio);
  const darkSpotDelta = Math.abs(vision.darkSpotRatio - labelEntry.featureMeans.darkSpotRatio);
  const ratioPenalty = (greenDelta + yellowDelta + brownDelta + darkSpotDelta) / 4;
  const cropBonus = vision.normalizedCrop === labelEntry.cropType ? 0.06 : 0;

  return embeddingScore - ratioPenalty + cropBonus;
};

const detectWithCustomModel = async (vision) => {
  const customModel = await getCustomModel();

  if (!customModel?.labels?.length) {
    return null;
  }

  const rankedLabels = customModel.labels
    .map((labelEntry) => ({
      ...labelEntry,
      score: scoreCustomModelLabel(vision, labelEntry)
    }))
    .sort((left, right) => right.score - left.score);

  const bestMatch = rankedLabels[0];
  if (!bestMatch || bestMatch.score < 0.45) {
    return null;
  }

  return {
    cropType: bestMatch.cropType,
    diseaseName: bestMatch.label,
    confidence: Number(Math.min(0.95, Math.max(0.55, bestMatch.score)).toFixed(2)),
    description:
      customModel.catalog?.[bestMatch.label]?.description || diseaseProfiles[bestMatch.label]?.description,
    treatment:
      customModel.catalog?.[bestMatch.label]?.treatment || diseaseProfiles[bestMatch.label]?.treatment,
    modelSource: "custom-trained"
  };
};

export const analyzeCropImage = async (imageBuffer) => {
  const vision = await extractVisionFeatures(imageBuffer);
  const customResult = await detectWithCustomModel(vision);

  if (customResult) {
    return {
      cropType: customResult.cropType,
      topLabel: vision.bestPrediction.className,
      diseaseName: customResult.diseaseName,
      confidence: customResult.confidence,
      description: customResult.description,
      treatment: customResult.treatment,
      modelSource: customResult.modelSource,
      rawPredictions: vision.predictions
    };
  }

  const diagnosis = detectDiseaseFromFeatures({
    normalizedCrop: vision.normalizedCrop,
    isLikelyLeaf: vision.isLikelyLeaf,
    greenRatio: vision.greenRatio,
    yellowRatio: vision.yellowRatio,
    brownRatio: vision.brownRatio,
    darkSpotRatio: vision.darkSpotRatio,
    red: vision.channels.red || 0,
    green: vision.channels.green || 0,
    blue: vision.channels.blue || 0
  });
  const profile = diseaseProfiles[diagnosis.diseaseName];
  const cropDescriptionPrefix =
    vision.normalizedCrop !== "Generic crop" ? `${vision.normalizedCrop}: ` : "";

  return {
    cropType: vision.normalizedCrop,
    topLabel: vision.bestPrediction.className,
    diseaseName: diagnosis.diseaseName,
    confidence: Number(diagnosis.confidence.toFixed(2)),
    description: `${cropDescriptionPrefix}${profile.description}`,
    treatment: profile.treatment,
    modelSource: "heuristic-fallback",
    rawPredictions: vision.predictions
  };
};
