import PropTypes from "prop-types";
import { Menu } from "lucide-react";
import { useChats } from "../../../contexts/ChatsContext";
import InfoDrawerBase from "./Base/InfoDrawerBase";
import FolderInlineList from "../ChatList/Folder/FolderInlineList";
import {
  Box,
  Text,
  VStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
  HStack,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import useApiRequest from "../../../hooks/useApiRequest";
import { addChatToFolder, removeChatFromFolder } from "../../../api/chats";
import { useParams } from "react-router-dom";

const ChatInfoModal = ({ open, onClose }) => {
  const { currentChat } = useChats();
  const { chatId } = useParams();
  const { botId, lead, status } = currentChat;
  const initialRef = useRef();
  const toast = useToast();

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const showSuccess = msg =>
    toast({
      title: msg,
      status: "success",
      position: "bottom-right",
      duration: 3000,
    });

  const showError = useCallback(
    (action, error) => {
      const preposition = action === "add" ? "в" : "из";
      const suffix = action === "add" ? "у" : "и";
      const verb = action === "add" ? "добавить" : "удалить";

      toast({
        title: `Не удалось ${verb} чат ${preposition} папк${suffix}`,
        description: error,
        status: "error",
        position: "bottom-right",
        duration: 3000,
      });
    },
    [toast]
  );

  const [removeChat, removing, removeError] = useApiRequest(async () => {
    await removeChatFromFolder(chatId, selectedFolder.id);
    showSuccess(`Чат удален из папки "${selectedFolder.name}"`);
    setConfirmOpen(false);
  });

  const [addChat, adding, addError] = useApiRequest(async () => {
    await addChatToFolder(chatId, selectedFolder.id);
    showSuccess(`Чат добавлен в папку "${selectedFolder.name}"`);
    setConfirmOpen(false);
  });

  useEffect(() => {
    if (addError) showError("add", addError);
    if (removeError) showError("remove", removeError);
  }, [addError, removeError, showError]);

  const details = [
    { id: "leadId", label: "ID", value: lead.id, copyable: true },
    { id: "botId", label: "Бот ID", value: botId, copyable: true },
    {
      id: "status",
      label: "Статус",
      value: status,
      color: status === "blocked" ? "red.500" : "green.500",
    },
  ];

  return (
    <>
      <InfoDrawerBase
        isOpen={open}
        onClose={onClose}
        title="Информация о чате"
        avatarSrc={lead.photo}
        avatarName={lead.name}
        details={details}
      >
        <VStack px={6} py={2} spacing={3}>
          <Box alignSelf="start">
            <Text fontSize="lg">Добавить или удалить чат из папки:</Text>
          </Box>
          <FolderInlineList
            Icon={Menu}
            onIconClick={folder => {
              setSelectedFolder(folder);
              setConfirmOpen(true);
            }}
          />
        </VStack>
      </InfoDrawerBase>

      <AlertDialog
        isOpen={confirmOpen}
        leastDestructiveRef={initialRef}
        onClose={() => setConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Действие с чатом
              <AlertDialogCloseButton />
            </AlertDialogHeader>
            <AlertDialogBody>
              <HStack wrap="wrap">
                <Text fontSize={"lg"}>Что сделать с чатом в папке</Text>
                <Text fontWeight="semibold" color="teal.500" fontSize={"lg"}>
                  {selectedFolder?.name?.slice(0, 12)}...
                </Text>
              </HStack>
              <Text opacity={0.7}>Это действие можно будет отменить.</Text>
            </AlertDialogBody>
            <AlertDialogFooter pt={12}>
              <Button onClick={removeChat} isLoading={removing} variant="alert">
                Удалить из папки
              </Button>
              <Button
                onClick={addChat}
                ml={3}
                ref={initialRef}
                isLoading={adding}
              >
                Добавить в папку
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

ChatInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatInfoModal;
