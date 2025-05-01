import {
  Box,
  Textarea,
  IconButton,
  Flex,
  useColorModeValue,
  Spinner,
  InputGroup,
  InputRightElement,
  Badge,
  Text,
  HStack,
  useToast,
  useOutsideClick,
} from "@chakra-ui/react";
import { ArrowUp, Plus, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { useChats } from "../../contexts/ChatContext";
import { useBot } from "../../contexts/botContext";
import useColors from "../../hooks/useColors";
import { messageToString } from "../../utils/messageToString";
import { MESSAGE_MAX_LENGHT } from "../../constants";
import ChatInputMenu from "./ChatInputMenu";

const ChatInput = ({ onSendMessage, isSending }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const toast = useToast();

  const popupRef = useRef();

  useOutsideClick({
    ref: popupRef,
    handler: () => setShowPopup(false),
  });

  const { currentChat, replyToMessage, setReplyToMessage } = useChats();
  const { bot } = useBot();

  const textareaRef = useRef(null);
  const sendingColor = useColorModeValue("gray.600", "gray.400");

  const isDisabled =
    currentChat.status !== "active" || bot.status !== "enabled";

  const { primary } = useColors();
  const sendButtonHoverBg = useColorModeValue("primary.600", "primary.300");

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
    if (text.trim().length > MESSAGE_MAX_LENGHT) {
      toast({
        title: `Максимальная длина сообщения: ${MESSAGE_MAX_LENGHT}`,
        duration: 500,
        status: "error",
        position: "bottom-right",
      });
      return;
    }
    if (text.trim() !== "" || file) {
      onSendMessage(text, replyToMessage?.id || 0, file);

      setText("");
      setFile(null);

      setReplyToMessage(null);

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

  return (
    <Box py={1} pb={2} px={1} position="relative">
      {replyToMessage && (
        <Flex
          alignItems="center"
          bg={useColorModeValue("gray.100", "gray.700")}
          px={2}
          py={1}
          borderRadius="md"
          mb={2}
          position="relative"
        >
          <HStack flex="1" pr="2rem" maxW="calc(100% - 40px)">
            <Badge colorScheme="blue" mr={1}>
              Ответ
            </Badge>
            <Text maxW={"lg"} noOfLines={1}>
              {messageToString(replyToMessage) || "Сообщение"}
            </Text>
          </HStack>
          <IconButton
            icon={<X />}
            size="xs"
            variant="ghost"
            position="absolute"
            right="4px"
            onClick={() => setReplyToMessage(null)}
            aria-label="Cancel reply"
          />
        </Flex>
      )}

      <Flex alignItems="flex-end">
        <Box position="relative">
          <IconButton
            icon={
              <Plus
                color={useColorModeValue(
                  "var(--chakra-colors-blackAlpha-600)",
                  "var(--chakra-colors-whiteAlpha-900)",
                )}
              />
            }
            size="sm"
            bg="transparent"
            onClick={() => setShowPopup((prev) => !prev)}
            _hover={{
              bg: useColorModeValue("primary.100", "primary.700"),
            }}
            aria-label="Toggle menu"
          />
          <ChatInputMenu
            show={showPopup}
            onClose={() => setShowPopup(false)}
            isDisabled={isDisabled}
            popupRef={popupRef}
            file={file}
            handleFileChange={handleFileChange}
          />
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
