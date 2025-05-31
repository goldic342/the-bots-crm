import {
  CHATS_LIMIT,
  MESSAGES_LIMIT,
  SEARCH_MESSAGES_LIMIT,
} from "../constants";
import { api } from "./api";

export const getChats = async (botId, offset = 1, limit = CHATS_LIMIT) => {
  const response = await api.get(`/chat/${botId}`, {
    params: {
      offset,
      limit,
    },
  });

  return response.data;
};

export const getChatInfo = async (leadId, botId) => {
  const response = await api.get(`/chats/${botId}/${leadId}`);
  return response.data;
};

export const fetchMessages = async (
  leadId,
  botId,
  offset = 1,
  limit = MESSAGES_LIMIT,
) => {
  const response = await api.get(`/message/${botId}/${leadId}`, {
    params: {
      offset,
      limit,
    },
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

export const markMessagesAsRead = async (leadId, botId, ids) => {
  const response = await api.patch(`/message/${botId}/${leadId}/read`, { ids });
  return response.data;
};

export const searchMessages = async (
  botId,
  search_term,
  offset = 1,
  limit = SEARCH_MESSAGES_LIMIT,
) => {
  const response = await api.get(`/message/fetch/${botId}`, {
    params: {
      search_term,
      offset,
      limit,
    },
  });

  return response.data;
};
