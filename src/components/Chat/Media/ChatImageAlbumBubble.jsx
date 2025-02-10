// Idk wht eslint thinks this is not react component x2
/* eslint-disable react-hooks/rules-of-hooks */
import PropTypes from "prop-types";

const ChatMediaAlbumBubble = ({ message }) => {};

ChatMediaAlbumBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    urls: PropTypes.arrayOf(PropTypes.string).isRequired,
    time: PropTypes.string,
    isOwn: PropTypes.bool,
  }).isRequired,
};

export default ChatMediaAlbumBubble;
