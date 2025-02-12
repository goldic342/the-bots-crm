import { useState } from "react";
import PropTypes from "prop-types";
import ChatBubbleBase from "../ChatBubbleBase";
import ChatAlbumModal from "./ChatAlbumModal";
import ChatMediaDisplay from "./ChatMediaDisplay";

const ChatImageBubble = ({ message }) => {
  const { src, isOwn, time } = message;
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ChatBubbleBase
        isOwn={isOwn}
        includePadding={false}
        time={time}
        onClick={() => setModalOpen(true)} // open the full-screen modal
      >
        <ChatMediaDisplay media={{ type: "img", src }} />
      </ChatBubbleBase>

      <ChatAlbumModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        items={[{ type: "img", src }]}
        time={time}
      />
    </>
  );
};

ChatImageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    time: PropTypes.string,
    isOwn: PropTypes.bool,
  }).isRequired,
};

export default ChatImageBubble;
