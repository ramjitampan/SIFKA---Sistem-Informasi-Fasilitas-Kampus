import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import BuildingsPage from './pages/admin/BuildingsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import FacilitiesPage from './pages/admin/FacilitiesPage';
import ReportsPage from './pages/admin/ReportsPage';

// User pages
import UserHomePage from './pages/user/UserHomePage';
import UserFacilitiesPage from './pages/user/UserFacilitiesPage';
import UserBuildingsPage from './pages/user/UserBuildingsPage';
import UserReportsPage from './pages/user/UserReportsPage';
import UserCreateReportPage from './pages/user/UserCreateReportPage';

function RequireAuth({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/user" replace />;
  return children;
}

function RequireUser({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/user'} replace />;
  }
  return children;
}

function UnauthorizedPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'var(--bg-base)' }}>
      <div style={{ fontSize: 64 }}>🚫</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>Akses Ditolak</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 14 }}>← Kembali ke Login</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-strong)',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            boxShadow: 'var(--shadow)',
          },
          success: { iconTheme: { primary: 'var(--green)', secondary: 'var(--bg-elevated)' } },
          error: { iconTheme: { primary: 'var(--red)', secondary: 'var(--bg-elevated)' } },
        }}
      />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<RequireAuth adminOnly><AdminLayout /></RequireAuth>}>
          <Route index element={<DashboardPage />} />
          <Route path="buildings" element={<BuildingsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* User routes */}
        <Route path="/user" element={<RequireUser><UserLayout /></RequireUser>}>
          <Route index element={<UserHomePage />} />
          <Route path="facilities" element={<UserFacilitiesPage />} />
          <Route path="buildings" element={<UserBuildingsPage />} />
          <Route path="reports" element={<UserReportsPage />} />
          <Route path="reports/new" element={<UserCreateReportPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
