import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const badgeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["admin", "client"], default: "client" },
    avatar: { type: String, default: "" },
    rewardPoints: { type: Number, default: 0 },
    badges: { type: [badgeSchema], default: [] },
    lastActiveAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

userSchema.pre("save", async function savePassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
