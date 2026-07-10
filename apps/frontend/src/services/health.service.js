import api from "../api/axios";

export const getBackendHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};