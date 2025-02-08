import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ChatBubble from "./ChatBubble";

const ChatMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box flex="1" p={4} overflowY="auto" bg="gray.50">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  isTyping: PropTypes.bool,
};

export default ChatMessages;
