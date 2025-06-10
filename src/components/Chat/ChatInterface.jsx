import { useEffect, useState } from "react";
import {
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useNavigate, useParams } from "react-router-dom";
import { useChats } from "../../contexts/ChatsContext";
import SpinnerLoader from "../ui/SpinnerLoader";
import { useSearch } from "../../contexts/SearchContext";
import { MESSAGES_OFFSET } from "../../constants";
import { useFetchMessages } from "../../hooks/useFetchMessages";
import { sendMessage } from "../../api/chats";
import SearchLoading from "./ChatList/Search/SearchLoading";
import AbsoluteWrapper from "../ui/AbsoluteWrapper";
import { useMessages } from "../../contexts/MessagesContext";

const ChatInterface = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { botId, chatId, folderId } = useParams();
  const navigate = useNavigate();
  const { messages, addMessages } = useMessages();
  const { currentChat, selectChat } = useChats();
  const toast = useToast();

  const [sendingMessages, setSendingMessages] = useState(new Set());
  const [lockFetch, setLockFetch] = useState(false);

  const { isFetched, setIsFetched, scrollToId } = useSearch();
  const [offset, setOffset] = useState(MESSAGES_OFFSET);
  const [getMessages, isLoadingMessages, messagesError] = useFetchMessages();

  const isCorrectChatSelected = currentChat?.id === Number(chatId);
  const isLoaded = !!isCorrectChatSelected;
  const isSearching = !!scrollToId && !isFetched && isLoaded;

  useEffect(() => {
    if (!isCorrectChatSelected) {
      setLockFetch(true);
      selectChat(chatId, botId, folderId);
      setLockFetch(false);
    }
  }, [chatId, isCorrectChatSelected, botId, folderId, selectChat]);

  useEffect(() => {
    if (isFetched || !scrollToId) return;
    setLockFetch(true);

    const list = messages[chatId];
    if (list && list.some(m => m.id === scrollToId)) {
      setIsFetched(true);
    }
  }, [messages, chatId, scrollToId, isFetched, setIsFetched, botId, folderId]);

  useEffect(() => {
    if (!scrollToId || isFetched || !isLoaded || isLoadingMessages || lockFetch)
      return;

    const fetchData = async () => {
      const newMessages = await getMessages(offset);

      if (newMessages.total === 0) {
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

      addMessages(chatId, botId, folderId, newMessages.messages);

      if (newMessages.messages.some(m => m.id === scrollToId)) {
        setIsFetched(true);
      } else {
        setOffset(prev => prev + MESSAGES_OFFSET);
      }
    };

    fetchData();
  }, [
    offset,
    isLoadingMessages,
    scrollToId,
    isFetched,
    isLoaded,
    chatId,
    toast,
    getMessages,
    addMessages,
    setIsFetched,
    botId,
    folderId,
    messages,
    lockFetch,
  ]);

  const handleSendMessage = async (text, replyMessageId = 0, file) => {
    const tempId = Date.now();
    setSendingMessages(prev => new Set(prev).add(tempId));

    try {
      await sendMessage(chatId, text, replyMessageId, file);
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
      setSendingMessages(prev => {
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

  console.log(isSearching, isLoaded);
  if (isSearching) {
    return (
      <AbsoluteWrapper isMobile={isMobile} bg={bg}>
        <SearchLoading error={messagesError} />
      </AbsoluteWrapper>
    );
  }

  if (isLoaded) {
    return (
      <AbsoluteWrapper isMobile={isMobile} bg={bg}>
        <ChatHeader onBack={handleBack} />
        <ChatMessages messages={messages[chatId]} startOffset={offset} />
        <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
      </AbsoluteWrapper>
    );
  }

  return (
    <AbsoluteWrapper isMobile={isMobile} bg={bg}>
      <SpinnerLoader />
    </AbsoluteWrapper>
  );
};

export default ChatInterface;
