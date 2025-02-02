import { api } from "./api";

export const getBots = async () => {
  const response = await api.get("/bots");

  return response.data;
};
