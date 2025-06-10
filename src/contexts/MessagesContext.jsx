import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchMessages, markMessagesAsRead } from "../api/chats";
import { MESSAGE_READ_DELAY_MS } from "../constants";

const MessagesContext = createContext(undefined);

export const useMessages = () => {
  const ctx = useContext(MessagesContext);
  if (!ctx)
    throw new Error("useMessages must be used inside <MessagesProvider>");
  return ctx;
};

export const MessagesProvider = ({ children }) => {
  // { [chatId]: Message[] }
  const [messages, setMessages] = useState({});
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [readQueue, setReadQueue] = useState(new Set());

  const ensureMessagesLoaded = useCallback(
    async chat => {
      if (!chat || (!chat.isNewChat && messages[chat?.id])) return;

      const fetched = await fetchMessages(chat.id);
      // API returns newest-first; UI wants oldest-first
      setMessages(prev => ({
        ...prev,
        [chat.id]: fetched.messages.reverse(),
      }));
    },
    [messages]
  );

  const addMessage = useCallback(
    (chatId, message) =>
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      })),
    []
  );

  const addMessages = useCallback(
    (chatId, msgs) =>
      setMessages(prev => ({
        ...prev,
        [chatId]: [...msgs.reverse(), ...(prev[chatId] || [])],
      })),
    []
  );

  const checkMessageExists = useCallback(
    (chatId, messageId) =>
      messages[chatId]?.some(m => m.id === messageId) || false,
    [messages]
  );

  const handleMessageVisible = useCallback(
    (chatId, messageId) =>
      setReadQueue(prev => new Set(prev).add(`${chatId}:${messageId}`)),
    []
  );

  const markMessagesAsReadUI = useCallback(
    (chatId, messageIds) =>
      setMessages(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map(m =>
          messageIds.includes(m.id) ? { ...m, isRead: true } : m
        ),
      })),
    []
  );

  useEffect(() => {
    if (readQueue.size === 0) return;
    const timer = setTimeout(async () => {
      const entries = Array.from(readQueue);
      setReadQueue(new Set());

      const grouped = {};
      for (const entry of entries) {
        const [chatIdStr, msgIdStr] = entry.split(":");
        const chatId = Number(chatIdStr);

        grouped[chatId] ??= [];
        grouped[chatId].push(Number(msgIdStr));
      }

      Object.entries(grouped).forEach(async ([cid, ids]) => {
        try {
          await markMessagesAsRead(Number(cid), ids);
        } catch (error) {
          console.error(
            `Failed to mark message as read. ChatId: ${cid}, Message ids: ${ids}, error: ${error}`
          );
        }
      });
    }, MESSAGE_READ_DELAY_MS);

    return () => clearTimeout(timer);
  }, [readQueue, markMessagesAsReadUI]);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        replyToMessage,
        setReplyToMessage,
        ensureMessagesLoaded,
        addMessage,
        addMessages,
        checkMessageExists,
        handleMessageVisible,
        markMessagesAsReadUI,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
