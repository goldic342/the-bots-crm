import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Folder, Text as IconText } from "lucide-react"; // alias to avoid chakra’s Text
import { useDisclosure } from "@chakra-ui/react";

import InfoDrawerBase from "./Base/InfoDrawerBase.jsx";
import { useBot } from "../../../contexts/botContext";

import FolderListMini from "../ChatList/Folder/FolderListMini";
import TemplateDrawer from "../Templates/TemplateDrawer";

const BotSettingsDrawer = ({ isOpen, onClose }) => {
  const { bot } = useBot();
  const [section, setSection] = useState(null);

  const {
    isOpen: isTemplatesOpen,
    onOpen: openTemplates,
    onClose: closeTemplates,
  } = useDisclosure();

  useEffect(() => {
    if (!isOpen) closeTemplates();
  }, [isOpen, closeTemplates]);

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
      onClick: () => setSection(s => (s === "folders" ? null : "folders")),
    },
    {
      icon: IconText,
      label: "Шаблоны",
      onClick: openTemplates,
    },
  ];

  let inner = null;
  if (section === "folders") inner = <FolderListMini />;

  const handleClose = () => {
    closeTemplates();
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
      >
        {inner}
      </InfoDrawerBase>

      <TemplateDrawer isOpen={isTemplatesOpen} onClose={closeTemplates} />
    </>
  );
};

BotSettingsDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BotSettingsDrawer;
