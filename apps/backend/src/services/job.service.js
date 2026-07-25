import Job from "../models/Job.js";

export const createJob = async (jobData) => {
  const existingJob = await Job.findOne({
    sourceUrl: jobData.sourceUrl,
  });

  if (existingJob) {
    throw new Error("Job already exists");
  }

  const job = await Job.create(jobData);

  return job;
};

export const getAllJobs = async () => {
  return await Job.find().sort({ createdAt: -1 });
};

export const getJobById = async (id) => {
  return await Job.findById(id);
};

export const updateJob = async (id, jobData) => {
  return await Job.findByIdAndUpdate(id, jobData, {
    new: true,
    runValidators: true,
  });
};

export const deleteJob = async (id) => {
  return await Job.findByIdAndDelete(id);
};