import API from "../api/axios";

export const getJobs = (params = {}) => {
  return API.get("/jobs", {
    params,
  });
};

export const getJobById = (id) => {
  return API.get(`/jobs/${id}`);
};