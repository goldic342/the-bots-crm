import PropTypes from "prop-types";

export const Bot = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  totalUnreadMessages: PropTypes.number.isRequired,
  photo: PropTypes.string,
});
