import { api } from "./api";

export const getBots = async () => {
  const response = await api.get("/bot/list");

  return response.data;
};

export const getBot = async (botId) => {
  const response = await api.get(`/bot/${botId}`);

  return response.data;
};
