import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import DashboardRoot from "../components/ui/layouts/DashboardRoot.jsx";
import Bots from "../pages/Bots.jsx";
import Users from "../pages/Users.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AuthLayout from "../components/ui/layouts/AuthLayout.jsx";
import Chats from "../pages/Chats.jsx";
import Settings from "../pages/Settings.jsx";
import ChatInterface from "../components/Chat/ChatInterface.jsx";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/", element: <Login /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <DashboardRoot />
          </ProtectedRoute>
        ),
        children: [
          {
            // Auto redirect to /bots
            index: true,
            element: <Navigate to="bots" replace />,
          },
          { path: "settings", element: <Settings /> },
          {
            path: "bots",
            element: <Bots />,
          },
          {
            path: "bots/:botId",
            element: <Chats />,
            children: [
              {
                path: "chat/:chatId",
                element: <ChatInterface />,
              },
            ],
          },
          {
            path: "users",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
