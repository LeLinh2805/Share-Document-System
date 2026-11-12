import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Đang xác thực quyền Admin..." />;
  }

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

