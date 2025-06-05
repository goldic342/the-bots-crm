import {
  createContext,
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
} from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  TokenType,
  UnauthorizedMessage,
  UnauthorizedStatusCode,
} from "../constants";
import { getMe, getAccessToken } from "../api/auth";

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
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, attempt to fetch a token using refresh token (httpOnly cookie)
  useEffect(() => {
    if (token) return;

    const getToken = async () => {
      setUserLoading(true);
      try {
        const newToken = await getAccessToken();
        setToken(newToken);
      } catch {
        // Can't get new access token. API is dead or user's refresh token is no longer valid
        // Clear states; redirect to login
        setToken(null);
        setUser(null);
        setUserLoading(false);
        navigate("/");
      }
    };

    getToken();
  }, [token, navigate]);

  // When a token is available, fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      setUserLoading(true);
      try {
        const userData = await getMe();
        setUser(userData);
      } catch {
        setToken(null);
        setUser(null);
        navigate("/");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  // Attach the token to every outgoing API request
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use(config => {
      if (token && !config._retry) {
        config.headers.Authorization = `${TokenType} ${token}`;
      }
      return config;
    });
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // Interceptor to handle token refresh on 403/401 errors
  useLayoutEffect(() => {
    let isRefreshing = false;
    let refreshQueue = [];

    const refreshInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        if (
          error.response?.status === UnauthorizedStatusCode &&
          error.response?.data?.detail === UnauthorizedMessage
        ) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newAccessToken = await getAccessToken();
              setToken(newAccessToken);
              error.config.headers.Authorization = `${TokenType} ${newAccessToken}`;

              // Process queued requests with the new token
              refreshQueue.forEach(cb => cb(newAccessToken));
              refreshQueue = [];

              return api(error.config);
            } catch (err) {
              setToken(null);
              setUser(null);
              navigate("/");
            } finally {
              isRefreshing = false;
            }
          } else {
            // Queue any API calls while token is refreshing
            return new Promise(resolve => {
              refreshQueue.push(newAccessToken => {
                error.config.headers.Authorization = `${TokenType} ${newAccessToken}`;
                resolve(api(error.config));
              });
            });
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, userLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
