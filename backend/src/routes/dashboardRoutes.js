import express from "express";
import {
  getAdminAnalytics,
  getClientRewards,
  getClientSummary,
  getShopContactInfo,
  grantBonusReward
} from "../controllers/dashboardController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), getAdminAnalytics);
router.get("/users", protect, authorize("admin"), getClientRewards);
router.post("/rewards/:userId", protect, authorize("admin"), grantBonusReward);
router.get("/client", protect, authorize("client"), getClientSummary);
router.get("/shop-info", protect, getShopContactInfo);

export default router;
