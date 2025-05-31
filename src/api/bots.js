import { api } from "./api";

export const getBots = async () => {
  const response = await api.get("/bots");

  return response.data;
};

export const getBot = async (botId) => {
  const response = await api.get(`/bots/${botId}`);

  return response.data;
};
