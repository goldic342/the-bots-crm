import { useEffect, useState } from "react";
import {
  Box,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useNavigate, useParams } from "react-router-dom";
import { useChats } from "../../contexts/ChatContext";
import SpinnerLoader from "../ui/SpinnerLoader";
import { useSearch } from "../../contexts/SearchContext";
import { MESSAGES_OFFSET } from "../../constants";
import { useFetchMessages } from "../../hooks/useFetchMessages";
import { sendMessage } from "../../api/chats";
import SearchLoading from "./ChatList/Search/SearchLoading";

const ChatInterface = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { botId, leadId } = useParams();
  const navigate = useNavigate();
  const { currentChat, selectChat, messages, addMessages } = useChats();
  const toast = useToast();

  const [sendingMessages, setSendingMessages] = useState(new Set());

  const { isFetched, setIsFetched, scrollToId } = useSearch();
  const [offset, setOffset] = useState(MESSAGES_OFFSET + 1);
  const [getMessages, isLoadingMessages, messagesError] = useFetchMessages();

  const isCorrectChatSelected = currentChat?.lead?.id === Number(leadId);
  const isLoaded = Boolean(isCorrectChatSelected);
  const isSearching = !!scrollToId && !isFetched && isLoaded;

  useEffect(() => {
    if (!isCorrectChatSelected) {
      selectChat(leadId);
    }
  }, [leadId, isCorrectChatSelected, selectChat]);

  useEffect(() => {
    if (!scrollToId || isFetched || !isLoaded || isLoadingMessages) return;

    const fetchData = async () => {
      const newMessages = await getMessages(offset);
      if (newMessages.count === 0) {
        toast({
          title: "Ошибка при поиске сообщения.",
          description: "Не удалось найти сообщение в списке.",
          duration: 2000,
          status: "error",
          position: "bottom-right",
        });
        setIsFetched(true);
        return;
      }

      addMessages(leadId, newMessages.messages);

      if (newMessages.messages.some((m) => m.id === scrollToId)) {
        setIsFetched(true);
      } else {
        setOffset((prev) => prev + MESSAGES_OFFSET);
      }
    };

    fetchData();
  }, [
    offset,
    isLoadingMessages,
    scrollToId,
    isFetched,
    isLoaded,
    leadId,
    toast,
    getMessages,
    addMessages,
    setIsFetched,
  ]);

  useEffect(() => {
    if (isFetched || !scrollToId) return;

    const list = messages[leadId];
    if (list && list.some((m) => m.id === scrollToId)) {
      setIsFetched(true);
    }
  }, [messages, leadId, scrollToId, isFetched, setIsFetched]);

  const handleSendMessage = async (text, file, replyMessageId = 0) => {
    const tempId = Date.now();
    setSendingMessages((prev) => new Set(prev).add(tempId));

    try {
      await sendMessage(leadId, botId, text, file, replyMessageId);
    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка отправки сообщения.",
        description:
          "Не удалось отправить сообщение. Если ошибка повторяется, обратитесь к администратору.",
        duration: 2000,
        status: "error",
        position: "bottom-right",
      });
    } finally {
      setSendingMessages((prev) => {
        const updated = new Set(prev);
        updated.delete(tempId);
        return updated;
      });
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/bots/${botId}`);
  };

  const bg = useColorModeValue("white", "gray.800");
  const isSending = sendingMessages.size > 0;

  if (isSearching) {
    return (
      <Box
        position={isMobile ? "absolute" : "static"}
        w="full"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={bg}
        display="flex"
        flexDirection="column"
      >
        <SearchLoading error={messagesError} />
      </Box>
    );
  }

  if (isLoaded) {
    return (
      <Box
        position={isMobile ? "absolute" : "static"}
        w="full"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={bg}
        display="flex"
        flexDirection="column"
      >
        <ChatHeader onBack={handleBack} />
        <ChatMessages messages={messages[leadId]} startOffset={offset} />
        <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
      </Box>
    );
  }

  return <SpinnerLoader />;
};

export default ChatInterface;
