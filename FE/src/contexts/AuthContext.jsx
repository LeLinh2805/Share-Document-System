import React, { createContext, useContext, useState, useEffect } from 'react';
import userApi from '../api/userApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Tính toán quyền Pro và quyền Admin dựa trên state
  const isPro = !!(user?.ngayHetHanPro && new Date(user.ngayHetHanPro) > new Date());
  const isAdmin = user?.vaiTro === 'ADMIN';

  // Khi có token, tự động fetch profile mới nhất từ server
  const refreshProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await userApi.getProfile();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    } catch (error) {
      console.warn('Lỗi đồng bộ hồ sơ người dùng:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isLoggedIn: !!token,
        isAdmin,
        isPro,
        login,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

