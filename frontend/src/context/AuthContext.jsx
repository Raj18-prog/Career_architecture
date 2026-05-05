import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("careerArchitectToken"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("careerArchitectUser");
    return stored ? JSON.parse(stored) : null;
  });

  const persistSession = (payload) => {
    localStorage.setItem("careerArchitectToken", payload.token);
    localStorage.setItem("careerArchitectUser", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persistSession(data);
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem("careerArchitectToken");
    localStorage.removeItem("careerArchitectUser");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token), user, login, register, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
