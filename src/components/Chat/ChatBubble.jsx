import ChatBubbleBase from "./ChatBubbleBase";
import { Text } from "@chakra-ui/react";
import { Message } from "../../utils/types/chatTypes";

const ChatBubble = ({ message }) => {
  return (
    <ChatBubbleBase {...message}>
      <Text whiteSpace="pre-wrap" wordBreak="break-word">
        {message.text}
      </Text>
    </ChatBubbleBase>
  );
};

ChatBubble.propTypes = { message: Message };
export default ChatBubble;
