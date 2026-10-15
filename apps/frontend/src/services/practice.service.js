import API from "../api/axios";

export const getCategories = () => {
  return API.get("/v1/practice/categories");
};

export const startSession = (data) => {
  return API.post("/v1/practice/sessions", data);
};

export const getSession = (id) => {
  return API.get(`/v1/practice/sessions/${id}`);
};

export const submitSession = (id, answers) => {
  return API.post(`/v1/practice/sessions/${id}/submit`, { answers });
};

export const getPracticeHistory = (params = {}) => {
  return API.get("/v1/practice/history", { params });
};

export const getUserPerformance = () => {
  return API.get("/v1/practice/performance");
};
