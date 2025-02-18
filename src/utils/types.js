import PropTypes from "prop-types";

const onReplyClick = PropTypes.func;

export const ReplyTo = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.oneOf(["text", "media"]),
  text: PropTypes.string,
});

export const baseMessage = {
  id: PropTypes.string.isRequired,
  time: PropTypes.string, // TODO: make required
  isOwn: PropTypes.bool,
  replyTo: ReplyTo,
  onReplyClick,
};

export const Message = PropTypes.shape({
  ...baseMessage,
  text: PropTypes.string.isRequired,
}).isRequired;

export const MediaMessage = PropTypes.shape({
  ...baseMessage,
  src: PropTypes.string.isRequired, // Image source
}).isRequired;

export const VideoMessage = PropTypes.shape({
  ...baseMessage,
  src: PropTypes.string.isRequired, // Video source
  thumbnail: PropTypes.string.isRequired, // Video thumbnail
}).isRequired;

export const AlbumMessage = PropTypes.shape({
  ...baseMessage,
  urls: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["img", "video"]).isRequired,
      src: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
    }),
  ).isRequired,
}).isRequired;
