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

export const getAllJobs = async (query) => {
  const {
    keyword,
    company,
    location,
    employmentType,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = query;

  const filter = {};

  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { skills: { $regex: keyword, $options: "i" } },
    ];
  }

  if (company) {
    filter.company = { $regex: company, $options: "i" };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (employmentType) {
    filter.employmentType = employmentType;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const jobs = await Job.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Job.countDocuments(filter);

  return {
    jobs,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
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