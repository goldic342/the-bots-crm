import { useState } from "react";
import ChatBubbleBase from "../ChatBubbleBase";
import ChatAlbumModal from "./ChatAlbumModal";
import ChatMediaDisplay from "./ChatMediaDisplay";
import { VideoMessage } from "../../../utils/types/chatTypes";

const ChatVideoBubble = ({ message }) => {
  const { thumbnail, src, time } = message;
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ChatBubbleBase includePadding={false} onClick={() => setModalOpen(true)}>
        <ChatMediaDisplay
          media={{
            type: "video",
            src,
            thumbnail,
          }}
        />
      </ChatBubbleBase>

      <ChatAlbumModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        items={[{ type: "video", src, thumbnail }]}
        time={time}
      />
    </>
  );
};

ChatVideoBubble.propTypes = { message: VideoMessage };
export default ChatVideoBubble;
