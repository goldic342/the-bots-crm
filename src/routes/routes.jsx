import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login.jsx";
import DashboardRoot from "../components/ui/layouts/DashboardRoot.jsx";
import Bots from "../pages/Bots.jsx";
import Users from "../pages/Users.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AuthLayout from "../components/ui/layouts/AuthLayout.jsx";

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
            path: "bots",
            element: <Bots />,
          },
          {
            path: "bots/:botId",
            element: <h1>Each bot chats here</h1>,
            children: [
              {
                path: "chat/:chatId",
                element: <h1>Current chat</h1>,
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
