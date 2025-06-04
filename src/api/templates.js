import { api } from "./api";

export const getTemplates = async botId => {
  const response = await api.get(`/bots/${botId}/templates`);
  return response.data;
};

export const createTemplate = async (botId, text) => {
  const response = await api.post(`/bots/${botId}/templates`, { text });
  return response.data;
};

export const removeTemplate = async (botId, templateId) => {
  const response = await api.delete(`/bots${botId}/templates/${templateId}`);
  return response.data;
};
