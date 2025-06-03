import ChatBubbleBase from "./ChatBubbleBase";
import { Text, useColorModeValue } from "@chakra-ui/react";
import { ChatMessage } from "../../utils/types/chatTypes";

const ChatBubble = ({ message }) => {
  const isOwn = message.direction === "outgoing";
  const textColor = isOwn
    ? "white"
    : useColorModeValue("blackAlpha.700", "whiteAlpha.900");

  return (
    <ChatBubbleBase {...message}>
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

ChatBubble.propTypes = { message: ChatMessage.isRequired };
export default ChatBubble;
