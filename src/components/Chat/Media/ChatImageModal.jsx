import { Image } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ChatMediaModal from "./ChatMediaModal";

const ChatImageModal = ({ isOpen, onClose, src, time, albumControls }) => {
  return (
    <ChatMediaModal
      isOpen={isOpen}
      onClose={onClose}
      mediaUrl={src}
      mediaType="image"
      time={time}
      albumControls={albumControls}
    >
      <Image
        src={src}
        alt="Full view"
        maxH="100%"
        maxW="100%"
        objectFit="contain"
      />
    </ChatMediaModal>
  );
};

ChatImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
  time: PropTypes.string,
  albumControls: PropTypes.node,
};

export default ChatImageModal;
