import { useEffect } from "react";
import PropTypes from "prop-types";
import { Folder, Text as IconText } from "lucide-react";
import { useDisclosure } from "@chakra-ui/react";

import InfoDrawerBase from "./Base/InfoDrawerBase.jsx";
import { useBot } from "../../../contexts/botContext";

import TemplateDrawer from "../Templates/TemplateDrawer";
import FolderDrawer from "../ChatList/Folder/FolderDrawer.jsx";

const BotSettingsDrawer = ({ isOpen, onClose }) => {
  const { bot } = useBot();

  // Drawer control: Templates
  const {
    isOpen: isTemplatesOpen,
    onOpen: openTemplates,
    onClose: closeTemplates,
  } = useDisclosure();

  // Drawer control: Folders
  const {
    isOpen: isFoldersOpen,
    onOpen: openFolders,
    onClose: closeFolders,
  } = useDisclosure();

  // Auto-close nested drawers when base drawer closes
  useEffect(() => {
    if (!isOpen) {
      closeTemplates();
      closeFolders();
    }
  }, [isOpen, closeTemplates, closeFolders]);

  const details = [
    { id: "id", label: "ID", value: bot.id, copyable: true },
    bot.phoneNumber && {
      id: "phone",
      label: "Телефон",
      value: bot.phoneNumber || "Нет",
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

  const actions = [
    {
      icon: Folder,
      label: "Папки",
      onClick: openFolders,
    },
    {
      icon: IconText,
      label: "Шаблоны",
      onClick: openTemplates,
    },
  ];

  const handleClose = () => {
    closeTemplates();
    closeFolders();
    onClose();
  };

  return (
    <>
      <InfoDrawerBase
        isOpen={isOpen}
        onClose={handleClose}
        title="Настройки бота"
        avatarSrc={bot.photo}
        avatarName={bot.name}
        username={bot.username}
        details={details}
        actions={actions}
      />

      <FolderDrawer isOpen={isFoldersOpen} onClose={closeFolders} />
      <TemplateDrawer isOpen={isTemplatesOpen} onClose={closeTemplates} />
    </>
  );
};

BotSettingsDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BotSettingsDrawer;
