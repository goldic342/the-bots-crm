import { useState } from "react";
import { Image } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ChatImageModal from "./ChatImageModal";
import ChatMediaWrapper from "./ChatSingleMediaWrapper";

const ChatImageBubble = ({ message }) => {
  const { src, isOwn, time } = message;
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <>
      <ChatMediaWrapper
        isOwn={isOwn}
        time={time}
        onOpen={() => setModalOpen(true)}
      >
        <Image
          src={src}
          alt="Media"
          fallbackSrc="https://placehold.co/600x400?text=Loading..."
          objectFit="cover"
          width={"full"}
          height={"auto"}
          maxW={96}
        />
      </ChatMediaWrapper>

      <ChatImageModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        src={src}
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
