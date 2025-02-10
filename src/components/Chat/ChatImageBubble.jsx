import { useState } from "react";
import { Flex, Image, Text, Box, useBreakpointValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ChatImageModal from "./ChatImageModal";

const ChatImageBubble = ({ message }) => {
  const { url, isOwn, time } = message;
  const [imgSize, setImgSize] = useState({ width: "100%", height: "auto" });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isModalOpen, setModalOpen] = useState(false);

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    if (naturalWidth > naturalHeight) {
      setImgSize({ width: "100%", height: "auto" });
    } else {
      setImgSize({ width: "auto", height: 56 });
    }
  };

  const onOpen = () => setModalOpen(true);
  const onClose = () => setModalOpen(false);

  return (
    <>
      <Flex
        direction="column"
        alignItems={isOwn ? "flex-end" : "flex-start"}
        mb={2}
      >
        <Box
          maxWidth="60%"
          maxHeight={96}
          overflow="hidden"
          boxShadow="sm"
          onClick={onOpen}
          cursor="pointer"
          bg="white"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderBottomLeftRadius={isOwn ? "15px" : "5px"}
          borderBottomRightRadius={isOwn ? "5px" : "15px"}
          borderTopLeftRadius="15px"
          borderTopRightRadius="15px"
        >
          <Image
            src={url}
            alt="Media"
            fallbackSrc="https://placehold.co/600x400?text=Loading..."
            objectFit="cover"
            {...imgSize}
            onLoad={handleImageLoad}
          />
        </Box>
        {time && (
          <Text fontSize="xs" mt={1} opacity={0.7}>
            {time}
          </Text>
        )}
      </Flex>

      <ChatImageModal
        isOpen={isModalOpen}
        onClose={onClose}
        imageUrl={url}
        time={time}
      />
    </>
  );
};

ChatImageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    time: PropTypes.string,
    isOwn: PropTypes.bool,
  }).isRequired,
};

export default ChatImageBubble;
