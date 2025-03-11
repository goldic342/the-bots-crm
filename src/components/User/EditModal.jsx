import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useState } from "react";
import useApiRequest from "../../hooks/useApiRequest";
import UserForm from "./UserForm";
import { editUser } from "../../api/users";

const EditModal = ({ isOpen, onClose, selectedUser, confirmEdit }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [editUserReq, isEditingUser, editUserError] = useApiRequest(
    async () => {
      return await editUser(
        selectedUser.id,
        formData.username,
        formData.password,
        formData.name,
      );
    },
  );
  const handleEditUser = async () => {
    await editUserReq();
    setFormData({ username: "", password: "", name: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={"center"}>
          Edit {selectedUser?.name}
        </ModalHeader>
        <ModalBody>
          <UserForm
            showHeader={false}
            requiredFields={[]}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditUser}
            isLoading={isEditingUser}
            error={editUserError}
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
