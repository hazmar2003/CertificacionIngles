// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { User } from '../types/User';
import { Student } from '../types/Student';
import { Teacher } from '../types/Teacher';
import { Admin } from '../types/Admin';

export interface AuthStateType {
  student?: Student | null;
  teacher?: Teacher | null;
  admin?: Admin | null;
  isAuthenticated: boolean;
  role?: 'student' | 'teacher' | 'admin' | null;
}

interface AuthContextType {
  authState: AuthStateType | null,
  login: (userData: AuthStateType) => void;
  logout: () => void;
}

// Crear el contexto del tipo adecuado
const AuthStateContext = createContext<AuthContextType>({
    authState: { isAuthenticated: false},
    login: () => {},
    logout: ()  => {},
});

interface AuthStateProviderProps {
    children: React.ReactNode 
}

export const AuthStateProvider: React.FC<AuthStateProviderProps> = ({ children }) => {

  const [authState, setAuthState] = useState<AuthStateType>({
    student: null,
    teacher: null,
    admin: null,
    isAuthenticated: false,
    role: null,
  });

  const login = (userData: AuthStateType
   ) => {
    
    setAuthState(userData);
  };

  const logout = () => {
    setAuthState({
      student: null,
      teacher: null,
      admin: null,
      isAuthenticated: false,
      role: null,
    });
  };

  return (
    <AuthStateContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};