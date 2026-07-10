import axios from "axios";
import logger from "../config/logger.js";

export const checkAIHealth = async () => {
  try {
    const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

    console.log("Calling AI Service:", `${AI_SERVICE_URL}/health`);

    const response = await axios.get(`${AI_SERVICE_URL}/health`);

    return response.data;
  } catch (error) {
    logger.error(error.message);

    if (error.code) {
      console.error("Code:", error.code);
    }

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    throw error;
  }
};