import express from "express";
import {
  getContacts,
  getConversation,
  sendMessage
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/contacts", protect, getContacts);
router.get("/:otherUserId", protect, getConversation);
router.post("/", protect, sendMessage);

export default router;
