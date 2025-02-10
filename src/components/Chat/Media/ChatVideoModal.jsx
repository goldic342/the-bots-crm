import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ChatMediaModal from "./ChatMediaModal";

const ChatVideoModal = ({ isOpen, onClose, src, time, albumControls }) => {
  return (
    <ChatMediaModal
      isOpen={isOpen}
      onClose={onClose}
      mediaUrl={src}
      mediaType="image"
      time={time}
      albumControls={albumControls}
    >
      <Box
        as="video"
        src={src}
        controls
        autoPlay
        maxH="100%"
        maxW="100%"
        objectFit="contain"
      />
    </ChatMediaModal>
  );
};

ChatVideoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
  time: PropTypes.string,
  albumControls: PropTypes.node,
};

export default ChatVideoModal;
