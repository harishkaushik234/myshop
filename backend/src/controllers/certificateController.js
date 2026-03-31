import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import { Certificate } from "../models/Certificate.js";

export const getCertificates = async (req, res) => {
  const certificates = await Certificate.find().sort({ createdAt: -1 });
  res.json(certificates);
};

export const createCertificate = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Certificate image is required" });
  }

  const uploadedImage = await uploadToCloudinary(req.file.buffer, "agroshop/certificates");

  const certificate = await Certificate.create({
    title: req.body.title,
    description: req.body.description,
    issuer: req.body.issuer,
    issuedOn: req.body.issuedOn || undefined,
    image: uploadedImage.secure_url,
    imagePublicId: uploadedImage.public_id,
    createdBy: req.user._id
  });

  res.status(201).json(certificate);
};

export const updateCertificate = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found" });
  }

  certificate.title = req.body.title ?? certificate.title;
  certificate.description = req.body.description ?? certificate.description;
  certificate.issuer = req.body.issuer ?? certificate.issuer;
  certificate.issuedOn = req.body.issuedOn || undefined;

  if (req.file) {
    const uploadedImage = await uploadToCloudinary(req.file.buffer, "agroshop/certificates");
    await deleteFromCloudinary(certificate.imagePublicId);
    certificate.image = uploadedImage.secure_url;
    certificate.imagePublicId = uploadedImage.public_id;
  }

  await certificate.save();
  res.json(certificate);
};

export const deleteCertificate = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found" });
  }

  await deleteFromCloudinary(certificate.imagePublicId);
  await certificate.deleteOne();
  res.json({ message: "Certificate deleted" });
};
