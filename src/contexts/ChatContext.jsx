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
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [replyToMessage, setReplyToMessage] = useState(null);

  //"leadId:botId:messageId"
  const [readQueue, setReadQueue] = useState(new Set());

  const addChats = useCallback((newChats, reverse = false) => {
    setChats((prevChats) =>
      reverse ? [...newChats, ...prevChats] : [...prevChats, ...newChats],
    );
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
      if (chat && (!!chat.isNewChat || !messages[leadId])) {
        const fetchedMessages = await fetchMessages(leadId, chat.botId);
        setMessages((prevMessages) => ({
          ...prevMessages,
          [leadId]: fetchedMessages.messages.reverse(), // e.g. newest last
        }));
      }

      setCurrentChat(chat || null); // Set chat only when all data is parsed
    },
    [chats, messages],
  );

  const addChatUpdates = useCallback((leadId, value) => {
    // Adds update and move chat to the start of array
    setChats((prevChats) => {
      let updatedChat = null;
      const newChats = prevChats.filter((chat) => {
        if (chat.lead.id === Number(leadId)) {
          updatedChat = {
            ...chat,
            updates: [...(chat.updates || []), ...value],
          };
          return false; // Remove the chat from its current position
        }
        return true;
      });

      return updatedChat ? [updatedChat, ...newChats] : prevChats;
    });
  }, []);

  const removeChatUpdates = useCallback((leadId, valuesToRemove) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.lead.id === Number(leadId)
          ? {
              ...chat,
              updates: (chat.updates || []).filter(
                (update) => !valuesToRemove.includes(update),
              ),
            }
          : chat,
      ),
    );
  }, []);

  const addMessage = useCallback((leadId, message) => {
    setMessages((prevMessages) => {
      const chatMessages = prevMessages[leadId] || [];
      return { ...prevMessages, [leadId]: [...chatMessages, message] };
    });
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.lead.id === Number(leadId)
          ? { ...chat, lastMessage: message }
          : chat,
      ),
    );
  }, []);

  const addMessages = useCallback((leadId, messages) => {
    // Use when load more messages
    setMessages((prevMessages) => {
      const chatMessages = prevMessages[leadId] || [];
      return {
        ...prevMessages,
        [leadId]: [...messages.reverse(), ...chatMessages],
      };
    });
  }, []);

  const checkMessageExists = useCallback(
    (leadId, messageId) => {
      return messages[leadId]?.some((msg) => msg.id === messageId) || false;
    },
    [messages],
  );

  const handleMessageVisible = useCallback((leadId, botId, messageId) => {
    const key = `${leadId}:${botId}:${messageId}`;
    setReadQueue((prev) => new Set([...prev, key]));
  }, []);

  const markMessagesAsReadUI = useCallback((leadId, messageIds) => {
    setMessages((prev) => {
      const copy = { ...prev };
      if (!copy[leadId]) return copy;
      copy[leadId] = copy[leadId].map((msg) => {
        if (messageIds.includes(msg.id)) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
      return copy;
    });
  }, []);

  useEffect(() => {
    if (readQueue.size === 0) return;

    const timer = setTimeout(async () => {
      // Make a copy, then clear readQueue so we don't re-send duplicates
      const queueEntries = Array.from(readQueue);
      setReadQueue(new Set());

      // Group by "leadId:botId"
      const grouped = {};
      for (const entry of queueEntries) {
        const [leadIdStr, botIdStr, messageIdStr] = entry.split(":");
        const groupKey = `${leadIdStr}:${botIdStr}`;
        const messageId = Number(messageIdStr);
        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }
        grouped[groupKey].push(messageId);
      }

      // Now mark read in batches, grouped by (leadId, botId)
      for (const groupKey of Object.keys(grouped)) {
        const [leadIdStr, botIdStr] = groupKey.split(":");
        const leadId = Number(leadIdStr);
        const botId = Number(botIdStr);
        const messageIds = grouped[groupKey];

        removeChatUpdates(leadId, messageIds);

        try {
          await markMessagesAsRead(leadId, botId, messageIds);
          markMessagesAsReadUI(leadId, messageIds);
        } catch (err) {
          // Catch the error here
          console.error("Error marking messages as read:", err);
        }
      }
    }, MESSAGE_READ_DELAY_MS);

    return () => clearTimeout(timer);
  }, [readQueue, setMessages, markMessagesAsReadUI, removeChatUpdates]);
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
        addMessages,
        replyToMessage,
        setReplyToMessage,
        handleMessageVisible,
        addChatUpdates,
        removeChatUpdates,
        markMessagesAsReadUI,
        checkMessageExists,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
