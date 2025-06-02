import { api } from "./api";

export const getBots = async () => {
  const response = await api.get("/bots");

  return response.data;
};

export const getBot = async (botId) => {
  const response = await api.get(`/bots/${botId}`);

  return response.data;
};

export const getUserBots = async (userId) => {
  const response = await api.get(`/bots/`, { params: { user_id: userId } });
  return response.data;
};

export const getFolders = async (botId) => {
  const response = await api.get(`/bots/${botId}/folders`);
  return response.data;
};
