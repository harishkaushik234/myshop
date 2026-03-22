import express from "express";
import { getAllScans, getMyScans, scanCropImage } from "../controllers/aiController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/scan", protect, authorize("client"), upload.single("image"), scanCropImage);
router.get("/mine", protect, authorize("client"), getMyScans);
router.get("/", protect, authorize("admin"), getAllScans);

export default router;
