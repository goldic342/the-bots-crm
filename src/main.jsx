import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./pages/Login.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import theme from "./theme/theme.js";
import { AuthProvider, AuthInterceptor } from "./contexts/AuthContext";
import DashboardRoot from "./components/DashboardRoot.jsx";
import Bots from "./pages/Bots.jsx";
import Users from "./pages/Users.jsx";

const router = createBrowserRouter([
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
        element: (
          <AuthInterceptor>
            <Bots />
          </AuthInterceptor>
        ),
      },
      {
        path: "bots/:botId",
        element: (
          <AuthInterceptor>
            <h1>Each bot chats here </h1>
          </AuthInterceptor>
        ),
        children: [
          {
            path: "chat/:chatId",
            element: (
              <AuthInterceptor>
                <h1>Current chat</h1>
              </AuthInterceptor>
            ),
          },
        ],
      },
      {
        path: "users",
        element: (
          <AuthInterceptor>
            <Users />
          </AuthInterceptor>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router}>
          <AuthInterceptor></AuthInterceptor>
        </RouterProvider>
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>,
);
