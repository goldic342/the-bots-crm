import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import theme from "./theme/theme.js";
import { AuthProvider, AuthInterceptor } from "./contexts/AuthContext";
import { router } from "./routes/routes.jsx";

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
