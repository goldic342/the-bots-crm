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
import { fetchMessages } from "../../api/chats.js";
import { useChats } from "../../contexts/ChatContext.jsx";
import { useParams } from "react-router-dom";
import useApiRequest from "../../hooks/useApiRequest.js";
import { MESSAGES_OFFSET } from "../../constants.js";

const ChatMessages = ({ messages }) => {
  const chatContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  const { addMessages } = useChats();
  const { leadId, botId } = useParams();

  const [offset, setOffset] = useState(MESSAGES_OFFSET);

  // Custom hook for API request, returning [requestFn, isLoading, error]
  const [getMessages, isLoadingMessages, messagesError] = useApiRequest(
    async (locOffset) => {
      return await fetchMessages(leadId, botId, locOffset);
    },
  );

  const { lastElementRef, stopObserving, setIsVisible } = useInfiniteScroll({
    isLoading: !messages,
    onLoadMore: loadMoreMessages,
    useEffectDropCondition: isLoadingMessages || messagesError,
  });

  /**
   * When we load more messages at the top, we want to preserve the user's current scroll
   * position. We do this by:
   * 1) Recording the old scroll height and scroll top.
   * 2) Fetching and adding the new messages.
   * 3) After rendering, measure new scroll height and adjust scrollTop accordingly.
   */
  async function loadMoreMessages() {
    if (!chatContainerRef.current) return;

    // 1) Record current scroll stats
    const oldScrollHeight = chatContainerRef.current.scrollHeight;
    const oldScrollTop = chatContainerRef.current.scrollTop;

    // 2) Fetch new messages
    const newMessages = await getMessages(offset);
    if (newMessages.count === 0) {
      setIsVisible(false);
      stopObserving();
      return;
    }
    setOffset((prev) => prev + MESSAGES_OFFSET);
    addMessages(leadId, newMessages.messages);

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

  // Auto-scroll to bottom on first render, or if user is near bottom
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
            {messagesError.message ||
              "An error occurred while loading messages."}
          </Alert>
        )}

        {isLoadingMessages && (
          <Box display="flex" justifyContent="center" my={4} h={4}>
            <Spinner size="md" />
          </Box>
        )}

        {messages.map((msg) => (
          <DetermineChatBubble key={msg.id} message={msg} />
        ))}
      </AudioProvider>
    </Box>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(ChatMessage).isRequired,
};

export default ChatMessages;
