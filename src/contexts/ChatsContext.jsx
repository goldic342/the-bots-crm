import { createContext, useCallback, useContext, useState } from "react";
import { useFolders } from "./FoldersContext";
import { useMessages } from "./MessagesContext";

const ChatsContext = createContext(undefined);

export const useChats = () => {
  const ctx = useContext(ChatsContext);
  if (!ctx) throw new Error("useChats must be used inside <ChatsProvider>");
  return ctx;
};

/**
 * Owns the chats list per bot (optionally per folder), the **currently open**
 * chat, and helpers that mutate chat metadata.  Message bodies themselves are
 * stored in MessagesContext.
 */
export const ChatsProvider = ({ children }) => {
  // { [botId]: { [folderKey]: Chat[] } }
  const [chats, setChats] = useState({});
  const [currentChat, setCurrentChat] = useState(null);

  /* Context cooperation */
  const { currentFolder, getFolderKey } = useFolders();
  const {
    ensureMessagesLoaded,
    addMessage, // prefer calling this from outside if needed
    addMessages,
  } = useMessages();

  /* ─── CRUD & helpers ─────────────────────────────── */

  const addChats = useCallback(
    (botId, newChats, folderId, mode = "add") => {
      const folderKey = getFolderKey(folderId);
      setChats(prev => {
        const botFolders = prev[botId] || {};
        const folderChats = botFolders[folderKey] || [];

        return {
          ...prev,
          [botId]: {
            ...botFolders,
            [folderKey]: [...(mode === "add" ? folderChats : []), ...newChats],
          },
        };
      });
    },
    [getFolderKey]
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

  const updateChatNewStatus = useCallback(
    (chatId, botId, folderId, value = true) =>
      mutateOneChat(chatId, botId, folderId, chat => ({
        ...chat,
        isNewChat: value,
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

  /** Choose a chat: load messages (if needed) & clear “new” badge */
  const selectChat = useCallback(
    async (chatId, botId, folderId = currentFolder) => {
      const folderKey = getFolderKey(folderId);
      const chat = chats?.[botId]?.[folderKey]?.find(
        c => c.id === Number(chatId)
      );
      if (!chat) return;

      await ensureMessagesLoaded(chatId);
      updateChatNewStatus(chatId, botId, folderId, false);
      setCurrentChat(chat);
    },
    [
      chats,
      currentFolder,
      ensureMessagesLoaded,
      getFolderKey,
      updateChatNewStatus,
    ]
  );

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
      if (currentChat?.id === chatId) setCurrentChat(null);
    },
    [currentChat, getFolderKey]
  );

  /* Any chat-level updates you need can stay here ... */

  return (
    <ChatsContext.Provider
      value={{
        // state
        chats,
        currentChat,

        // actions
        addChats,
        selectChat,
        removeChat,
        updateChatNewStatus,
        setLastMessage,

        // Expose message helpers so consumers only need one hook
        addMessage,
        addMessages,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
