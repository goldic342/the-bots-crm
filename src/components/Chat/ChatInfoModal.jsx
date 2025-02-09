import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const ChatInfoModal = ({ chat, open, onClose }) => {
  // TODO: when chat schema is known add info display here
  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chat info</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Info here</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChatInfoModal;
