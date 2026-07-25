import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Internship",
        "Contract",
        "Remote",
        "Hybrid",
        "On-site",
      ],
      default: "Full-time",
    },

    experienceLevel: {
      type: String,
      default: "",
    },

    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },

    skills: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      default: "LinkedIn",
    },

    sourceUrl: {
      type: String,
      required: true,
      unique: true,
    },

    postedDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: "text", company: "text", skills: "text" });

jobSchema.index({ location: 1 });

jobSchema.index({ company: 1 });

jobSchema.index({ employmentType: 1 });

jobSchema.index({ postedDate: -1 });

export default mongoose.model("Job", jobSchema);