import { HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { ChatMessage } from "../../utils/types/chatTypes";
import ChatBubbleBase from "./ChatBubbleBase";
import { File } from "lucide-react";
import CRLink from "../ui/CRLink";

const ChatFileBubble = ({ message }) => {
  const fileName = message.content.url.split("/").pop();
  const isOwn = message.direction === "outgoing";

  const textColor = isOwn
    ? "white"
    : useColorModeValue("blackAlpha.700", "whiteAlpha.900");

  const bgColor = isOwn
    ? useColorModeValue("gray.100", "whiteAlpha.100")
    : useColorModeValue("blackAlpha.50", "whiteAlpha.100");

  return (
    <ChatBubbleBase {...message}>
      <HStack
        spacing={3}
        align="center"
        borderRadius="md"
        py={3}
        px={3}
        bg={bgColor}
      >
        <Icon as={File} boxSize={6} />

        <CRLink
          to={message.content.url}
          fontWeight="bold"
          _hover={{
            textDecoration: "underline",
          }}
        >
          {fileName.slice(0, 16)}...
        </CRLink>
      </HStack>
      <Text
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        userSelect="text"
        color={textColor}
        mt={1}
        _selection={{
          bg: "blackAlpha.700",
        }}
      >
        {message.text}
      </Text>
    </ChatBubbleBase>
  );
};

ChatFileBubble.propTypes = {
  message: ChatMessage.isRequired,
};

export default ChatFileBubble;
