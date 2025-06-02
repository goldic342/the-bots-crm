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

  const [folders, setFolders] = useState([allChatsFolder]);
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
    <Flex gap={4} px={2} pt={1} pb={2}>
      {folders.map((f) => (
        <FolderItem key={f.id} folder={f} />
      ))}
    </Flex>
  );
};

export default FolderList;
