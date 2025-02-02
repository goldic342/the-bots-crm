import { createContext, useState, useContext, useLayoutEffect } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { UnauthorizedMessage } from "../config";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token // !config._retry to avoid multiple requests
          ? `Bearer ${token}`
          : config.headers.Authorization; // keep the same headers
      return config;
    });
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthInterceptor = ({ children }) => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    let isRefreshing = false;
    let refreshQueue = [];

    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response?.status === 403 &&
          error.response?.data?.detail === UnauthorizedMessage
        ) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const response = await api.get("/refreshToken");
              const newAccessToken = response.data.access_token;
              setToken(newAccessToken);
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;

              // Process queued requests
              refreshQueue.forEach((cb) => cb(newAccessToken));
              refreshQueue = [];

              return api(error.config);
            } catch {
              setToken(null);
              navigate("/");
            } finally {
              isRefreshing = false;
            }
          } else {
            return new Promise((resolve) => {
              refreshQueue.push((newAccessToken) => {
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                resolve(api(error.config));
              });
            });
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [navigate, setToken]);

  return children;
};
