import { Feedback } from "../models/Feedback.js";

export const createFeedback = async (req, res) => {
  const feedback = await Feedback.create({
    user: req.user?._id,
    name: req.body.name || req.user?.name,
    email: req.body.email || req.user?.email,
    phone: req.body.phone,
    type: req.body.type || "feedback",
    rating: Number(req.body.rating || 5),
    subject: req.body.subject,
    message: req.body.message,
    isPublic: false
  });

  res.status(201).json(feedback);
};

export const getAllFeedback = async (req, res) => {
  const feedback = await Feedback.find().sort({ createdAt: -1 }).populate("user", "name email");
  res.json(feedback);
};

export const getPublicFeedback = async (req, res) => {
  const feedback = await Feedback.find({
    type: "feedback",
    $or: [{ isPublic: true }, { status: "reviewed" }]
  })
    .sort({ createdAt: -1 })
    .select("name rating subject message createdAt");

  res.json(feedback);
};

export const getMyFeedback = async (req, res) => {
  const feedback = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(feedback);
};

export const updateFeedbackStatus = async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({ message: "Feedback not found" });
  }

  feedback.status = req.body.status || feedback.status;
  feedback.isPublic = feedback.type === "feedback" && feedback.status === "reviewed";
  await feedback.save();
  res.json(feedback);
};
