import React, { createContext, useContext, useState } from "react";
import { users } from "../data/mockData";

const AuthContext = createContext(undefined);

const defaultUser = {
  ...users[0],
  password: undefined,
};

export const AuthProvider = ({ children }) => {
  const [user] = useState(defaultUser);

  const login = async () => true;

  const logout = () => {};

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
