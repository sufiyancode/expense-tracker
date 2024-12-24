import React from "react";

import { createContext, useState } from "react";

export const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser); // Parse only if value exists
    }
    return null;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null; // Return null if parsing fails
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());

  const login = (userData) => {
    const { token, ...user } = userData; // Destructure token and user fields
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = () => Boolean(user && localStorage.getItem("token"));

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
