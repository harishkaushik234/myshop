import express from "express";
import {
  createFeedback,
  getAllFeedback,
  getMyFeedback,
  getPublicFeedback,
  updateFeedbackStatus
} from "../controllers/feedbackController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createFeedback);
router.get("/public", protect, getPublicFeedback);
router.get("/mine", protect, authorize("client"), getMyFeedback);
router.get("/", protect, authorize("admin"), getAllFeedback);
router.patch("/:id/status", protect, authorize("admin"), updateFeedbackStatus);

export default router;
