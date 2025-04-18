// Media/ChatMediaModal.jsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import ChatMediaTopModalMenu from "./ChatMediaTopModalMenu";
import { transformDateTime } from "../../../utils/transformDateTime";

const ChatMediaModal = ({ isOpen, onClose, mediaUrl, createdAt, children }) => {
  const topMenuHeight = 60;
  const bottomFooterHeight = 60;
  const mediaContainerHeight = `calc(100vh - ${
    topMenuHeight + bottomFooterHeight
  }px)`;

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
          <Flex
            height={`${topMenuHeight}px`}
            flexShrink={0}
            alignItems="center"
          >
            <ChatMediaTopModalMenu onClose={onClose} mediaUrl={mediaUrl} />
          </Flex>

          <Flex
            height={mediaContainerHeight}
            flex="1"
            justifyContent="center"
            alignItems="center"
          >
            {children}
          </Flex>

          <Flex
            height={`${bottomFooterHeight}px`}
            p={4}
            justifyContent="center"
            alignItems="center"
            flexShrink={0}
          >
            {createdAt && (
              <Text color="whiteAlpha.800" fontSize="sm">
                {transformDateTime(createdAt)}
              </Text>
            )}
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

ChatMediaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mediaUrl: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ChatMediaModal;
