import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
} from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  const token = localStorage.getItem("token");
  return token ? { token } : null;
});

useEffect(() => {
  const restoreSession = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await getProfile();
      setUser(res.data.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  restoreSession();
}, []);

  const login = async (data) => {
    const res = await loginUser(data);

    localStorage.setItem("token", res.data.data.token);

    setUser(res.data.data.user);

    return res.data;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    return res.data;
  };

  const logout = async () => {
  
    try {
        await logoutUser();
        } catch (e) {
        // Ignore backend logout errors for now
        }

  localStorage.removeItem("token");
  setUser(null);
};
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);