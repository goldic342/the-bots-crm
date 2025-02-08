import { useState, useRef, useEffect } from "react";
import { Box, Textarea, IconButton, Flex } from "@chakra-ui/react";
import { ArrowUp } from "lucide-react";
import PropTypes from "prop-types";

const ChatInput = ({ onSendMessage }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && text.trim() !== "") {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() !== "") {
      onSendMessage(text);
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box p={4}>
      <Flex alignItems="flex-end">
        <Textarea
          ref={textareaRef}
          placeholder="Написать сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          mr={2}
          resize="none"
          overflow="hidden"
          overflowY={"auto"}
          rows={1}
          maxH={48}
        />
        <IconButton
          icon={<ArrowUp size={"24px"} />}
          borderRadius={"full"}
          size={"sm"}
          color={"white"}
          onClick={handleSend}
          aria-label="Отправить"
        />
      </Flex>
    </Box>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
};

export default ChatInput;
