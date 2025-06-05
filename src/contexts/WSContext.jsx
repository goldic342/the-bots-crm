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

    socket.onclose = () => {
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
          const ccData = camelcaseKeysDeep(data); // cc - camelcase
          const newChat = ccData.chat;
          const chatId = newChat.id;

          const botChats = chatsRef.current[bot.id];
          const chatExists =
            botChats &&
            Object.values(botChats).some(fChats =>
              fChats.some(c => c.id === chatId)
            );

          if (!chatExists) {
            addChats(bot.id, [newChat], 0, "add", "start");
          } else {
            mutateAllChatInstances(
              chatId,
              bot.id,
              (_, __, folderId, oldChat) => {
                moveChatToStart(chatId, bot.id, folderId);
                return {
                  ...oldChat,
                  ...newChat,
                  // Preserve
                  id: oldChat.id,
                  botId: oldChat.botId,
                };
              }
            );
          }

          addMessage(chatId, newChat.lastMessage);
        }

        if (data?.event === "mark_message_as_read") {
          const ccData = camelcaseKeysDeep(data);
          const chatId = ccData.chatId;
          const update = ccData.data;

          editFolder(bot.id, 0, update.totalUnreadMessagesBot);

          mutateAllChatInstances(chatId, bot.id, (_, __, ___, oldChat) => {
            return {
              ...oldChat,
              totalUnreadMessages: update.totalUnreadMessagesChat,
            };
          });

          markMessagesAsReadUI(chatId, [update.ids]);
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
    // TODO: check for dependecies - some functions use chats (not chatsRef)

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
