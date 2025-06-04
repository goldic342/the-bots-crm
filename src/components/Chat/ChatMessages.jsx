import { useEffect, useRef, useState } from "react";
import {
  Box,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { AudioProvider } from "../../contexts/AudioContext";
import { ChatMessage } from "../../utils/types/chatTypes";
import DetermineChatBubble from "./DetermineChatBubble.jsx";
import useInfiniteScroll from "../../hooks/useInfiniteScroll.jsx";
import { useParams } from "react-router-dom";
import { MESSAGES_LIMIT, MESSAGES_OFFSET } from "../../constants.js";
import { useSearch } from "../../contexts/SearchContext.jsx";
import { useFetchMessages } from "../../hooks/useFetchMessages.js";
import { useMessages } from "../../contexts/MessagesContext.jsx";

const ChatMessages = ({ messages, startOffset = MESSAGES_OFFSET + 1 }) => {
  const chatContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  const { addMessages } = useMessages();
  const { chatId, botId, folderId } = useParams();

  const { scrollToId } = useSearch();

  const [offset, setOffset] = useState(startOffset);
  const [getMessages, isLoadingMessages, messagesError] = useFetchMessages();

  const { lastElementRef, stopObserving, setIsVisible } = useInfiniteScroll({
    isLoading: !messages,
    onLoadMore: loadMoreMessages,
    useEffectDropCondition: isLoadingMessages || messagesError,
  });

  useEffect(() => {
    if (!scrollToId || !chatContainerRef.current) return;

    setTimeout(() => {
      const messageElement = chatContainerRef.current.querySelector(
        `[data_msgid="${scrollToId}"]`
      );
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: "instant" });
      }
    }, 0); // Scroll only when dom is loaded
  }, [scrollToId, messages]);

  /**
   * When we load more messages at the top, we want to preserve the user's current scroll
   * position. We do this by:
   * 1) Recording the old scroll height and scroll top.
   * 2) Fetching and adding the new messages.
   * 3) After rendering, measure new scroll height and adjust scrollTop accordingly.
   */
  async function loadMoreMessages() {
    if (!chatContainerRef.current) return;
    if (messages.length < MESSAGES_LIMIT) {
      setIsVisible(false);
      stopObserving();
      return;
    }

    const oldScrollHeight = chatContainerRef.current.scrollHeight;
    const oldScrollTop = chatContainerRef.current.scrollTop;

    const newMessages = await getMessages(offset);

    if (!newMessages || !newMessages.messages?.length) {
      setIsVisible(false);
      stopObserving();
      return;
    }

    addMessages(chatId, botId, folderId, newMessages.messages);

    if ((newMessages.count ?? 0) < MESSAGES_LIMIT) {
      setIsVisible(false);
      stopObserving();
      return;
    }

    setOffset(prev => prev + MESSAGES_OFFSET);

    // 3) Wait for next render cycle; then restore scroll position
    // Using setTimeout(0) is a simple trick to wait until the DOM has updated
    setTimeout(() => {
      if (!chatContainerRef.current) return;
      const newScrollHeight = chatContainerRef.current.scrollHeight;
      // Adjust scrollTop so user sees the same spot in the conversation
      chatContainerRef.current.scrollTop =
        oldScrollTop + (newScrollHeight - oldScrollHeight);
    }, 0);
  }

  const isUserNearBottom = () => {
    if (!chatContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    return scrollHeight - (scrollTop + clientHeight) < 150;
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!messages) return;

    if (isFirstRender.current) {
      scrollToBottom();
      isFirstRender.current = false;
    } else if (isUserNearBottom()) {
      scrollToBottom();
    }
  }, [messages]);

  const bg = useColorModeValue("gray.50", "gray.800");

  return (
    <Box
      ref={chatContainerRef}
      flex="1"
      p={4}
      overflowY="auto"
      bg={bg}
      position="relative"
    >
      <AudioProvider>
        <Box h={4} w="full" ref={lastElementRef} />
        {messagesError && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {messagesError.message || "Возникла ошибка при загрузке сообщений"}
          </Alert>
        )}

        {isLoadingMessages && (
          <Box display="flex" justifyContent="center" my={4} h={4}>
            <Spinner size="md" />
          </Box>
        )}

        {messages.map(msg => (
          <DetermineChatBubble key={msg.id} message={msg} />
        ))}
      </AudioProvider>
    </Box>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(ChatMessage).isRequired,
  startOffset: PropTypes.number,
};

export default ChatMessages;
