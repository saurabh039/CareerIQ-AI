import * as practiceService from "../services/practice.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

const getUserId = (req) => {
  return req.user?.userId || req.user?.id || req.user?._id;
};

export const getCategories = async (req, res) => {
  try {
    const categories = await practiceService.getCategories();
    return successResponse(res, categories, "Categories fetched successfully");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

export const startSession = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sessionData = await practiceService.startSession(userId, req.body);
    return successResponse(
      res,
      sessionData,
      "Practice session started successfully",
      201
    );
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

export const getSession = async (req, res) => {
  try {
    const userId = getUserId(req);
    const sessionData = await practiceService.getSession(userId, req.params.id);
    return successResponse(
      res,
      sessionData,
      "Practice session fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message, 404);
  }
};

export const submitSession = async (req, res) => {
  try {
    const userId = getUserId(req);
    const result = await practiceService.submitSession(
      userId,
      req.params.id,
      req.body.answers || []
    );
    return successResponse(
      res,
      result,
      "Practice session submitted and scored successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = getUserId(req);
    const history = await practiceService.getHistory(userId, req.query);
    return successResponse(
      res,
      history,
      "Practice history fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

export const getPerformance = async (req, res) => {
  try {
    const userId = getUserId(req);
    const performance = await practiceService.getUserPerformance(userId);
    return successResponse(
      res,
      performance,
      "User performance metrics fetched successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};
