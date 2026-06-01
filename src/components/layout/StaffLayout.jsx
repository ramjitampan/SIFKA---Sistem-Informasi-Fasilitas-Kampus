import React from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { FileText, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui';

export default function StaffLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const navItems = [
    { path: '/staff', label: 'Beranda', icon: <LayoutDashboard size={18} /> },
    { path: '/staff/reports', label: 'Laporan', icon: <FileText size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 10px 20px', marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>SIFKA Staff</h2>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{user?.email}</div>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navItems.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 'var(--radius)',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                background: location.pathname === item.path ? 'var(--bg-active)' : 'transparent',
                color: location.pathname === item.path ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <Button variant="ghost" onClick={handleLogout} style={{ justifyContent: 'flex-start', color: 'var(--red)' }} icon={<LogOut size={16} />}>
          Keluar
        </Button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
