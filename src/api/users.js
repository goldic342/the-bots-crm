import { api } from "./api";

export const getUsers = async () => {
  const response = await api.get("/user/list");

  return response.data;
};

export const createUser = async (username, password, name) => {
  const response = await api.post("/user/create", { username, password, name });

  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/user/${userId}`);
  return response.data;
};
export const editUser = async (userId, username, password, name) => {
  const payload = {};
  if (username) payload.username = username;
  if (password) payload.password = password;
  if (name) payload.name = name;

  const response = await api.patch(`/user/${userId}`, payload);
  return response.data;
};
