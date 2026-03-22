import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { normalizeBadges, normalizeUserBadges } from "../utils/rewardUtils.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role, adminInviteCode } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  if (role === "admin" && adminInviteCode !== process.env.ADMIN_INVITE_CODE) {
    return res.status(403).json({ message: "Invalid admin invite code" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "admin" : "client"
  });

  normalizeUserBadges(user);

  res.status(201).json({
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rewardPoints: user.rewardPoints,
      badges: normalizeBadges(user.badges)
    }
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  user.lastActiveAt = new Date();
  normalizeUserBadges(user);
  await user.save();

  res.json({
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rewardPoints: user.rewardPoints,
      badges: normalizeBadges(user.badges)
    }
  });
};

export const getProfile = async (req, res) => {
  res.json({ user: { ...req.user.toObject(), badges: normalizeBadges(req.user.badges) } });
};
