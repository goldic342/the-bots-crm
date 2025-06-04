import {
  Box,
  HStack,
  IconButton,
  Input,
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFolders } from "../../../../contexts/FoldersContext";
import useApiRequest from "../../../../hooks/useApiRequest";
import {
  createFolder,
  removeFolder as removeFolderReq,
} from "../../../../api/bots";
import FolderItemMini from "./FolderItemMini";
import { useBot } from "../../../../contexts/botContext";
import useEntityManager from "../../../../hooks/useEntityManager";

const FolderListMini = () => {
  const { bot } = useBot();
  const botId = bot.id;
  const toast = useToast();
  const { folders, addFolders, removeFolder, currentFolder, setCurrentFolder } =
    useFolders();

  /* keep list fresh when modal opens */
  useEntityManager({ refresh: () => {} }, []); // folders already pre-fetched elsewhere

  /* Create folder */
  const [newName, setNewName] = useState("");
  const [createReq, creating, creatingError] = useApiRequest(async name => {
    const res = await createFolder(botId, name);
    addFolders(botId, [res.folder]);
    setNewName("");
  });

  /* Delete one */
  const [deleteReq, deleting, deletingError] = useApiRequest(async id => {
    await removeFolderReq(id);
    removeFolder(botId, id);
    if (currentFolder?.id === id) setCurrentFolder(null);
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    createReq(newName);
  };

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

  return (
    <Box px={3} py={2}>
      <HStack mb={2}>
        <Input
          size="sm"
          placeholder="Новая папка"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          isDisabled={creating}
        />
        <IconButton
          aria-label="Создать папку"
          con={<Plus size={18} />}
          size="sm"
          isLoading={creating}
          onClick={handleCreate}
        />
      </HStack>

      <HStack
        overflowX="auto"
        spacing={2}
        maxH={110}
        py={1}
        css={{ scrollbarWidth: "thin" }}
      >
        {!folders[botId]?.length && <Text>Папок нет!</Text>}

        {folders[botId]?.map(f => (
          <FolderItemMini
            key={f.id}
            folder={f}
            isActive={currentFolder?.id === f.id}
            onSelect={() => setCurrentFolder(f)}
            onDelete={() => deleteReq(f.id)}
          />
        ))}
      </HStack>
    </Box>
  );
};

export default FolderListMini;
