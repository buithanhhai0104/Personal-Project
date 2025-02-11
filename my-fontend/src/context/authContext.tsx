"use client";
// context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

// Định nghĩa kiểu người dùng
interface User {
  id: number;
  username: string;
  role: string;
}

// Định nghĩa kiểu của context
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Tạo context với giá trị mặc định
const UserContext = createContext<UserContextType | undefined>(undefined);

// Tạo provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
