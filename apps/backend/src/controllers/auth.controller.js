import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);

    res.json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};