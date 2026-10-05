import * as resumeRepository from "../repositories/resume.repository.js";
import { parseResume } from "./resumeParser.service.js";

export const createResume = async (resumeData) => {
  // Step 1: Save uploaded resume
  const resume = await resumeRepository.createResume(resumeData);

  try {
    // Step 2: Mark resume as parsing
    await resumeRepository.updateResumeStatus(
      resume._id,
      "PARSING"
    );

    console.log(`Parsing resume: ${resume.originalFileName}`);
    console.log(`File path: ${resume.filePath}`);

    // Step 3: Send resume to AI Service
    const parsedResume = await parseResume(resume.filePath);

    // Step 4: Validate AI response
    if (
      !parsedResume ||
      !parsedResume.success ||
      !parsedResume.parsedData
    ) {
      throw new Error("AI service returned invalid resume parsing response");
    }

    // Step 5: Save parsed data
    const updatedResume =
      await resumeRepository.updateParsedResume(
        resume._id,
        parsedResume.parsedData
      );

    console.log(
      `Resume parsed successfully: ${resume.originalFileName}`
    );

    // Step 6: Return parsed resume
    return updatedResume;

  } catch (error) {
    console.error("Resume parsing failed:");
    console.error(error.message);

    // Mark resume as FAILED
    await resumeRepository.updateResumeStatus(
      resume._id,
      "FAILED"
    );

    // Return the resume so upload itself is not lost
    return await resumeRepository.getResumeById(resume._id);
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
  return await resumeRepository.setActiveResume(
    userId,
    resumeId
  );
};