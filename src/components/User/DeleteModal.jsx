// components/DeleteModal.js
import PropTypes from "prop-types";
import { Text, HStack } from "@chakra-ui/react";
import { deleteUser } from "../../api/users";
import useApiRequest from "../../hooks/useApiRequest";
import ConfirmationModal from "../ui/ConfirmationModal";

const DeleteModal = ({ isOpen, onClose, selectedUser, onDelete }) => {
  const [deleteUserReq, isLoading, error] = useApiRequest(async id => {
    return await deleteUser(id);
  });

  const handleDelete = async () => {
    await deleteUserReq(selectedUser.id);
    if (error) return;

    onDelete(selectedUser);
    onClose();
  };

  const modalBody = (
    <HStack>
      <Text>Вы уверены что хотите удалить</Text>
      <Text fontWeight="bold" color="red.300">
        {selectedUser?.name}
      </Text>
    </HStack>
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title="Подтвердите удаление"
      body={modalBody}
      confirmLabel="Удалить"
      cancelLabel="Отменить"
      onConfirm={handleDelete}
      isLoading={isLoading}
      error={error}
      confirmVariant="alert"
    />
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteModal;
