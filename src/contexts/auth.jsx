import { api } from "../api/api";
import { UnauthorizedMessage } from "../config";
import {
  createContext,
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
} from "react";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  // Handles all auth logic
  // /me - retrive current access_token
  // /refreshToken get new access_token also validate refreshToken

  const [token, setToken] = useState(); // access_token

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/me");
        setToken(response.data.accessToken);
      } catch {
        setToken(null);
      }
    };
    fetchMe();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization; // keep the same headers
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const origRequest = error.config;

        if (
          error.response.status === 403 &&
          error.response.data.message === UnauthorizedMessage
        ) {
          try {
            const response = await api.get("/refreshToken");
            const newAccessToken = response.data.access_token;
            setToken(newAccessToken);

            origRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            origRequest._retry = true; // custom prop for prevent token changing

            return api(origRequest);
          } catch {
            setToken(null);
          }
        }

        // naviagte to login screen
        return Promise.reject(error);
      },
    );
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
