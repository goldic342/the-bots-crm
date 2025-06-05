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

/**
 * Stores message lists *per chat*, deals with the “mark as read” queue, and
 * exposes helpers for components **or other contexts** (e.g. ChatsContext).
 */
export const MessagesProvider = ({ children }) => {
  // { [chatId]: Message[] }
  const [messages, setMessages] = useState({});
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [readQueue, setReadQueue] = useState(new Set());

  const ensureMessagesLoaded = useCallback(
    async chatId => {
      if (messages[chatId]) return;

      const fetched = await fetchMessages(chatId);
      // API returns newest-first; UI wants oldest-first
      setMessages(prev => ({
        ...prev,
        [chatId]: fetched.messages.reverse(),
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

  /* ─── Mark-as-read side-effect ──────────────────────────── */

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

      /** Group by chat for efficient state updates */
      const grouped = {};
      for (const entry of entries) {
        const [chatIdStr, msgIdStr] = entry.split(":");
        const chatId = Number(chatIdStr);
        (grouped[chatId] ||= []).push(Number(msgIdStr));
      }

      try {
        await markMessagesAsRead(entries.map(e => Number(e.split(":")[1])));
        Object.entries(grouped).forEach(([cid, ids]) =>
          markMessagesAsReadUI(Number(cid), ids)
        );
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
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
