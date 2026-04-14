import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('devconnect_user');
    return saved ? JSON.parse(saved) : null;
  });

  // ─── Registro ───────────────────────────────────────────────
  const register = async ({ name, email, password }) => {
    try {
      const data = await authAPI.register({ name, email, password });
      localStorage.setItem('devconnect_token', data.token);
      localStorage.setItem('devconnect_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ─── Login ──────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('devconnect_token', data.token);
      localStorage.setItem('devconnect_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ─── Logout ─────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem('devconnect_token');
    localStorage.removeItem('devconnect_user');
  };

  // ─── Atualizar perfil ────────────────────────────────────────
  const updateProfile = async (data) => {
    try {
      const updated = await profileAPI.update(data);
      const newUser = { ...user, ...updated };
      setUser(newUser);
      localStorage.setItem('devconnect_user', JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
