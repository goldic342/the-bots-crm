import { useState } from "react";
import ChatBubbleBase from "../ChatBubbleBase";
import ChatAlbumModal from "./ChatAlbumModal";
import ChatMediaDisplay from "./ChatMediaDisplay";
import { ChatMessage } from "../../../utils/types/chatTypes";

const ChatVideoBubble = ({ message }) => {
  const { content, text, createdAt } = message;
  const [isModalOpen, setModalOpen] = useState(false);
  const thumbnailPlaceholder = "https://placehold.co/600x400?text=Видео";
  const media = {
    type: message.content.type,
    src: content.url,
    text,
    previewUrl: thumbnailPlaceholder,
    isOwn: message.isOwn === "outgoing",
  };

  return (
    <>
      <ChatBubbleBase includePadding={false} {...message}>
        <ChatMediaDisplay media={media} onClick={() => setModalOpen(true)} />
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

ChatVideoBubble.propTypes = { message: ChatMessage };
export default ChatVideoBubble;
