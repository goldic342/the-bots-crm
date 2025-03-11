import {
  createContext,
  useEffect,
  useContext,
  useRef,
  useState,
  useMemo,
} from "react";
import { useChats } from "./ChatContext";
import { useAuth } from "./AuthContext";
import camelcaseKeysDeep from "camelcase-keys-deep";

const WSContext = createContext(undefined);

export const useWS = () => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error("useWS must be used within a WSProvider");
  }
  return context;
};

export const WSProvider = ({ children }) => {
  const { addMessage, addChatUpdates } = useChats();
  const { token } = useAuth();
  const [botId, setBotId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!botId || !token) return;

    const url = `${import.meta.env.VITE_WS_BASE_URL}/v1/ws/${botId}?token=${token}`;
    const socket = new WebSocket(url);
    wsRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
    };

    socket.onclose = (event) => {
      console.log("WS closed: ", event.reason);
      setIsConnected(false);
    };

    socket.onmessage = (event) => {
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
          const ccData = camelcaseKeysDeep(data); // cc - camescase
          const leadId = ccData.lead?.id;

          if (ccData.message.direction === "incoming") {
            addChatUpdates(leadId, [ccData.message.id]);
          }
          addMessage(leadId, camelcaseKeysDeep(ccData.message));
        }
      } catch (error) {
        console.error(
          "WebSocket message error:",
          error,
          "Raw data:",
          event.data,
        );
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [botId, token, addMessage]);

  const contextValue = useMemo(
    () => ({
      isConnected,
      socket: wsRef.current,
      setBotId,
    }),
    [isConnected],
  );

  return (
    <WSContext.Provider value={contextValue}>{children}</WSContext.Provider>
  );
};
