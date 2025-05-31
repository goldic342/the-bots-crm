import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import UserForm from "./UserForm";
import PropTypes from "prop-types";
import { editUser } from "../../api/users";
import useApiRequest from "../../hooks/useApiRequest";
import { useState } from "react";

const EditModal = ({ isOpen, onClose, selectedUser, onEdit }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });

  const [editUserReq, isLoading, error] = useApiRequest(async (id) => {
    return await editUser(
      id,
      formData.username,
      formData.password,
      formData.name,
    );
  });

  const handleEditUser = async () => {
    const newUser = await editUserReq(selectedUser.id, formData);

    if (error) return;

    setFormData({ username: "", password: "", name: "" });
    onEdit(newUser);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Редактировать: {selectedUser?.name}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <UserForm
            showHeader={false}
            requiredFields={[]}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditUser}
            isLoading={isLoading}
            error={error}
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

EditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
};

export default EditModal;
