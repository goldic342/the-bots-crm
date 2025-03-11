import { HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { ChatMessage } from "../../utils/types/chatTypes";
import ChatBubbleBase from "./ChatBubbleBase";
import { File } from "lucide-react";
import CRLink from "../ui/CRLink";
import useColors from "../../hooks/useColors";

const ChatFileBubble = ({ message }) => {
  // Extract filename from the URL
  const fileName = message.content.url.split("/").pop();
  const isOwn = message.direction === "outgoing";

  const { primary, text } = useColors();
  const textColor = isOwn
    ? "white"
    : useColorModeValue("blackAlpha.700", "whiteAlpha.900");

  const borderColor = isOwn
    ? useColorModeValue("blackAlpha.700", "whiteAlpha.700")
    : primary;

  return (
    <ChatBubbleBase {...message}>
      <HStack
        spacing={3}
        align="center"
        borderRadius="md"
        py={3}
        px={2}
        sx={
          message.text
            ? {
                borderColor: borderColor,
                borderWidth: "1px",
                borderStyle: "solid",
              }
            : {}
        }
      >
        <Icon as={File} boxSize={6} />

        <CRLink
          to={message.content.url}
          fontWeight="bold"
          _hover={{ textDecoration: "underline", transform: "scale(1.1)" }}
        >
          {fileName}
        </CRLink>
      </HStack>
      <Text
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        userSelect="text"
        color={textColor}
        _selection={{
          bg: "blackAlpha.700",
        }}
      >
        {message.text}
      </Text>
    </ChatBubbleBase>
  );
};

ChatFileBubble.propTypes = { message: ChatMessage.isRequired };
export default ChatFileBubble;
