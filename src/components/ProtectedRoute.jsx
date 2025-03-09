import { Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import Forbidden from "../pages/Forbidden";
import { PropTypes } from "prop-types";

const ProtectedRoute = ({ children, allowedRoles = ["admin", "manager"] }) => {
  const { user, userLoading } = useAuth();

  if (userLoading) {
    return (
      <Center h={"100vh"}>
        <Spinner size={"xl"} color="primary.500" />
      </Center>
    );
  }

  // For a case when user loading is complete, but state is not updated yet
  // Tested with low speed internet - works nice
  if (!user) return;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Forbidden />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node,
};

export default ProtectedRoute;
