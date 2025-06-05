import { useState } from "react";
import PropTypes from "prop-types";
import { Folder, Text } from "lucide-react";
import InfoDrawerBase from "./Base/InfoDrawerBase.jsx";

import { useBot } from "../../../contexts/botContext";
import FolderListMini from "../ChatList/Folder/FolderListMini";
import TemplateListMini from "../Templates/TemplateListMini";

const BotSettingsDrawer = ({ isOpen, onClose }) => {
  const { bot } = useBot();
  const [section, setSection] = useState(null);

  const details = [
    { id: "id", label: "ID", value: bot.id, copyable: true },
    bot.phoneNumber && {
      id: "phone",
      label: "Телефон",
      value: bot.phoneNumber ? bot.phoneNumber : "Нет",
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
      icon: Text,
      label: "Шаблоны",
      onClick: () => setSection(s => (s === "templates" ? null : "templates")),
    },
  ];

  let inner = null;
  if (section === "folders") inner = <FolderListMini />;
  if (section === "templates") inner = <TemplateListMini />;

  return (
    <InfoDrawerBase
      isOpen={isOpen}
      onClose={onClose}
      title="Настройки бота"
      avatarSrc={bot.photo}
      avatarName={bot.name}
      username={bot.username}
      details={details}
      actions={actions}
    >
      {inner}
    </InfoDrawerBase>
  );
};

BotSettingsDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BotSettingsDrawer;
