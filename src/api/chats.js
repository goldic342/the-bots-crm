import { api } from "./api";

export const getChats = async (botId) => {
  const response = await api.get(`/chat/${botId}`);

  return response.data;
};
