import { createBrowserRouter } from "react-router-dom";
import { AuthInterceptor } from "../contexts/AuthContext";
import Login from "../pages/Login.jsx";
import DashboardRoot from "../components/DashboardRoot.jsx";
import Bots from "../pages/Bots.jsx";
import Users from "../pages/Users.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthInterceptor>
        <Login />
      </AuthInterceptor>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AuthInterceptor>
        <DashboardRoot />
      </AuthInterceptor>
    ),
    children: [
      {
        path: "bots",
        element: <Bots />,
      },
      {
        path: "bots/:botId",
        element: <h1>Each bot chats here </h1>,
        children: [
          {
            path: "chat/:chatId",
            element: <h1>Current chat</h1>,
          },
        ],
      },
      {
        path: "users",
        element: <Users />,
      },
    ],
  },
]);
