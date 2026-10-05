import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    careerInterests: {
      type: [String],
      default: [],
    },
    preferredRoles: {
      type: [String],
      default: [],
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ['fresher', '0-1 years', '1-3 years', '3+ years'],
      default: 'fresher',
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('StudentProfile', studentProfileSchema);