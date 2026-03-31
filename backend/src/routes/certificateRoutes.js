import express from "express";
import {
  createCertificate,
  deleteCertificate,
  getCertificates,
  updateCertificate
} from "../controllers/certificateController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, getCertificates);
router.post("/", protect, authorize("admin"), upload.single("image"), createCertificate);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateCertificate);
router.delete("/:id", protect, authorize("admin"), deleteCertificate);

export default router;
