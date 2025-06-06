import { useParams } from "react-router-dom";
import { fetchMessages } from "../api/chats";
import useApiRequest from "./useApiRequest";
import { MESSAGES_LIMIT } from "../constants";

export const useFetchMessages = () => {
  const { chatId } = useParams();

  const [getMessages, isLoadingMessages, messagesError] = useApiRequest(
    async (locOffset = 1, limit = MESSAGES_LIMIT) => {
      return await fetchMessages(chatId, locOffset, limit);
    }
  );

  return [getMessages, isLoadingMessages, messagesError];
};
