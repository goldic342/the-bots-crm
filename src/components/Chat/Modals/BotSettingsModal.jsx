import PropTypes from "prop-types";
import InfoModalBase from "./Base/InfoModalBase";
import { useBot } from "../../../contexts/botContext";
import { Divider, VStack } from "@chakra-ui/react";
import TemplateListMini from "../Templates/TemplateListMini";
import FolderListMini from "../ChatList/Folder/FolderListMini";

const BotSettingsModal = ({ isOpen, onClose }) => {
  const { bot } = useBot();

  const details = [
    { id: "id", label: "ID", value: bot.id, copyable: true },
    bot.phoneNumber && {
      id: "phone",
      label: "Телефон",
      value: bot.phoneNumber,
      copyable: true,
    },
    { id: "type", label: "Тип", value: bot.type },
    {
      id: "status",
      label: "Статус",
      value: bot.status,
      color: bot.status === "blocked" ? "red.500" : "green.500",
    },
  ].filter(Boolean);

  return (
    <InfoModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Настройки бота"
      avatarSrc={bot.photo}
      avatarName={bot.name}
      username={bot.username}
      details={details}
      size="lg"
    >
      <VStack align="stretch" spacing={6}>
        <FolderListMini />
        <Divider />
        <TemplateListMini />
      </VStack>
    </InfoModalBase>
  );
};

BotSettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BotSettingsModal;
