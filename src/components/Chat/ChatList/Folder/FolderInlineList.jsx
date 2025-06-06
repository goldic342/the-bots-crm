import { Box, Skeleton } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import InlineItemsList from "../../../ui/InlineItemsList";
import useApiRequest from "../../../../hooks/useApiRequest";
import { getFolders as loadFetch } from "../../../../api/bots"; // ⬅️ make sure this exists
import { useFolders } from "../../../../contexts/FoldersContext";
import { useBot } from "../../../../contexts/botContext";

const FolderInlineList = ({ Icon, onIconClick }) => {
  const { bot } = useBot();
  const botId = bot.id;
  const { folders, addFolders } = useFolders();

  const [load, loading] = useApiRequest(async () => {
    const serverFolders = await loadFetch(botId);
    addFolders(botId, serverFolders.folders);
  });

  useEffect(() => {
    if (botId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);

  const items = useMemo(() => {
    const list = folders[botId] ?? [];
    return list.map(f => ({
      id: f.id,
      label: f.name,
      icon: Icon,
      onClick: () => onIconClick?.(f),
    }));
  }, [folders, botId, Icon, onIconClick]);

  return (
    <Box pr={1} w={"full"}>
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} h="38px" mb={2} borderRadius="md" />
        ))
      ) : (
        <InlineItemsList
          items={items}
          contentMaxH="120px"
          noItemsText="Папок нет."
        />
      )}
    </Box>
  );
};

export default FolderInlineList;
