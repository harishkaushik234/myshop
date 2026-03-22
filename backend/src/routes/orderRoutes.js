import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("client"), createOrder);
router.get("/mine", protect, authorize("client"), getMyOrders);
router.get("/", protect, authorize("admin"), getAllOrders);
router.patch("/:id/status", protect, authorize("admin"), updateOrderStatus);

export default router;
