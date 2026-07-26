import axios from "axios";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

export const parseResume = async (filePath) => {
  const response = await axios.post(
    `${AI_SERVICE_URL}/api/parse-resume`,
    {
      filePath,
    }
  );

  return response.data;
};