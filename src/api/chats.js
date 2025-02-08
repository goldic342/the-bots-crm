import { api } from "./api";

export const getChats = async (botId) => {
  const response = await api.get(`/chats/${botId}`);

  return response.data;
};

export const getChatInfo = async (chatId) => {
  const response = await api.get(`/chat/${chatId}`);

  return response.data;
};
