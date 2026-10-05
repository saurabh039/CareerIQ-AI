import express from 'express';
import { getMyProfile, upsertMyProfile } from '../controllers/studentProfile.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();

// GET  /api/v1/profile  -> fetch the logged-in student's profile
// PUT  /api/v1/profile  -> create or update the logged-in student's profile
router.get('/', authenticate, getMyProfile);
router.put('/', authenticate, upsertMyProfile);

export default router;