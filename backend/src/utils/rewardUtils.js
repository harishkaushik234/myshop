import { Reward } from "../models/Reward.js";
import { User } from "../models/User.js";

const badgeRules = [
  {
    threshold: 50,
    badge: { title: "Sprout Starter", description: "Earned 50 reward points." }
  },
  {
    threshold: 150,
    badge: { title: "Field Guardian", description: "Earned 150 reward points." }
  },
  {
    threshold: 300,
    badge: { title: "Harvest Hero", description: "Earned 300 reward points." }
  }
];

export const normalizeBadges = (badges = []) => {
  const seen = new Set();

  return badges.filter((badge) => {
    const key = `${badge.title}::${badge.description}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const normalizeUserBadges = (user) => {
  if (!user) {
    return user;
  }

  user.badges = normalizeBadges(user.badges);
  return user;
};

export const grantReward = async ({ userId, action, points, description }) => {
  const reward = await Reward.create({ user: userId, action, points, description });
  const user = await User.findById(userId);

  if (!user) {
    return reward;
  }

  user.rewardPoints += points;

  badgeRules.forEach(({ threshold, badge }) => {
    const alreadyHasBadge = user.badges.some((entry) => entry.title === badge.title);
    if (user.rewardPoints >= threshold && !alreadyHasBadge) {
      user.badges.push(badge);
    }
  });

  normalizeUserBadges(user);
  await user.save();
  return reward;
};
