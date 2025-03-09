import { useState } from "react";
import ChatBubbleBase from "../ChatBubbleBase";
import ChatAlbumModal from "./ChatAlbumModal";
import ChatMediaDisplay from "./ChatMediaDisplay";
import { ChatMessage } from "../../../utils/types/chatTypes";

const ChatImageBubble = ({ message }) => {
  const { content, createdAt, text } = message;
  const [isModalOpen, setModalOpen] = useState(false);
  const media = {
    type: message.content.fileType,
    src: content.url,
    text,
    isOwn: message.isOwn === "outgoing",
  };

  return (
    <>
      <ChatBubbleBase
        {...message}
        includePadding={false}
        onClick={() => setModalOpen(true)} // open the full-screen modal
      >
        <ChatMediaDisplay media={media} />
      </ChatBubbleBase>

      <ChatAlbumModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        items={[media]}
        createdAt={createdAt}
      />
    </>
  );
};

ChatImageBubble.propTypes = { message: ChatMessage };
export default ChatImageBubble;
