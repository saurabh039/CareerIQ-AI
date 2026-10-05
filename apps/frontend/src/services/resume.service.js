import API from "../api/axios";

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  return API.post("/v1/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getResumes = () => {
  return API.get("/v1/resumes");
};

export const getResumeById = (id) => {
  return API.get(`/v1/resumes/${id}`);
};

export const deleteResume = (id) => {
  return API.delete(`/v1/resumes/${id}`);
};