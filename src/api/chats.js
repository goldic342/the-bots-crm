import { api } from "./api";

export const getChats = async (botId) => {
  const response = await api.get(`/chat/${botId}`);

  return response.data;
};

export const getChatInfo = async (chatId, botId) => {
  const response = await api.get(`/chat/${botId}/${chatId}`);

  return response.data;
};
