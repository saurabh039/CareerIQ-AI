import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Question from "../models/Question.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedQuestions() {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/careeriq-ai";

  console.log("Connecting to MongoDB for question seeding...");
  await mongoose.connect(mongoUri);

  try {
    const dataFilePath = path.join(__dirname, "data", "questions.seed.json");
    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    const questions = JSON.parse(rawData);

    console.log(`Loaded ${questions.length} questions from seed data file.`);

    const operations = questions.map((q) => ({
      updateOne: {
        filter: { prompt: q.prompt },
        update: { $set: q },
        upsert: true,
      },
    }));

    const result = await Question.bulkWrite(operations);
    console.log(`Seeding complete:`);
    console.log(` - Matched: ${result.matchedCount}`);
    console.log(` - Modified: ${result.modifiedCount}`);
    console.log(` - Upserted: ${result.upsertedCount}`);

    const totalInDb = await Question.countDocuments();
    console.log(`Total questions in database: ${totalInDb}`);
    return totalInDb;
  } catch (err) {
    console.error("Error seeding questions:", err);
    throw err;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

// Run directly if invoked from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedQuestions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
