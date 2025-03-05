import { api } from "./api";

export const getBots = async () => {
  const response = await api.get("/bot/list");

  return response.data;
};
