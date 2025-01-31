import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./pages/Login.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import theme from "./theme/theme.js";
import { AuthProvider, AuthInterceptor } from "./contexts/auth.jsx";
import DashboardRoot from "./components/DashboardRoot.jsx";

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
        path: "/dashboard/bots",
        element: (
          <AuthInterceptor>
            <h1>Bots list</h1>
          </AuthInterceptor>
        ),
      },
      {
        path: "/dashboard/users",
        element: (
          <AuthInterceptor>
            <h1>Users list</h1>
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
