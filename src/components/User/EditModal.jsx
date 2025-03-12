import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import UserForm from "./UserForm";
import PropTypes from "prop-types";

const EditModal = ({
  isOpen,
  onClose,
  selectedUser,
  onEdit,
  isLoading,
  error,
  setFormData,
  formData,
}) => {
  const handleEditUser = async () => {
    onEdit(selectedUser);
    if (error) return;
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
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
};

export default EditModal;
