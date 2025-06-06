import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Folder, Text as IconText } from "lucide-react";
import { useDisclosure, useToast } from "@chakra-ui/react";

import InfoDrawerBase from "./Base/InfoDrawerBase.jsx";
import { useBot } from "../../../contexts/botContext";

import TemplateDrawer from "../Templates/TemplateDrawer";
import FolderDrawer from "../ChatList/Folder/FolderDrawer.jsx";
import useApiRequest from "../../../hooks/useApiRequest.js";
import { getTodayUsers } from "../../../api/bots.js";

const BotSettingsDrawer = ({ isOpen, onClose }) => {
  const { bot } = useBot();
  const toast = useToast();

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

  const [usersToday, setUsersToday] = useState(0);
  const [fetchBotTodayUsers, isLoadingUsersToday, usersTodayError] =
    useApiRequest(async () => {
      const resp = await getTodayUsers(bot.id);
      if (!resp?.count) return;
      setUsersToday(resp.count);
    });

  useEffect(() => {
    if (!isOpen) return;
    fetchBotTodayUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isLoadingUsersToday) return;
    setUsersToday("Загружаем...");
  }, [isLoadingUsersToday]);

  useEffect(() => {
    if (!usersTodayError) return;
    setUsersToday("Ошибка");
    toast({
      title: "Не удалось получить кол-во пользователей за сегодня",
      description: usersTodayError,
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  }, [usersTodayError, toast]);

  const details = [
    { id: "id", label: "ID", value: bot.id, copyable: true },
    bot.phoneNumber && {
      id: "phone",
      label: "Телефон",
      value: bot.phoneNumber || "Нет",
      copyable: true,
    },
    { id: "type", label: "Тип", value: bot.type },
    { id: "usersToday", label: "Пользователей за сегодня", value: usersToday },

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
