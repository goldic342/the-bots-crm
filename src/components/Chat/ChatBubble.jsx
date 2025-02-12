import PropTypes from "prop-types";
import ChatBubbleBase from "./ChatBubbleBase";
import { Text } from "@chakra-ui/react";

const ChatBubble = ({ message }) => {
  const { text, time, isOwn } = message;

  return (
    <ChatBubbleBase isOwn={isOwn} time={time}>
      <Text whiteSpace="pre-wrap" wordBreak="break-word">
        {text}
      </Text>
    </ChatBubbleBase>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.string,
    isOwn: PropTypes.bool,
  }).isRequired,
};

export default ChatBubble;
