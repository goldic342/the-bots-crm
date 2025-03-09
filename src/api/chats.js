import { api } from "./api";

export const getChats = async (botId) => {
  const response = await api.get(`/chat/${botId}`);

  return response.data;
};

export const getChatInfo = async (leadId, botId) => {
  const response = await api.get(`/chat/${botId}/${leadId}`);
  return response.data;
};

export const fetchMessages = async (leadId, botId, offset = 1, limit = 100) => {
  const response = await api.get(`/message/${botId}/${leadId}`, {
    offset,
    limit,
  });
  return response.data;
};

export const fetchMessage = async (leadId, botId, messageId) => {
  const response = await api.get(`/message/${botId}/${leadId}/${messageId}`);
  return response.data;
};

export const sendMessage = async (
  leadId,
  botId,
  text = null,
  replyMessageId = 0,
  file = null,
) => {
  const formData = new FormData();
  if (file)
    formData.append(
      "file",
      file,
      file.name || `upload_${Date.now().toString(16)}`,
    );

  if (text) formData.append("text", text);
  formData.append("reply_message_id", replyMessageId);

  const response = await api.post(
    `/message/${botId}/${leadId}/send`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
