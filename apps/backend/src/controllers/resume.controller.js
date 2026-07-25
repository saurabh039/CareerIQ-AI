 
import * as resumeService from "../services/resume.service.js";
import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

export const uploadResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    const resume = await resumeService.createResume({
      userId: req.user.userId || req.user.id || req.user._id,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      fileType: file.mimetype.includes("pdf") ? "pdf" : "docx",
      fileSize: file.size,
      filePath: file.path,
      status: "UPLOADED",
      isActive: true,
    });

    return successResponse(
        res,
        resume,
        "Resume uploaded successfully",
        201
        );
  } catch (err) {
    return errorResponse(
    res,
    err.message,
    500
);
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await resumeService.getUserResumes(req.user.id);

    res.json({
      success: true,
      data: resumes,
    });
  } catch (err) {
    return errorResponse(
    res,
    err.message,
    500
);
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (err) {
    return errorResponse(
    res,
    err.message,
    500
);
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await resumeService.deleteResume(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (err) {
    return errorResponse(
    res,
    err.message,
    
);
  }
};