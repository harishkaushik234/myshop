import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import * as mobilenet from "@tensorflow-models/mobilenet";
import sharp from "sharp";
import { cropKeywords, cropProfiles, leafKeywords } from "../config/cropDiseaseCatalog.js";

let modelPromise;

export const suppressTensorflowNotice = async (callback) => {
  const originalWarn = console.warn;
  const originalLog = console.log;
  const shouldSuppress = (value) =>
    typeof value === "string" &&
    (value.includes("running TensorFlow.js in Node.js") ||
      value.includes("install our node backend"));

  console.warn = (...args) => {
    if (!args.some(shouldSuppress)) {
      originalWarn(...args);
    }
  };

  console.log = (...args) => {
    if (!args.some(shouldSuppress)) {
      originalLog(...args);
    }
  };

  try {
    return await callback();
  } finally {
    console.warn = originalWarn;
    console.log = originalLog;
  }
};

export const getBaseModel = async () => {
  if (!modelPromise) {
    modelPromise = suppressTensorflowNotice(() => mobilenet.load({ version: 2, alpha: 1.0 }));
  }

  await suppressTensorflowNotice(() => tf.setBackend("cpu"));
  return modelPromise;
};

export const normalizeCropLabel = (label) => {
  const lowerLabel = label.toLowerCase();
  return (
    cropProfiles.find((profile) =>
      profile.keywords.some((keyword) => lowerLabel.includes(keyword))
    )?.key || "Generic crop"
  );
};

export const cosineSimilarity = (left, right) => {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] * left[index];
    rightNorm += right[index] * right[index];
  }

  if (!leftNorm || !rightNorm) {
    return 0;
  }

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
};

export const extractVisionFeatures = async (imageBuffer) => {
  const model = await getBaseModel();

  const { data, info } = await sharp(imageBuffer)
    .resize(224, 224)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelTensor = tf.tensor3d(
    new Uint8Array(data),
    [info.height, info.width, info.channels],
    "int32"
  );

  const predictions = await suppressTensorflowNotice(() => model.classify(pixelTensor));
  const embeddingTensor = await suppressTensorflowNotice(() => model.infer(pixelTensor, true));
  const embedding = Array.from(await embeddingTensor.data());
  embeddingTensor.dispose();
  pixelTensor.dispose();

  const stats = await sharp(imageBuffer).resize(224, 224).stats();
  const channels = stats.channels.reduce((accumulator, channel) => {
    accumulator[channel.channel] = channel.mean;
    return accumulator;
  }, {});

  let greenPixels = 0;
  let yellowPixels = 0;
  let brownPixels = 0;
  let darkSpotPixels = 0;
  const totalPixels = info.width * info.height;

  for (let index = 0; index < data.length; index += info.channels) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];

    if (g > 90 && g > r * 1.1 && g > b * 1.1) {
      greenPixels += 1;
    }

    if (r > 140 && g > 130 && b < 120) {
      yellowPixels += 1;
    }

    if (r > 90 && g > 50 && g < 160 && b < 110 && r > b * 1.2) {
      brownPixels += 1;
    }

    if (r < 85 && g < 85 && b < 85) {
      darkSpotPixels += 1;
    }
  }

  const bestPrediction = predictions[0] || { className: "leaf", probability: 0.5 };
  const detectedCropLabel =
    predictions.find((item) =>
      cropKeywords.some((keyword) => item.className.toLowerCase().includes(keyword))
    )?.className || "Leaf crop";
  const normalizedCrop = normalizeCropLabel(detectedCropLabel);
  const greenRatio = greenPixels / totalPixels;
  const yellowRatio = yellowPixels / totalPixels;
  const brownRatio = brownPixels / totalPixels;
  const darkSpotRatio = darkSpotPixels / totalPixels;

  const isLikelyLeaf =
    predictions.some(
      (item) =>
        item.probability > 0.2 &&
        leafKeywords.some((keyword) => item.className.toLowerCase().includes(keyword))
    ) || greenRatio > 0.15;

  return {
    predictions: predictions.map((item) => ({
      className: item.className,
      probability: Number(item.probability.toFixed(4))
    })),
    bestPrediction,
    detectedCropLabel,
    normalizedCrop,
    channels,
    greenRatio,
    yellowRatio,
    brownRatio,
    darkSpotRatio,
    isLikelyLeaf,
    embedding
  };
};
