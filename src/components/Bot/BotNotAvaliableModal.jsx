import {
  Button,
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";

const BotNotAvaliableModal = ({ isOpen, onClose, botStatus }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Бот не доступен</ModalHeader>
        <ModalBody>
          <Text>Данный бот не доступен.</Text>
          <Text>Статус: {botStatus}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BotNotAvaliableModal;
