import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Input,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFolders } from "../../../../contexts/FoldersContext";
import { useBot } from "../../../../contexts/botContext";
import useApiRequest from "../../../../hooks/useApiRequest";
import useEntityManager from "../../../../hooks/useEntityManager";
import {
  createFolder,
  removeFolder as removeFolderReq,
} from "../../../../api/bots";
import FolderInlineList from "./FolderInlineList";
import ConfirmationModal from "../../../ui/ConfirmationModal";

const FolderDrawer = ({ isOpen, onClose }) => {
  const toast = useToast();
  const initialRef = useRef(null);
  const { bot } = useBot();
  const botId = bot.id;

  const { folders, addFolders, removeFolder, currentFolder, setCurrentFolder } =
    useFolders();

  useEntityManager({ refresh: () => {} }, []);

  const [newName, setNewName] = useState("");
  const [folderToDelete, setFolderToDelete] = useState(null); // <--- new state for modal

  const [createReq, creating, creatingError] = useApiRequest(async name => {
    const res = await createFolder(botId, name);
    addFolders(botId, [res]);
    setNewName("");
    initialRef.current?.focus();
  });

  const [deleteReq, deleting, deletingError] = useApiRequest(async id => {
    await removeFolderReq(id);
    removeFolder(botId, id);
    if (currentFolder?.id === id) setCurrentFolder(null);
  });

  useEffect(() => {
    if (!creatingError && !deletingError) return;
    toast({
      title: `Не удалось ${creatingError ? "создать" : "удалить"} папку`,
      status: "error",
      position: "bottom-right",
      duration: 3000,
      isClosable: true,
    });
  }, [creatingError, deletingError, toast]);

  const items = useMemo(() => {
    const list = folders[botId] || [];
    return list.map(folder => ({
      id: folder.id,
      label:
        folder.name +
        (folder.totalUnreadMessages > 0
          ? ` (${folder.totalUnreadMessages})`
          : ""),
      icon: X,
      onClick: () => setFolderToDelete(folder), // <--- trigger modal
    }));
  }, [folders, botId]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createReq(newName.trim());
  };

  const confirmDelete = async () => {
    if (!folderToDelete) return;
    await deleteReq(folderToDelete.id);
    setFolderToDelete(null);
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="lg"
        initialFocusRef={initialRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Папки чатов
            <Text fontSize="sm" color="gray.500" mt={1}>
              Управляйте своими папками: создавайте, удаляйте и настраивайте.
            </Text>
          </DrawerHeader>

          <DrawerBody pt={4} overflowY="auto" maxH="calc(100vh - 160px)">
            <HStack
              mb={4}
              as="form"
              onSubmit={e => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <Input
                ref={initialRef}
                placeholder="Новая папка"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Escape") setNewName("");
                }}
                size="md"
                borderRadius="md"
                isDisabled={creating}
              />
              <Tooltip label="Создать папку" hasArrow>
                <IconButton
                  aria-label="Создать папку"
                  icon={<Plus size={18} />}
                  size="md"
                  type="submit"
                  isDisabled={!newName.trim()}
                  isLoading={creating}
                />
              </Tooltip>
            </HStack>
            <FolderInlineList
              Icon={X}
              onIconClick={folder => setFolderToDelete(folder)} // <--- modal trigger
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Reusable confirmation modal */}
      <ConfirmationModal
        isOpen={!!folderToDelete}
        onClose={() => setFolderToDelete(null)}
        title="Удалить папку"
        body={
          <Text>
            Вы уверены, что хотите удалить папку{" "}
            <Text as="span" fontWeight="bold" color="red.300">
              {folderToDelete?.name}
            </Text>
            ?
          </Text>
        }
        confirmLabel="Удалить"
        cancelLabel="Отменить"
        onConfirm={confirmDelete}
        isLoading={deleting}
        error={deletingError}
        confirmVariant="alert"
      />
    </>
  );
};

export default FolderDrawer;
