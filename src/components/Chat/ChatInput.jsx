import {
  Box,
  Textarea,
  IconButton,
  Flex,
  useColorModeValue,
  Spinner,
  InputGroup,
  InputRightElement,
  Input,
  Badge,
} from "@chakra-ui/react";
import { ArrowUp, Paperclip } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { useChats } from "../../contexts/ChatContext";
import useColors from "../../hooks/useColors";

const ChatInput = ({ onSendMessage, isSending }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const { currentChat } = useChats();
  const textareaRef = useRef(null);
  const sendingColor = useColorModeValue("gray.600", "gray.400");

  const isDisabled = currentChat.status !== "active";

  useEffect(() => {
    if (textareaRef.current && text.trim() !== "") {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
    if (text.trim() === "") {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() !== "" || file) {
      onSendMessage(text, 0, file);
      setText("");
      setFile(null);
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const { primary } = useColors();
  const sendButtonHoverBg = useColorModeValue("primary.600", "primary.300");

  return (
    <Box py={3} px={1} position="relative">
      <Flex alignItems="flex-end">
        <Box position="relative">
          <label htmlFor="file-upload">
            <IconButton
              isDisabled={isDisabled}
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
              _hover={{
                bg: useColorModeValue("blackAlpha.100", "whiteAlpha.300"),
              }}
              color="white"
              as="span"
            />
          </label>
          <Input
            isDisabled={isDisabled}
            id="file-upload"
            type="file"
            display="none"
            onChange={handleFileChange}
          />
          {file && (
            <Badge
              colorScheme="green"
              borderRadius="full"
              fontSize="0.7em"
              position="absolute"
              top="-2px"
              right="-2px"
              px={1}
            >
              1
            </Badge>
          )}
        </Box>

        <InputGroup>
          <Textarea
            ref={textareaRef}
            isDisabled={isDisabled}
            placeholder="Написать сообщение..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            mx={2}
            resize="none"
            overflow="hidden"
            overflowY="auto"
            rows={1}
            maxH={48}
          />
          {isSending && (
            <InputRightElement>
              <Spinner size={"sm"} color={sendingColor} mr={2} speed="0.8s" />
            </InputRightElement>
          )}
        </InputGroup>

        <IconButton
          icon={<ArrowUp size="24px" />}
          borderRadius="full"
          size="sm"
          color="white"
          bg={primary}
          _hover={{ bg: sendButtonHoverBg }}
          onClick={handleSend}
          aria-label="Отправить"
          isDisabled={isDisabled || (!text.trim() && !file)}
        />
      </Flex>
    </Box>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
};

export default ChatInput;
