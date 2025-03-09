import { ChatMessage } from "../../utils/types/chatTypes";
import ChatBubble from "./ChatBubble";
import ChatVideoBubble from "./Media/ChatVideoBubble";
import ChatImageBubble from "./Media/ChatImageBubble";
import ChatAudioBubble from "./Media/ChatAudioBubble";
import ChatFileBubble from "./ChatFileBubble";

const DetermineChatBubble = ({ message }) => {
  const { text, content } = message;

  if (text && !content) return <ChatBubble message={message} />;

  if (content && content.fileType === "image")
    return <ChatImageBubble message={message} />;
  if (content && content.fileType === "video")
    return <ChatVideoBubble message={message} />;
  if (content && (content.fileType === "audio" || content.fileType === "voice"))
    return <ChatAudioBubble message={message} />;

  if (content && content.fileType === "file")
    return <ChatFileBubble message={message} />;
  return null;
};

DetermineChatBubble.propTypes = {
  message: ChatMessage.isRequired,
};

export default DetermineChatBubble;
