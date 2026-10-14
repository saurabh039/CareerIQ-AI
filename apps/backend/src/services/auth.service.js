import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";

export const registerUser = async ({ fullName, email, password }) => {
  const normalizedEmail = email ? email.trim().toLowerCase() : "";
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);
  const name = fullName && fullName.trim() ? fullName.trim() : normalizedEmail.split("@")[0];

  const user = await User.create({
    fullName: name,
    email: normalizedEmail,
    passwordHash,
  });

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email ? email.trim().toLowerCase() : "";
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) throw new Error("Invalid credentials");

  const valid = await comparePassword(password, user.passwordHash);

  if (!valid) throw new Error("Invalid credentials");

  user.lastLogin = new Date();
  await user.save();

  const token = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};