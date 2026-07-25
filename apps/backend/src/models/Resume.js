import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },

    storedFileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "docx"],
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["UPLOADED", "PARSING", "PARSED", "FAILED"],
      default: "UPLOADED",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    parsedData: {
      basics: {
        fullName: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
      },

      summary: {
        type: String,
        default: "",
      },

      skills: {
        type: [String],
        default: [],
      },

      education: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },

      experience: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },

      certifications: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },

      projects: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },

      languages: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resume", resumeSchema);