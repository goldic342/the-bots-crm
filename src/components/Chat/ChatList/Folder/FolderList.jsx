import { Flex, Skeleton, useToast } from "@chakra-ui/react";
import useApiRequest from "../../../../hooks/useApiRequest";
import { useEffect, useMemo, useState } from "react";
import { getFolders } from "../../../../api/bots";
import FolderItem from "./FolderItem";
import { useBot } from "../../../../contexts/botContext";
import { useFolders } from "../../../../contexts/FoldersContext";

const FolderList = () => {
  const toast = useToast();
  const { bot } = useBot();
  const botId = bot.id;
  const { currentFolder, setCurrentFolder, addFolders, folders } = useFolders();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allChatsFolder = {
    id: 0,
    name: "Все чаты",
    botId,
    totalUnreadMessages: bot.totalUnreadMessages,
  };
  const headerFolder = folders[botId]?.[0] ?? allChatsFolder;

  const [fetchFolders, isLoading, error] = useApiRequest(
    async bId => await getFolders(bId)
  );

  useEffect(() => {
    if (currentFolder) return;
    addFolders(botId, [allChatsFolder], "set");
    setCurrentFolder(allChatsFolder);
  }, [botId, setCurrentFolder, allChatsFolder, currentFolder, addFolders]);

  useEffect(() => {
    if (!botId) return;
    const fetchData = async () => {
      const response = await fetchFolders(botId);
      if (response?.folders) {
        addFolders(botId, [headerFolder, ...response.folders], "set");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);
  useEffect(() => {
    if (error) {
      toast({
        title: "Ошибка загрузки папок",
        description: error.message || "Что-то пошло не так.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  return (
    <Flex
      gap={2}
      px={2}
      py={1}
      overflowX="auto"
      sx={{
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(160, 160, 160, 0.4)",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "rgba(160, 160, 160, 0.6)",
        },
        scrollbarColor: "rgba(160, 160, 160, 0.4) transparent",
        scrollbarWidth: "thin",
      }}
    >
      <FolderItem key={headerFolder.id} folder={headerFolder} />

      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width="100px" height="35px" borderRadius="md" />
          ))
        : folders[botId]?.map(folder => {
            if (folder.id === 0) return;
            return <FolderItem key={folder.id} folder={folder} />;
          })}
    </Flex>
  );
};

export default FolderList;
