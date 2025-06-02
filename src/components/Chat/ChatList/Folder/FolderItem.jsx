import { Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useChats } from "../../../../contexts/ChatContext";

const FolderItem = ({ folder }) => {
  const { currentFolder, setCurrentFolder } = useChats();

  return (
    <Flex
      onClick={() => setCurrentFolder(folder)}
      borderBottom={"2px solid"}
      borderColor={
        currentFolder?.id === folder.id ? "primary.500" : "transparent"
      }
      transition="border-color 0.3s ease-in-out"
      justify={"center"}
      align={"center"}
      cursor={"pointer"}
      gap={2}
      p={2}
    >
      <Text fontSize={"sm"}>{folder.name}</Text>
    </Flex>
  );
};

FolderItem.propTypes = {
  folder: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    botId: PropTypes.number.isRequired,
    totalUnreadMessages: PropTypes.number.isRequired,
  }).isRequired,
};

export default FolderItem;
