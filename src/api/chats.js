import {
  CHATS_LIMIT,
  MESSAGES_LIMIT,
  SEARCH_MESSAGES_LIMIT,
} from "../constants";
import { api } from "./api";

export const getChats = async (
  botId,
  folderId = 0,
  offset = 0,
  limit = CHATS_LIMIT
) => {
  const response = await api.get(`/chats`, {
    params: {
      bot_id: botId,
      folder_id: folderId,
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
  chatId,
  offset = 0,
  limit = MESSAGES_LIMIT
) => {
  const response = await api.get(`/messages/chats/${chatId}`, {
    params: {
      offset,
      limit,
    },
  });
  return response.data;
};

export const fetchMessage = async messageId => {
  const response = await api.get(`/messages/${messageId}`);
  return response.data;
};

export const sendMessage = async (
  chatId,
  text = null,
  replyMessageId = 0,
  file = null
) => {
  const formData = new FormData();

  if (file)
    formData.append(
      "file",
      file,
      file.name || `upload_${Date.now().toString(16)}`
    );

  if (text) formData.append("text", text);
  formData.append("reply_message_id", replyMessageId);
  formData.append("chat_id", chatId);

  const response = await api.post("/messages", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const markMessagesAsRead = async (chatId, ids) => {
  const response = await api.patch(`/messages`, {
    message_ids: ids,
    chat_id: chatId,
  });
  return response.data;
};

export const searchMessages = async (
  botId,
  text_query,
  offset = 0,
  limit = SEARCH_MESSAGES_LIMIT
) => {
  const response = await api.get(`/messages/bots/${botId}`, {
    params: {
      text_query,
      offset,
      limit,
    },
  });

  return response.data;
};
