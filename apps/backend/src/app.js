import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/api/ai", aiRoutes);
app.use(errorHandler);

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "CareerIQ AI Backend",
    version: "1.0.0",
    message: "Backend is running successfully 🚀",
  });
});

export default app;