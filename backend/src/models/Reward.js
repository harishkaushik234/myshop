import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: ["purchase", "image_upload", "badge", "bonus"],
      required: true
    },
    points: { type: Number, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export const Reward = mongoose.model("Reward", rewardSchema);
