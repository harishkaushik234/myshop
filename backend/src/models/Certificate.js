import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    issuer: { type: String, default: "" },
    issuedOn: { type: Date },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Certificate = mongoose.model("Certificate", certificateSchema);
