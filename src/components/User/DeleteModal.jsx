import {
  Button,
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { deleteUser } from "../../api/users";
import useApiRequest from "../../hooks/useApiRequest";

const DeleteModal = ({ isOpen, onClose, selectedUser }) => {
  const [deleteUserReq, isDeletingUser, deleteUserError] = useApiRequest(
    async () => {
      return await deleteUser(selectedUser.id);
    },
  );
  const handleDeleteUser = async () => {
    await deleteUserReq();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete {selectedUser?.name}?
          {deleteUserError && (
            <Text>Some error happend: {deleteUserError}</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="gray"
            onClick={onClose}
            mr={3}
            isDisabled={isDeletingUser}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleDeleteUser}
            isLoading={isDeletingUser}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
