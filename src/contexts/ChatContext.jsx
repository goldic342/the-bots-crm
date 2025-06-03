import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchMessages, markMessagesAsRead } from "../api/chats";
import { MESSAGE_READ_DELAY_MS } from "../constants";

const ChatContext = createContext(undefined);

export const useChats = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChats must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  // Shape: { [botId]: { [folderKey]: Chat[] } }
  const [chats, setChats] = useState({});

  const [currentChat, setCurrentChat] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);

  // Shape: { [chatId]: Message[] }
  const [messages, setMessages] = useState({});
  const [replyToMessage, setReplyToMessage] = useState(null);

  // "chatId:botId:messageId"
  const [readQueue, setReadQueue] = useState(new Set());

  // Null/undefined folder → 0 so it’s a plain object key
  const getFolderKey = useCallback(
    folderId => (folderId != null ? folderId : 0),
    []
  );

  /* ────────────────────────────────────────────────────────────
     Chats CRUD helpers
     ──────────────────────────────────────────────────────────── */

  const addChats = useCallback(
    (botId, newChats, folderId, mode = "add") => {
      const folderKey = getFolderKey(folderId);

      setChats(prev => {
        const botFolders = prev[botId] || {};
        const currentFolderChats = botFolders[folderKey] || [];

        return {
          ...prev,
          [botId]: {
            ...botFolders,
            [folderKey]: [
              ...(mode === "add" ? currentFolderChats : []),
              ...newChats,
            ],
          },
        };
      });
    },
    [getFolderKey]
  );

  /** Completely remove a chat from state (and its messages) */
  const removeChat = useCallback(
    (chatId, botId, folderId) => {
      const folderKey = getFolderKey(folderId);

      setChats(prev => {
        const botFolders = prev[botId] || {};
        const folderChats = botFolders[folderKey] || [];
        return {
          ...prev,
          [botId]: {
            ...botFolders,
            [folderKey]: folderChats.filter(c => c.id !== chatId),
          },
        };
      });

      setMessages(prev => {
        const m = { ...prev };
        delete m[chatId];
        return m;
      });

      if (currentChat?.id === chatId) setCurrentChat(null);
    },
    [currentChat, getFolderKey]
  );

  /** Update “isNewChat” flag on one chat */
  const updateChatNewStatus = useCallback(
    (chatId, botId, folderId, value = true) => {
      const folderKey = getFolderKey(folderId);

      setChats(prev => {
        const botFolders = prev[botId] || {};
        const folderChats = botFolders[folderKey] || [];

        return {
          ...prev,
          [botId]: {
            ...botFolders,
            [folderKey]: folderChats.map(c =>
              c.id === chatId ? { ...c, isNewChat: value } : c
            ),
          },
        };
      });
    },
    [getFolderKey]
  );

  const selectChat = useCallback(
    async (chatId, botId, folderId) => {
      const folderKey = getFolderKey(folderId);
      const chat = chats?.[botId]?.[folderKey]?.find(
        c => c.id === Number(chatId)
      );

      if (chat && !messages[chatId]) {
        const fetched = await fetchMessages(chatId);
        setMessages(prev => ({
          ...prev,
          [chatId]: fetched.messages.reverse(),
        }));
      }

      updateChatNewStatus(chatId, botId, folderId, false);
      setCurrentChat(chat || null);
    },
    [chats, messages, updateChatNewStatus, getFolderKey]
  );

  const mutateOneChat = useCallback(
    (chatId, botId, folderId, mutator) => {
      const folderKey = getFolderKey(folderId);

      setChats(prev => {
        const botFolders = prev[botId] || {};
        const folderChats = botFolders[folderKey] || [];

        return {
          ...prev,
          [botId]: {
            ...botFolders,
            [folderKey]: folderChats.map(c =>
              c.id === chatId ? mutator(c) : c
            ),
          },
        };
      });
    },
    [getFolderKey]
  );

  const addChatUpdates = useCallback(
    (chatId, botId, folderId, values) =>
      mutateOneChat(chatId, botId, folderId, chat => ({
        ...chat,
        updates: [...(chat.updates || []), ...values],
      })),
    [mutateOneChat]
  );

  const removeChatUpdates = useCallback(
    (chatId, botId, folderId, valuesToRemove) =>
      mutateOneChat(chatId, botId, folderId, chat => ({
        ...chat,
        updates: (chat.updates || []).filter(
          u => !valuesToRemove.includes(u)
        ),
      })),
    [mutateOneChat]
  );

  const setLastMessage = useCallback(
    (chatId, botId, folderId, msg) =>
      mutateOneChat(chatId, botId, folderId, chat => ({
        ...chat,
        lastMessage: msg,
      })),
    [mutateOneChat]
  );

  const addMessage = useCallback(
    (chatId, botId, folderId, message) => {
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));
      setLastMessage(chatId, botId, folderId, message);
    },
    [setLastMessage]
  );

  const addMessages = useCallback(
    (chatId, botId, folderId, msgs) => {
      const reversed = [...msgs].reverse();
      setMessages(prev => ({
        ...prev,
        [chatId]: [...reversed, ...(prev[chatId] || [])],
      }));
      const last = reversed[reversed.length - 1];
      if (last) setLastMessage(chatId, botId, folderId, last);
    },
    [setLastMessage]
  );

  const checkMessageExists = useCallback(
    (chatId, messageId) =>
      messages[chatId]?.some(m => m.id === messageId) || false,
    [messages]
  );

  const handleMessageVisible = useCallback((chatId, messageId) => {
    setReadQueue(prev => new Set(prev).add(`${chatId}:${messageId}`));
  }, []);

  const markMessagesAsReadUI = useCallback((chatId, messageIds) => {
    setMessages(prev => {
      if (!prev[chatId]) return prev;

      return {
        ...prev,
        [chatId]: prev[chatId].map(m =>
          messageIds.includes(m.id) ? { ...m, isRead: true } : m
        ),
      };
    });
  }, []);

  useEffect(() => {
    if (readQueue.size === 0) return;

    const timer = setTimeout(async () => {
      const queueEntries = Array.from(readQueue);
      setReadQueue(new Set());

      /** { [chatId]: number[] } */
      const groupedByChat = {};

      for (const entry of queueEntries) {
        const [chatIdStr, messageIdStr] = entry.split(":");
        const chatId = Number(chatIdStr);
        const messageId = Number(messageIdStr);
        (groupedByChat[chatId] ||= []).push(messageId);
      }

      const allMessageIds = queueEntries.map(entry =>
        Number(entry.split(":")[1])
      );

      try {
        await markMessagesAsRead(allMessageIds);

        for (const [chatIdStr, messageIds] of Object.entries(
          groupedByChat
        )) {
          markMessagesAsReadUI(Number(chatIdStr), messageIds);
        }
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    }, MESSAGE_READ_DELAY_MS);

    return () => clearTimeout(timer);
  }, [readQueue, markMessagesAsReadUI]);
  return (
    <ChatContext.Provider
      value={{
        // state
        chats,
        currentChat,
        messages,
        currentFolder,

        // setters  actions
        setChats,
        setCurrentFolder,
        addChats,
        removeChat,
        selectChat,
        addMessage,
        addMessages,
        replyToMessage,
        setReplyToMessage,
        handleMessageVisible,
        addChatUpdates,
        removeChatUpdates,
        markMessagesAsReadUI,
        checkMessageExists,
        updateChatNewStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
