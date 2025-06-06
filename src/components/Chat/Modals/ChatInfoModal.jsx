import PropTypes from "prop-types";
import { Check } from "lucide-react";
import { useChats } from "../../../contexts/ChatsContext";
import InfoDrawerBase from "./Base/InfoDrawerBase";
import FolderInlineList from "../ChatList/Folder/FolderInlineList";
import { useFolders } from "../../../contexts/FoldersContext";
import { Box, Text, VStack } from "@chakra-ui/react";
import useApiRequest from "../../../hooks/useApiRequest";

const ChatInfoModal = ({ open, onClose }) => {
  const { currentChat } = useChats();
  const { setCurrentFolder } = useFolders(); // if you want to react on click
  const { botId, lead, status } = currentChat;

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
    <InfoDrawerBase
      isOpen={open}
      onClose={onClose}
      title="Информация о чате"
      avatarSrc={lead.photo}
      avatarName={lead.name}
      details={details}
    >
      <VStack px={6} py={2} spacing={2}>
        <Box alignSelf={"start"} pl={{ base: 0, md: 2, lg: 4 }}>
          <Text fontSize={"lg"}>Добавить чат в папку</Text>
          <Text opacity={0.7}>
            Выберите папку из списка и нажмите на иконку:{" "}
          </Text>
        </Box>
        <FolderInlineList
          Icon={Check}
          onIconClick={() => console.log("select")}
        />
      </VStack>
    </InfoDrawerBase>
  );
};

ChatInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatInfoModal;
