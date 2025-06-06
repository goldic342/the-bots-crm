import PropTypes from "prop-types";

const onReplyClick = PropTypes.func;

export const ChatLead = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  photo: PropTypes.string,
});

export const MessageContent = PropTypes.shape({
  type: PropTypes.oneOf(["image", "video", "file", "voice", "audio"]),
  url: PropTypes.string,
});

export const ChatBaseMessageObject = {
  direction: PropTypes.oneOf(["incoming", "outgoing"]).isRequired,
  isRead: PropTypes.bool.isRequired,
  replyMessageId: PropTypes.number,
  createdAt: PropTypes.string.isRequired,
  onReplyClick,
};
export const ChatMessageObject = {
  id: PropTypes.number.isRequired,
  chatId: PropTypes.number.isRequired,
  content: MessageContent,
  text: PropTypes.string,
  ...ChatBaseMessageObject,
};

export const ChatMessage = PropTypes.shape(ChatMessageObject);

export const ChatItem = PropTypes.shape({
  botId: PropTypes.number.isRequired,
  lead: ChatLead.isRequired,
  status: PropTypes.string.isRequired,
  totalUnreadMessages: PropTypes.number.isRequired,
  lastMessage: ChatMessage,
});

export const ChatResponse = PropTypes.shape({
  chats: PropTypes.arrayOf(ChatItem).isRequired,
  total: PropTypes.number.isRequired,
});
