import PropTypes from "prop-types";
import { ChatMessage } from "../../utils/types/chatTypes";
import ChatBubble from "./ChatBubble";
import ChatVideoBubble from "./Media/ChatVideoBubble";
import ChatImageBubble from "./Media/ChatImageBubble";
import ChatAudioBubble from "./Media/ChatAudioBubble";
import ChatFileBubble from "./ChatFileBubble";

const bubbleComponents = {
  image: ChatImageBubble,
  video: ChatVideoBubble,
  audio: ChatAudioBubble,
  voice: ChatAudioBubble,
  file: ChatFileBubble,
};

const DetermineChatBubble = ({ message }) => {
  const { text, content } = message;

  if (text && !content) return <ChatBubble message={message} />;

  const BubbleComponent = content?.type ? bubbleComponents[content.type] : null;

  return BubbleComponent ? <BubbleComponent message={message} /> : null;
};

DetermineChatBubble.propTypes = {
  message: PropTypes.shape(ChatMessage),
};

export default DetermineChatBubble;
