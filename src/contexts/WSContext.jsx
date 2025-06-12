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
import { useNavigate } from "react-router-dom";
import { useFolders } from "./FoldersContext";
import { MAX_RECONNECTS, RECONNECT_DELAY } from "../constants";

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
  const {
    chats,
    addChats,
    moveChatToStart,
    mutateAllChatInstances,
    getChatFolderIds,
  } = useChats();
  const { changeUnread } = useFolders();
  const { token } = useAuth();
  const { bot, setBot } = useBot();
  const navigate = useNavigate();
  const reconnectRef = useRef(0);

  const [isConnected, setIsConnected] = useState(false);
  const [currentBotId, setCurrentBotId] = useState(0);

  const wsRef = useRef(null);
  const chatsRef = useRefBridge(chats);

  useEffect(() => {
    if (!bot.id || !token) return;
    if (currentBotId === bot.id) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const openSocket = () => {
      const url = `${import.meta.env.VITE_WS_BASE_URL}/${bot.id}?token=${token}`;
      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        reconnectRef.current = 0;
        setIsConnected(true);
        setCurrentBotId(bot.id); // ← updates guard
      };

      const scheduleReconnect = () => {
        setIsConnected(false);
        if (reconnectRef.current < MAX_RECONNECTS) {
          reconnectRef.current += 1;
          setTimeout(openSocket, RECONNECT_DELAY);
        } else {
          navigate("/"); // ← hard-fail after 3 tries
        }
      };

      socket.onerror = scheduleReconnect;
      socket.onclose = scheduleReconnect;

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

          if (data?.event === "mark_message_as_read") {
            const ccData = camelcaseKeysDeep(data);
            const update = ccData.data;
            const chatId = update.chatId;

            changeUnread(bot.id, 0, update.totalUnreadMessagesBot);

            ccData.folders.forEach(f => {
              changeUnread(bot.id, f.id, f.totalUnreadMessages);
            });

            mutateAllChatInstances(chatId, bot.id, oldChat => {
              return {
                ...oldChat,
                totalUnreadMessages: update.totalUnreadMessagesChat,
              };
            });

            markMessagesAsReadUI(chatId, update.ids);
          }

          if (data?.event === "new_message") {
            const ccData = camelcaseKeysDeep(data); // Convert keys to camelCase recursively
            const newChat = ccData.chat;
            const chatId = newChat.id;

            const botChats = chatsRef.current[bot.id];
            const chatExists =
              botChats &&
              Object.values(botChats).some(fChats =>
                fChats.some(c => c.id === chatId)
              );

            if (newChat.lastMessage.direction === "incoming") {
              changeUnread(bot.id, 0, 1, "add");

              ccData.folders.forEach(f => {
                changeUnread(bot.id, f.id, f.totalUnreadMessages);
              });
            }

            if (!chatExists) {
              addChats(
                bot.id,
                [{ ...newChat, isNewChat: true }],
                0,
                "add",
                "start"
              );
            } else {
              mutateAllChatInstances(chatId, bot.id, oldChat => {
                const updatedChat = {
                  ...oldChat,
                  ...newChat,

                  // Preserve certain fields from the old chat
                  id: oldChat.id,
                  botId: oldChat.botId,
                  isNewChat: true,
                };

                return updatedChat;
              });

              getChatFolderIds(chatId, bot.id, chatsRef.current).forEach(
                folderId => {
                  moveChatToStart(chatId, bot.id, folderId);
                }
              );
            }

            addMessage(chatId, newChat.lastMessage);
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
    };

    openSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, bot, setBot]);

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
