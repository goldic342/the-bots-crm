import { api } from "./api";

export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};

export const createUser = async (username, password, role) => {
  const response = await api.post("/createUser", { username, password, role });

  return response.data;
};
