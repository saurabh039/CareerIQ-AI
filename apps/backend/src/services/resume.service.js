import * as resumeRepository from "../repositories/resume.repository.js";
import { parseResume } from "./resumeParser.service.js";

export const createResume = async (resumeData) => {
  // Step 1: Save resume in MongoDB
  const resume = await resumeRepository.createResume(resumeData);

  try {
    // Step 2: Send resume to AI Service
    const parsedResume = await parseResume(resume.filePath);

    // Step 3: Update resume with parsed data
    const updatedResume = await resumeRepository.updateParsedResume(
      resume._id,
      parsedResume.parsedData
    );

    // Step 4: Return updated resume
    return updatedResume;
  } catch (error) {
    console.error("Resume parsing failed:");
    console.error(error.message);

    // If parsing fails, still return the uploaded resume
    return resume;
  }
};

export const getUserResumes = async (userId) => {
  return await resumeRepository.getUserResumes(userId);
};

export const getResumeById = async (resumeId) => {
  return await resumeRepository.getResumeById(resumeId);
};

export const deleteResume = async (resumeId) => {
  return await resumeRepository.deleteResume(resumeId);
};

export const setActiveResume = async (userId, resumeId) => {
  return await resumeRepository.setActiveResume(userId, resumeId);
};