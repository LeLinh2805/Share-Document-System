import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Đang kiểm tra quyền truy cập..." />;
  }

  if (!isLoggedIn) {
    // Lưu lại vị trí trang hiện tại để chuyển hướng lại sau khi đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

