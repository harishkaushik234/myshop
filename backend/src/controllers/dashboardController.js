import { CropScan } from "../models/CropScan.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Reward } from "../models/Reward.js";
import { User } from "../models/User.js";
import { normalizeBadges, normalizeUserBadges } from "../utils/rewardUtils.js";

export const getAdminAnalytics = async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, totalSalesData, scanCount, recentRewards] =
    await Promise.all([
      User.countDocuments({ role: "client" }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }]),
      CropScan.countDocuments(),
      Reward.find().sort({ createdAt: -1 }).limit(5).populate("user", "name")
    ]);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalSales: totalSalesData[0]?.totalSales || 0,
    totalScans: scanCount,
    recentRewards
  });
};

export const getClientSummary = async (req, res) => {
  const [orders, scans, rewardHistory] = await Promise.all([
    Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5),
    CropScan.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5),
    Reward.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10)
  ]);

  normalizeUserBadges(req.user);

  res.json({
    orders,
    scans,
    rewardHistory,
    rewardPoints: req.user.rewardPoints,
    badges: req.user.badges
  });
};

export const getShopContactInfo = async (req, res) => {
  res.json({
    phone: process.env.SHOP_CONTACT_PHONE || "+91-9876543210",
    email: process.env.SHOP_CONTACT_EMAIL || "shop@example.com",
    address: process.env.SHOP_CONTACT_ADDRESS || "Main market, your city, your state"
  });
};

export const getClientRewards = async (req, res) => {
  const users = await User.find({ role: "client" })
    .select("name email rewardPoints badges")
    .sort({ rewardPoints: -1, createdAt: -1 });

  res.json(users.map((user) => ({ ...user.toObject(), badges: normalizeBadges(user.badges) })));
};

export const grantBonusReward = async (req, res) => {
  const { points, description } = req.body;
  const user = await User.findById(req.params.userId);

  if (!user || user.role !== "client") {
    return res.status(404).json({ message: "Client not found" });
  }

  await Reward.create({
    user: user._id,
    action: "bonus",
    points: Number(points),
    description: description || "Bonus reward from admin"
  });

  user.rewardPoints += Number(points);

  if (user.rewardPoints >= 50 && !user.badges.some((badge) => badge.title === "Sprout Starter")) {
    user.badges.push({
      title: "Sprout Starter",
      description: "Earned 50 reward points."
    });
  }

  if (user.rewardPoints >= 150 && !user.badges.some((badge) => badge.title === "Field Guardian")) {
    user.badges.push({
      title: "Field Guardian",
      description: "Earned 150 reward points."
    });
  }

  if (user.rewardPoints >= 300 && !user.badges.some((badge) => badge.title === "Harvest Hero")) {
    user.badges.push({
      title: "Harvest Hero",
      description: "Earned 300 reward points."
    });
  }

  normalizeUserBadges(user);
  await user.save();
  res.status(201).json(user);
};
