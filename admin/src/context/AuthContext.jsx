import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sb_user"));
    } catch {
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("sb_token") || null,
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken)
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    else delete api.defaults.headers.common["Authorization"];
    localStorage.setItem("sb_token", accessToken || "");
    localStorage.setItem("sb_user", user ? JSON.stringify(user) : "");
  }, [accessToken, user]);

  const login = async (email, password) => {
    setLoading(true);
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.admin);
    setLoading(false);
    navigate("/");
  };

  const register = async (payload) => {
    setLoading(true);
    const res = await api.post("/auth/register", payload);
    setAccessToken(res.data.accessToken);
    setUser(res.data.admin);
    setLoading(false);
    navigate("/");
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        register,
        logout,
        loading,
        setAccessToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
