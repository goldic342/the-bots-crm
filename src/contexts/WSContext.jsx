import {
  createContext,
  useEffect,
  useContext,
  useRef,
  useState,
  useMemo,
} from "react";
import { useChats } from "./ChatsContext";
import { useAuth } from "./AuthContext";
import camelcaseKeysDeep from "camelcase-keys-deep";
import { useBot } from "./botContext";
import { useRefBridge } from "../hooks/useRefBridge";
import { useMessages } from "./MessagesContext";
import { useFolders } from "./FoldersContext";

const WSContext = createContext(undefined);

export const useWS = () => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error("useWS must be used within a WSProvider");
  }
  return context;
};

export const WSProvider = ({ children }) => {
  const { addMessage, markMessagesAsReadUI } = useMessages();
  const { chats, addChats, moveChatToStart, mutateAllChatInstances } =
    useChats();
  const { editFolder } = useFolders();
  const { token } = useAuth();
  const { bot } = useBot();

  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef(null);
  const chatsRef = useRefBridge(chats);

  useEffect(() => {
    if (!bot.id || !token) return;
    if (isConnected) return;
    if (bot.status !== "enabled") return;

    const url = `${import.meta.env.VITE_WS_BASE_URL}/${bot.id}?token=${token}`;
    const socket = new WebSocket(url);

    wsRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
    };

    socket.onclose = event => {
      setIsConnected(false);
    };

    socket.onmessage = async event => {
      try {
        let data = event.data;
        try {
          data = JSON.parse(event.data);
        } catch {
          // Fallback if data is already a string
        }

        if (data === "ping") {
          socket.send("pong");
          return;
        }

        if (data?.event === "new_message") {
          console.log("New message event received:", data);

          const ccData = camelcaseKeysDeep(data); // Convert keys to camelCase recursively
          const newChat = ccData.chat;
          const chatId = newChat.id;

          console.log("CamelCased Data:", ccData);
          console.log("New Chat ID:", chatId);

          const botChats = chatsRef.current[bot.id];
          const chatExists =
            botChats &&
            Object.values(botChats).some(fChats =>
              fChats.some(c => c.id === chatId)
            );

          if (!chatExists) {
            console.log(
              `Chat with ID ${chatId} does not exist for bot ${bot.id}, adding to start of list`
            );

            addChats(
              bot.id,
              [{ ...newChat, isNewChat: true }],
              0,
              "add",
              "start"
            );

            console.log("Chat added to start of list:", newChat);
          } else {
            console.log(
              `Chat with ID ${chatId} already exists. Updating all instances for bot ${bot.id}`
            );

            mutateAllChatInstances(chatId, bot.id, (oldChat, folderId) => {
              console.log(
                `Mutating chat instance. Folder ID: ${folderId}, Chat ID: ${chatId}, Bot ID: ${bot.id}`
              );
              console.log("Old Chat:", oldChat);
              console.log("New Chat:", newChat);

              moveChatToStart(chatId, bot.id, folderId);

              const updatedChat = {
                ...oldChat,
                ...newChat,

                // Preserve certain fields from the old chat
                id: oldChat.id,
                botId: oldChat.botId,
              };

              console.log("Updated Chat:", updatedChat);
              return updatedChat;
            });
          }

          console.log(
            `Adding last message to chat ${chatId}:`,
            newChat.lastMessage
          );
          addMessage(chatId, newChat.lastMessage);
        }

        if (data?.event === "mark_message_as_read") {
          const ccData = camelcaseKeysDeep(data);
          const update = ccData.data;
          const chatId = update.chatId;

          editFolder(bot.id, 0, update.totalUnreadMessagesBot);

          mutateAllChatInstances(chatId, bot.id, (_, __, ___, oldChat) => {
            return {
              ...oldChat,
              totalUnreadMessages: update.totalUnreadMessagesChat,
            };
          });

          markMessagesAsReadUI(chatId, update.ids);
        }
      } catch (error) {
        console.error(
          "WebSocket message error:",
          error,
          "Raw data:",
          event.data
        );
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, bot?.id]);

  const contextValue = useMemo(
    () => ({
      isConnected,
      socket: wsRef.current,
    }),
    [isConnected]
  );

  return (
    <WSContext.Provider value={contextValue}>{children}</WSContext.Provider>
  );
};
