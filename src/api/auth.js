import { api } from "./api";

export const login = async (username, password) => {
  const response = await api.post("/user/auth", { username, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/user/logout");
  return response.data;
};

export const getAccessToken = async () => {
  const response = await api.post("/token/refresh");

  return response.data?.accessToken;
};

export const getMe = async () => {
  const response = await api.get("/user/me");
  return response.data;
};
