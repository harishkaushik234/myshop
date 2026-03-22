import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, authorize("admin"), upload.single("image"), createProduct);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
