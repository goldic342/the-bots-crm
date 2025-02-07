import { api } from "./api";

export const login = async (username, password) => {
  const response = await api.post("/login", { username, password });
  return response.data;
};

export const logout = async () => {
  await api.post("/logout");
  return true;
};

export const getAccessToken = async () => {
  const response = await api.get("/refreshToken");

  return response.data.access_token;
};

export const getMe = async () => {
  const response = await api.get("/me");

  return response.data;
};
