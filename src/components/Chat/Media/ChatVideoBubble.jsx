import { useState } from "react";
import PropTypes from "prop-types";
import ChatBubbleBase from "../ChatBubbleBase";
import ChatAlbumModal from "./ChatAlbumModal";
import ChatMediaDisplay from "./ChatMediaDisplay";

const ChatVideoBubble = ({ message }) => {
  const { thumbnail, src, isOwn, time } = message;
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ChatBubbleBase
        isOwn={isOwn}
        includePadding={false}
        time={time}
        onClick={() => setModalOpen(true)}
      >
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

ChatVideoBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    time: PropTypes.string,
    isOwn: PropTypes.bool,
  }).isRequired,
};

export default ChatVideoBubble;
