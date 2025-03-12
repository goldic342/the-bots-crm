import {
  Button,
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const DeleteModal = ({
  isOpen,
  onClose,
  selectedUser,
  onDelete,
  isLoading,
  error,
}) => {
  const handleDelete = () => {
    onDelete(selectedUser);
    if (error) return;
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Подтвердите удаление</ModalHeader>
        <ModalBody>
          <HStack>
            <Text>Вы уверены что хотите удалить</Text>
            <Text fontWeight={"bold"} color={"red.300"}>
              {selectedUser?.name}
            </Text>
          </HStack>
          {error && <Text color={"red.500"}>{error}</Text>}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="gray"
            onClick={onClose}
            mr={3}
            isDisabled={isLoading}
          >
            Отменить
          </Button>
          <Button bg={"red.500"} onClick={handleDelete} isLoading={isLoading}>
            Удалить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteModal;
