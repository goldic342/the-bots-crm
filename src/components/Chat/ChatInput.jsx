import { useState, useRef, useEffect } from "react";
import {
  Box,
  Textarea,
  IconButton,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowUp, Paperclip } from "lucide-react";
import PropTypes from "prop-types";
import useColors from "../../hooks/useColors";

const ChatInput = ({ onSendMessage }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && text.trim() !== "") {
      textareaRef.current.style.height = "auto";
      // Idk why but with 2 more pixels it same size as auto
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
    if (text.trim() == "") {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() !== "") {
      onSendMessage(text);
      setText("");

      // Refocus the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const { primary } = useColors();
  const sendButtonHoverBg = useColorModeValue("primary.600", "primary.300");

  return (
    <Box py={4} px={1}>
      <Flex alignItems="flex-end">
        <IconButton
          icon={
            <Paperclip
              color={useColorModeValue(
                "var(--chakra-colors-blackAlpha-600)",
                "var(--chakra-colors-whiteAlpha-900)",
              )}
            />
          }
          bg={"transparent"}
          size="sm"
          _hover={{ bg: useColorModeValue("blackAlpha.100", "whiteAlpha.300") }}
          color="white"
        />
        <Textarea
          ref={textareaRef}
          placeholder="Написать сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          autoFocus
          mx={2}
          resize="none"
          overflow="hidden"
          overflowY="auto"
          rows={1}
          maxH={48}
        />
        <IconButton
          icon={<ArrowUp size="24px" />}
          borderRadius="full"
          size="sm"
          color="white"
          bg={primary}
          _hover={{ bg: sendButtonHoverBg }}
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
