import * as resumeService from "../services/resume.service.js";
import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

const getUserId = (req) => {
  return req.user.userId || req.user.id || req.user._id;
};

export const uploadResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in authentication token",
      });
    }

    const resume = await resumeService.createResume({
      userId,
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
    return errorResponse(res, err.message, 500);
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in authentication token",
      });
    }

    const resumes = await resumeService.getUserResumes(userId);

    return res.json({
      success: true,
      data: resumes,
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
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

    return res.json({
      success: true,
      data: resume,
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
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

    return res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};