import { createContext, useEffect, useContext, useRef, useState } from "react";
import { useChats } from "./ChatContext";
import camelcaseKeysDeep from "camelcase-keys-deep";
import { useAuth } from "./AuthContext";
import { WS_BASE_URL } from "../config";

const WSContext = createContext(undefined);

export const useWS = () => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error("useWS must be used within a WSProvider");
  }
  return context;
};

export const WSProvider = ({ children }) => {
  const { addMessage } = useChats();
  const { token } = useAuth();
  const [botId, setBotId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!botId || !token) return;

    console.log("ws context", botId);

    const url = `${WS_BASE_URL}/v1/ws/${botId}?token=${token}`;
    const socket = new WebSocket(url);

    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socket.onclose = (event) => {
      console.warn("WebSocket disconnected", event.reason);
      setIsConnected(false);
    };

    socket.onmessage = (event) => {
      try {
        let data = event.data;
        try {
          data = JSON.parse(event.data);
        } catch {
          //
        }

        if (data === "ping") {
          console.log("Received ping, sending pong...");
          socket.send("pong");
          return;
        }

        if (data?.type === "new_message") {
          console.log("New message received:", data);
          addMessage(data.lead?.id, camelcaseKeysDeep(data.message));
        }
      } catch (error) {
        console.error(
          "Error handling WebSocket message:",
          error,
          "Raw data:",
          event.data,
        );
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [botId, token, addMessage]);

  return (
    <WSContext.Provider
      value={{ isConnected, socket: wsRef.current, setBotId }}
    >
      {children}
    </WSContext.Provider>
  );
};
