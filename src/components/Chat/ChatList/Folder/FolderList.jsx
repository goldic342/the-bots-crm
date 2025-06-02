import { Flex } from "@chakra-ui/react";
import { useChats } from "../../../../contexts/ChatContext";
import useApiRequest from "../../../../hooks/useApiRequest";
import { useEffect, useMemo, useState } from "react";
import { getFolders } from "../../../../api/bots";
import FolderItem from "./FolderItem";
import { useBot } from "../../../../contexts/botContext";

const FolderList = () => {
  const { bot } = useBot();
  const botId = bot.id;
  const { currentFolder, setCurrentFolder } = useChats();

  const allChatsFolder = useMemo(
    () => ({
      id: 0,
      name: "Все чаты",
      botId: botId,
      totalUnreadMessages: bot.totalUnreadMessages,
    }),
    [botId, bot],
  );

  const [folders, setFolders] = useState([
    allChatsFolder,
    {
      id: 1,
      name: "Folder 13289943204293489203",
      botId: botId,
      totalUnreadMessages: 10,
    },
    {
      id: 2,
      name: "Folder 2",
      botId: botId,
      totalUnreadMessages: 0,
    },
    {
      id: 3,
      name: "Folder 3",
      botId: botId,
      totalUnreadMessages: 0,
    },
    {
      id: 4,
      name: "Folder 4",
      botId: botId,
      totalUnreadMessages: 0,
    },
    {
      id: 5,
      name: "Folder 4",
      botId: botId,
      totalUnreadMessages: 0,
    },
    {
      id: 6,
      name: "Folder 4",
      botId: botId,
      totalUnreadMessages: 0,
    },
  ]);
  const [fetchFolders, isLoading, error] = useApiRequest(
    async (bId) => await getFolders(bId),
  );

  useEffect(() => {
    if (currentFolder) return;
    // On init set current folder to 0 (all chats)
    setCurrentFolder(allChatsFolder);
  }, [botId, setCurrentFolder, allChatsFolder, currentFolder]);

  //  useEffect(() => {
  //    const fetchData = async () => {
  //      const response = await fetchFolders(botId);
  //      setFolders((prev) => [...prev, response.folders]);
  //    };
  //
  //    fetchData();
  //    // eslint-disable-next-line react-hooks/exhaustive-deps
  //  }, []);

  return (
    <Flex
      gap={4}
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
      {folders.map((f) => (
        <FolderItem key={f.id} folder={f} />
      ))}
    </Flex>
  );
};

export default FolderList;
