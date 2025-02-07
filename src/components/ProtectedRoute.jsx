import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = ["admin", "user"] }) => {
  const { user, userLoading } = useAuth();

  // While waiting for user data (during token reinitialization), show a loading state
  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <h1>Redirect to login</h1>;
  }

  // If allowedRoles is provided, ensure the user's role is permitted
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div>Unauthorized: You do not have permission to access this page.</div>
    );
  }

  return children;
};

export default ProtectedRoute;
