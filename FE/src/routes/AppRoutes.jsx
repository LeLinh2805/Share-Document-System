import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Pages
import HomePage from '../pages/home/HomePage';
import DocumentListPage from '../pages/documents/DocumentListPage';
import DocumentDetailPage from '../pages/documents/DocumentDetailPage';
import UploadDocumentPage from '../pages/documents/UploadDocumentPage';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

import UserProfilePage from '../pages/user/UserProfilePage';
import MyDocumentsPage from '../pages/user/MyDocumentsPage';
import DownloadHistoryPage from '../pages/user/DownloadHistoryPage';
import ProPlansPage from '../pages/user/ProPlansPage';
import MyOrdersPage from '../pages/user/MyOrdersPage';

import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminModerationPage from '../pages/admin/AdminModerationPage';
import AdminUserListPage from '../pages/admin/AdminUserListPage';

import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Cụm Route chính giao diện người dùng */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="documents" element={<DocumentListPage />} />
        <Route path="documents/:id" element={<DocumentDetailPage />} />
        <Route path="pro" element={<ProPlansPage />} />

        {/* Auth routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        {/* Protected User Routes (yêu cầu đăng nhập) */}
        <Route
          path="upload"
          element={
            <ProtectedRoute>
              <UploadDocumentPage />
            </ProtectedRoute>
          }
        />

        {/* User Dashboard với UserLayout */}
        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="my-documents" element={<MyDocumentsPage />} />
          <Route path="downloads" element={<DownloadHistoryPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Cụm Route dành riêng cho Quản trị viên (Admin) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="moderation" element={<AdminModerationPage />} />
        <Route path="users" element={<AdminUserListPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

