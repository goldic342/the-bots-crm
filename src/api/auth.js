import { api } from "./api";

export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getAccessToken = async () => {
  const response = await api.post("/auth/refresh");

  return response.data?.accessToken;
};

export const getMe = async () => {
  const response = await api.get("/users/me");
  return response.data;
};
