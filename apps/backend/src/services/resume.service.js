 
import Resume from "../models/Resume.js";

export const createResume = async (resumeData) => {
  return await Resume.create(resumeData);
};

export const getUserResumes = async (userId) => {
  return await Resume.find({ userId }).sort({ createdAt: -1 });
};

export const getResumeById = async (resumeId) => {
  return await Resume.findById(resumeId);
};

export const deleteResume = async (resumeId) => {
  return await Resume.findByIdAndDelete(resumeId);
};

export const setActiveResume = async (userId, resumeId) => {
  await Resume.updateMany(
    { userId },
    { $set: { isActive: false } }
  );

  return await Resume.findByIdAndUpdate(
    resumeId,
    { isActive: true },
    { new: true }
  );
};