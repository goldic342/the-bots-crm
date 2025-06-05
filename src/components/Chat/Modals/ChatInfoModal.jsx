import PropTypes from "prop-types";
import { useChats } from "../../../contexts/ChatsContext";
import InfoDrawerBase from "./Base/InfoDrawerBase";

const ChatInfoModal = ({ open, onClose }) => {
  const { currentChat } = useChats();
  const { botId, lead, status } = currentChat;

  const details = [
    {
      id: "leadId",
      label: "ID",
      value: lead.id,
      copyable: true,
    },
    {
      id: "botId",
      label: "Бот ID",
      value: botId,
      copyable: true,
    },
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
    />
  );
};

ChatInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatInfoModal;
