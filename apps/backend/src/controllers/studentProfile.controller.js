import {
  getProfileByUserId,
  upsertProfile,
} from '../services/studentProfile.service.js';

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await getProfileByUserId(req.user.userId);

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No profile created yet',
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertMyProfile = async (req, res, next) => {
  try {
    const profile = await upsertProfile(
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};