import StudentProfile from '../models/StudentProfile.js';

export const getProfileByUserId = async (userId) => {
  return StudentProfile.findOne({ user: userId });
};

export const upsertProfile = async (userId, data) => {
  const allowedFields = [
    'careerInterests',
    'preferredRoles',
    'preferredLocations',
    'experienceLevel',
    'skills',
  ];

  const update = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      update[field] = data[field];
    }
  });

  return StudentProfile.findOneAndUpdate(
    { user: userId },
    { $set: update },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
  );
};