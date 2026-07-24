import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";

export const registerUser = async ({ fullName, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
  });

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

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