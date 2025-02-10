import { useState } from "react";
import { Image, Box, IconButton } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Play } from "lucide-react";
import ChatMediaWrapper from "./ChatSingleMediaWrapper";
import ChatVideoModal from "./ChatVideoModal";

const ChatVideoBubble = ({ message }) => {
  const { thumbnail, src, isOwn, time } = message;
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ChatMediaWrapper
        isOwn={isOwn}
        time={time}
        onOpen={() => setModalOpen(true)}
      >
        <Box position="relative" width="full" height="auto" maxW={96}>
          <Image
            src={thumbnail}
            alt="Video"
            onClick={() => setModalOpen(true)}
            fallbackSrc="https://placehold.co/600x400?text=Loading..."
            objectFit="cover"
            width="full"
            height="auto"
          />
          <IconButton
            aria-label="Воспроизвести"
            icon={<Play />}
            onClick={() => setModalOpen(true)}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="white"
            bg={"blackAlpha.500"}
            _hover={{ bg: "blackAlpha.600" }}
            size="lg"
            borderRadius="50%"
            zIndex={1}
          />
        </Box>
      </ChatMediaWrapper>

      <ChatVideoModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        src={src}
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
