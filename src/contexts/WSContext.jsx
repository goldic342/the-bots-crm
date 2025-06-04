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
import { getChatInfo } from "../api/chats";
import { useBot } from "./botContext";
import { useRefBridge } from "../hooks/useRefBridge";
import { useMessages } from "./MessagesContext";

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
  const { chats, addChatUpdates, addChats, updateChatNewStatus } = useChats();
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

        if (data?.type === "new_message") {
          const ccData = camelcaseKeysDeep(data); // cc - camelcase
          const leadId = ccData.lead?.id;

          if (!chatsRef.current.some(c => c.lead.id === leadId)) {
            const newChat = await getChatInfo(leadId, bot.id);
            addChats([{ ...newChat, isNewChat: true }]);
          } else {
            updateChatNewStatus(leadId);
          }

          if (ccData.message.direction === "incoming") {
            addChatUpdates(leadId, [ccData.message.id]);
          }

          addMessage(leadId, camelcaseKeysDeep(ccData.message));
        }

        if (data?.type === "mark_message_as_read") {
          const ccData = camelcaseKeysDeep(data);
          const leadId = ccData.lead?.id;
          markMessagesAsReadUI(leadId, [ccData.messageIds]);
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
