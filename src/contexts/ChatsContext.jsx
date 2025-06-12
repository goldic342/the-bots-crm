import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFolders } from "./FoldersContext";
import { useMessages } from "./MessagesContext";
import { getChatInfo } from "../api/chats";
import { useParams } from "react-router-dom";

const ChatsContext = createContext(undefined);

export const useChats = () => {
  const ctx = useContext(ChatsContext);
  if (!ctx) throw new Error("useChats must be used inside <ChatsProvider>");
  return ctx;
};

export const ChatsProvider = ({ children }) => {
  // { [botId]: { [folderKey]: Chat[] } }
  const { botId } = useParams();
  const [chats, setChats] = useState({});
  const [currentChat, setCurrentChat] = useState(null);

  const { currentFolder, getFolderKey } = useFolders();
  const { ensureMessagesLoaded, addMessage, addMessages, setMessages } =
    useMessages();

  useEffect(() => {
    if (botId) return;
    setChats({});
    setMessages({});
  }, [botId, setMessages]);

  const addChats = useCallback(
    (botId, newChats, folderId, mode = "add", pos = "end") => {
      const folderKey = getFolderKey(folderId);

      setChats(prev => {
        const botFolders = prev[botId] || {};
        const folderChats = botFolders[folderKey] || [];

        // Only build the duplicate filter when we actually need it
        const chatsToUse =
          mode === "set"
            ? newChats // keep everything (duplicates allowed)
            : (() => {
                const existingIds = new Set(folderChats.map(c => c.id));
                return newChats.filter(c => !existingIds.has(c.id));
              })();

        let updatedChats;
        if (mode === "add") {
          updatedChats =
            pos === "start"
              ? [...chatsToUse, ...folderChats]
              : [...folderChats, ...chatsToUse];
        } else {
          // “set” replaces the list entirely
          updatedChats = [...chatsToUse];
        }

        return {
          ...prev,
          [botId]: {
            ...botFolders,
            [folderKey]: updatedChats,
          },
        };
      });
    },
    [getFolderKey]
  );

  const moveChatToStart = useCallback(
    (chatId, botId, folderId) => {
      const folderKey = getFolderKey(folderId);
      setChats(prev => {
        const botFolders = prev[botId] || {};
        const folderChats = botFolders[folderKey] || [];

        const index = folderChats.findIndex(c => c.id === chatId);
        if (index === -1) return prev;

        const chat = folderChats[index];
        const updatedChats = [
          chat,
          ...folderChats.slice(0, index),
          ...folderChats.slice(index + 1),
        ];

        return {
          ...prev,
          [botId]: {
            ...botFolders,
            [folderKey]: updatedChats,
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

  const getChatFolderIds = useCallback((chatId, botId, chats) => {
    const botChats = chats[botId];
    if (!botChats) return [];

    return (
      Object.entries(botChats)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, folderChats]) =>
          folderChats.some(chat => chat.id === chatId)
        )
        .map(([folderKey]) => folderKey)
    );
  }, []);

  const mutateAllChatInstances = useCallback((chatId, botId, mutator) => {
    setChats(prev => {
      const botChats = prev[botId];
      if (!botChats) return prev;

      const folderKeys = Object.entries(botChats)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, folderChats]) =>
          folderChats.some(chat => chat.id === chatId)
        )
        .map(([folderKey]) => folderKey);

      if (!folderKeys.length) return prev;

      const next = { ...prev };
      folderKeys.forEach(folderKey => {
        next[botId] = {
          ...next[botId],
          [folderKey]: next[botId][folderKey].map(c =>
            c.id === chatId ? mutator(c, folderKey) : c
          ),
        };
      });

      return next;
    });
  }, []);
  const updateChatNewStatus = useCallback(
    (chatId, botId, folderId, value = true) =>
      mutateOneChat(chatId, botId, folderId, chat => ({
        ...chat,
        isNewChat: value,
      })),
    [mutateOneChat]
  );

  const selectChat = useCallback(
    async (chatId, botId, folderId = currentFolder, chatInfo) => {
      const folderKey = getFolderKey(folderId);
      let chat = chats?.[botId]?.[folderKey]?.find(
        c => c.id === Number(chatId)
      );

      if (!chat) {
        chat = await getChatInfo(chatId);
      }

      await ensureMessagesLoaded(chat);
      mutateAllChatInstances(chatId, botId, oldChat => {
        return {
          ...oldChat,
          isNewChat: false,
        };
      });
      setCurrentChat(chat);
    },
    [
      mutateAllChatInstances,
      chats,
      currentFolder,
      ensureMessagesLoaded,
      getFolderKey,
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
        moveChatToStart,
        mutateAllChatInstances,
        getChatFolderIds,

        // Expose message helpers so consumers only need one hook
        addMessage,
        addMessages,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
