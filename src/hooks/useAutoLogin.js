import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@chakra-ui/react";

export function useAutoLogin() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const devLogin = import.meta.env.VITE_DEV_LOGIN;
    const devPassword = import.meta.env.VITE_DEV_PASSWORD;

    if (!token && devLogin && devPassword) {
      (async () => {
        try {
          const { accessToken } = await login(devLogin, devPassword);
          setToken(accessToken);
          navigate("/dashboard/bots");
          toast({
            title: "Successfull autologin",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
          });
        } catch (error) {
          toast({
            title: "Failed to autologin",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom-right",
            description:
              error?.response?.data?.detail?.message ??
              error?.response?.data?.detail ??
              error?.message,
          });
        }
      })();
    }
  }, [token, setToken, navigate, toast]);
}
