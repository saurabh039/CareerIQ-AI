import mongoose from 'mongoose';
import JobIngestionService from './src/jobs/services/JobIngestionService.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        // Fallback to local if no env var
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/careeriq-ai');
        console.log("Connected to MongoDB.");

        const service = new JobIngestionService();
        console.log("Starting ingestion...");
        const result = await service.syncAllJobs();
        console.log(`Ingestion complete. Total unique jobs returned: ${result.length}`);
    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
