import API from "../api/axios";

export const getMyProfile = () => {
  return API.get("/v1/profile");
};

export const updateMyProfile = (data) => {
  return API.put("/v1/profile", data);
};