import mongoose from "mongoose";
import logger from "../config/logger.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    logger.info("MongoDB Connected Successfully");
    logger.info(`Database: ${connection.connection.name}`);
    logger.info(`Host: ${connection.connection.host}`);

  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    logger.error(error.message);
    process.exit(1);
  }
};

export default connectDB;