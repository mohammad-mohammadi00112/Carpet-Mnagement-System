import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const getStoredAuth = () => {
  try {
    const stored =
      localStorage.getItem("carpetpro_auth") ||
      sessionStorage.getItem("carpetpro_auth");

    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("carpetpro_auth");
    sessionStorage.removeItem("carpetpro_auth");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = async (credentials, rememberMe = false) => {
    const response = await api.post("/login", credentials);
    const data = response.data;

    if (!data.token || !data.user) {
      throw new Error(data.message || "Login failed!");
    }

    const authData = {
      token: data.token,
      user: data.user,
    };

    localStorage.removeItem("carpetpro_auth");
    sessionStorage.removeItem("carpetpro_auth");

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("carpetpro_auth", JSON.stringify(authData));

    setAuth(authData);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("carpetpro_auth");
    sessionStorage.removeItem("carpetpro_auth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        token: auth?.token ?? null,
        isAuthenticated: Boolean(auth?.token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};