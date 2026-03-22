import mongoose from "mongoose";

const cropScanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    cropType: { type: String, default: "Unknown crop" },
    topLabel: { type: String, default: "" },
    diseaseName: { type: String, required: true },
    confidence: { type: Number, required: true },
    modelSource: { type: String, default: "heuristic-fallback" },
    description: { type: String, required: true },
    treatment: { type: String, required: true },
    rawPredictions: {
      type: [
        {
          className: String,
          probability: Number
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

export const CropScan = mongoose.model("CropScan", cropScanSchema);
