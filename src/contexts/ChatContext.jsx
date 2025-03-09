import { createContext, useCallback, useContext, useState } from "react";
import { fetchMessages } from "../api/chats";

const ChatContext = createContext(undefined);

export const useChats = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChats must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState({});

  const addChats = useCallback((newChats) => {
    setChats((prevChats) => [...prevChats, newChats]);
  }, []);

  const removeChat = useCallback(
    (leadId) => {
      setChats((prevChats) =>
        prevChats.filter((chat) => chat.lead.id !== leadId),
      );
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        delete newMessages[leadId];
        return newMessages;
      });
      if (currentChat?.lead.id === leadId) {
        setCurrentChat(null);
      }
    },
    [currentChat],
  );

  const selectChat = useCallback(
    async (leadId) => {
      const chat = chats.find((c) => c.lead.id === Number(leadId));
      if (chat && !messages[leadId]) {
        const fetchedMessages = await fetchMessages(leadId, chat.botId);
        setMessages((prevMessages) => ({
          ...prevMessages,
          [leadId]: fetchedMessages.messages,
        }));
      }

      setCurrentChat(chat || null); // Set chat only when all data is parsed
    },
    [chats, messages],
  );

  const addMessage = useCallback((leadId, message) => {
    setMessages((prevMessages) => {
      const chatMessages = prevMessages[leadId] || [];
      return { ...prevMessages, [leadId]: [...chatMessages, message] };
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        currentChat,
        messages,
        addChats,
        removeChat,
        selectChat,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
