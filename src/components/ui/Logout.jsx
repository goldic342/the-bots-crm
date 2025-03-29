import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

const LogoutButton = ({ onConfirm }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Button variant="solid" onClick={onOpen} w="full" borderRadius="full">
        Выйти
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Подтверждение выхода
            </AlertDialogHeader>

            <AlertDialogBody>Вы уверены, что хотите выйти?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Отмена
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                ml={3}
              >
                Выйти
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default LogoutButton;
