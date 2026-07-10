import { checkAIHealth } from "../services/ai.service.js";

export const getAIHealth = async (req, res) => {
  try {
    const data = await checkAIHealth();

    res.status(200).json({
      success: true,
      aiService: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};