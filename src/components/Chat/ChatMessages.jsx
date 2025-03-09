import { useEffect, useRef } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { AudioProvider } from "../../contexts/AudioContext";
import { ChatMessage } from "../../utils/types/chatTypes";
import DetermineChatBubble from "./DetermineChatBubble.jsx";

const ChatMessages = ({ messages }) => {
  // Complicated scroll system downthere
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const prevLength = prevMessagesLengthRef.current;
    const currLength = messages.length;

    if (messagesEndRef.current) {
      if (isFirstRender.current || currLength - prevLength > 10) {
        // First render or a large batch of messages: Instant scroll
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      } else {
        // Normal message updates: Smooth scroll
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }

    prevMessagesLengthRef.current = currLength;
    isFirstRender.current = false; // Mark that first render is done
  }, [messages]);

  const bg = useColorModeValue("gray.50", "gray.800");

  return (
    <Box flex="1" p={4} overflowY="auto" bg={bg}>
      <AudioProvider>
        {messages.map((msg) => (
          <DetermineChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </AudioProvider>
    </Box>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(ChatMessage).isRequired,
};

export default ChatMessages;
