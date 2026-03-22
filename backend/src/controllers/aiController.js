import { CropScan } from "../models/CropScan.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { analyzeCropImage } from "../services/diseaseService.js";
import { grantReward } from "../utils/rewardUtils.js";

export const scanCropImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Crop image is required" });
  }

  const uploadedImage = await uploadToCloudinary(req.file.buffer, "agroshop/crop-scans");
  const analysis = await analyzeCropImage(req.file.buffer);

  const scan = await CropScan.create({
    user: req.user._id,
    image: uploadedImage.secure_url,
    imagePublicId: uploadedImage.public_id,
    ...analysis
  });

  await grantReward({
    userId: req.user._id,
    action: "image_upload",
    points: 8,
    description: "Uploaded a crop image for AI screening"
  });

  res.status(201).json(scan);
};

export const getMyScans = async (req, res) => {
  const scans = await CropScan.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(scans);
};

export const getAllScans = async (req, res) => {
  const scans = await CropScan.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(scans);
};
