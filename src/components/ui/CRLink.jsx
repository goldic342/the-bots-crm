import { Link } from "@chakra-ui/react";
import { PropTypes } from "prop-types";
import { Link as ReactRouterLink } from "react-router-dom";

const CRLink = ({ to, children, ...props }) => {
  return (
    <Link to={to} as={ReactRouterLink} {...props}>
      {children}
    </Link>
  );
};

CRLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default CRLink;
