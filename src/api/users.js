import { api } from "./api";

export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};

export const createUser = async (username, password, name) => {
  const response = await api.post("/users", { username, password, name });

  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const editUser = async (userId, username, password, name) => {
  const payload = {};
  if (username) payload.username = username;
  if (password) payload.password = password;
  if (name) payload.name = name;

  const response = await api.patch(`/users/${userId}`, payload);
  return response.data;
};

export const addBot = async (userId, botId) => {
  const response = await api.patch(`/users/${userId}/bots/${botId}`);
  return response.data;
};
