import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import ImageModalMenu from "./ImageModalMenu";

const ChatImageModal = ({ isOpen, onClose, imageUrl, time, albumControls }) => {
  const topMenuHeight = 60;
  const bottomFooterHeight = 60;

  const imageContainerHeight = `calc(100vh - ${topMenuHeight + bottomFooterHeight}px)`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="blackAlpha.900" />
      <ModalContent
        bg="black"
        p={0}
        m={0}
        borderRadius="none"
        overflow="hidden"
        h="100vh"
      >
        <Flex direction="column" h="100vh">
          <Flex height={`${topMenuHeight}px`} flexShrink={0}>
            <ImageModalMenu onClose={onClose} imageUrl={imageUrl} />
          </Flex>

          {albumControls && (
            <Flex p={2} bg="rgba(0, 0, 0, 0.6)" justifyContent="center">
              {albumControls}
            </Flex>
          )}

          <Flex
            height={imageContainerHeight}
            flex="1"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src={imageUrl}
              alt="Full view"
              maxH="100%"
              maxW="100%"
              objectFit="contain"
            />
          </Flex>

          {/* Bottom additional data with fixed height */}
          <Flex
            height={`${bottomFooterHeight}px`}
            p={4}
            justifyContent="center"
            alignItems="center"
            flexShrink={0}
          >
            <Text color="whiteAlpha.800" fontSize="sm">
              {time}
            </Text>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

ChatImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
  time: PropTypes.string,
  albumControls: PropTypes.node,
};

export default ChatImageModal;
