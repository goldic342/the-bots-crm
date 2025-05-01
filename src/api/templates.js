import { api } from "./api";

export const getTemplates = async (botId) => {
  const response = await api.get(`/tempate/${botId}`);
  return response.data;
};
