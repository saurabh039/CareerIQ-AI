import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./database/mongodb.js";
import logger from "./config/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info("CareerIQ AI Backend Started");
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();