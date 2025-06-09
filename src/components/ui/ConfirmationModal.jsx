// components/common/ConfirmationModal.js
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const ConfirmationModal = ({
  isOpen,
  onClose,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading,
  isDisabled,
  error,
  confirmVariant = "solid",
  confirmColorScheme = "red",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {body}
          {error && (
            <Text color="red.500" mt={2}>
              {error}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} isDisabled={isLoading || isDisabled}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            colorScheme={confirmColorScheme}
            onClick={onConfirm}
            isLoading={isLoading}
            isDisabled={isDisabled}
          >
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  error: PropTypes.string,
  confirmVariant: PropTypes.string,
  confirmColorScheme: PropTypes.string,
};

export default ConfirmationModal;
