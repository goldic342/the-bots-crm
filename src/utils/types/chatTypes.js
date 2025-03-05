import PropTypes from "prop-types";

const onReplyClick = PropTypes.func;

export const ChatLead = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  photo: PropTypes.string,
});

export const MessageContent = PropTypes.shape({
  fileType: PropTypes.oneOf(["image", "video", "file", "text"]),
  url: PropTypes.string.isRequired,
});

export const ChatMessage = PropTypes.shape({
  id: PropTypes.number.isRequired,
  botId: PropTypes.number.isRequired,
  leadId: PropTypes.number.isRequired,
  direction: PropTypes.oneOf(["incoming", "outgoing"]).isRequired,
  content: MessageContent,
  text: PropTypes.string.isRequired,
  isRead: PropTypes.bool.isRequired,
  repliedToMessageId: PropTypes.number,
  createdAt: PropTypes.string.isRequired,
  onReplyClick,
});

export const ChatItem = PropTypes.shape({
  botId: PropTypes.number.isRequired,
  lead: ChatLead.isRequired,
  status: PropTypes.string.isRequired,
  lastMessage: ChatMessage,
});

export const ChatResponse = PropTypes.shape({
  chats: PropTypes.arrayOf(ChatItem).isRequired,
  count: PropTypes.number.isRequired,
});
