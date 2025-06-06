import { api } from "./api";

export const getBots = async () => {
  const response = await api.get("/bots");

  return response.data;
};

export const getBot = async botId => {
  const response = await api.get(`/bots/${botId}`);

  return response.data;
};

export const getUserBots = async userId => {
  const response = await api.get(`/bots`, { params: { user_id: userId } });
  return response.data;
};

export const getFolders = async botId => {
  const response = await api.get(`/bots/${botId}/folders`);
  return response.data;
};

export const createFolder = async (botId, name) => {
  const response = await api.post(`/bots/${botId}/folders`, {
    name,
  });
  return response.data;
};

export const removeFolder = async folderId => {
  const response = await api.delete(`/bots/folders/${folderId}`);
  return response.data;
};

export const getTodayUsers = async botId => {
  const response = await api.get(`/bots/${botId}/users_today`);
  return response.data;
};
