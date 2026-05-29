import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, MapPin, Building2, FileText, PlusCircle,
  LogOut, GraduationCap, Menu, X, User, ChevronDown
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { authAPI } from '../../api/services';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/user', label: 'Beranda', icon: Home, end: true },
  { to: '/user/facilities', label: 'Fasilitas', icon: MapPin },
  { to: '/user/buildings', label: 'Gedung', icon: Building2 },
  { to: '/user/reports', label: 'Laporan Saya', icon: FileText },
  { to: '/user/reports/new', label: 'Buat Laporan', icon: PlusCircle },
];

export default function UserLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch {}
    clearAuth();
    navigate('/login');
    toast.success('Berhasil keluar');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header style={{
        height: 60, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
        position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px var(--accent-glow)',
          }}>
            <GraduationCap size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>SIFKA</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.07em' }}>Fasilitas Kampus</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }} className="desktop-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 13px', borderRadius: 'var(--radius)',
                textDecoration: 'none', fontWeight: 500, fontSize: 13,
                transition: 'all 0.15s',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              })}
            >
              {({ isActive }) => <>
                <item.icon size={15} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                {item.label}
              </>}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* User dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                borderRadius: 'var(--radius)', background: 'none', border: '1px solid var(--border)',
                cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
              onMouseLeave={e => { if (!userMenuOpen) e.currentTarget.style.background = 'none'; }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>{user?.name?.[0]?.toUpperCase()}</div>
              <span style={{ fontSize: 13, fontWeight: 500 }} className="desktop-username">{user?.name}</span>
              <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
            </button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-lg)', padding: 8, minWidth: 200,
                    boxShadow: 'var(--shadow-lg)', zIndex: 200,
                  }}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div style={{ padding: '10px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
                    <div style={{ fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4, fontWeight: 600 }}>{user?.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 12px', borderRadius: 'var(--radius)', background: 'none',
                      border: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: 13,
                      fontFamily: 'var(--font-body)', transition: 'background 0.15s', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={14} /> Keluar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'none' }}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200 }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              style={{
                position: 'fixed', right: 0, top: 0, bottom: 0, width: 260,
                background: 'var(--bg-surface)', zIndex: 210, padding: 20,
                borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Menu</span>
                <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>
              {navItems.map(item => (
                <NavLink
                  key={item.to} to={item.to} end={item.end}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 14px', borderRadius: 'var(--radius)',
                    textDecoration: 'none', fontWeight: 500, fontSize: 14,
                    background: isActive ? 'var(--accent-dim)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  })}
                >
                  {({ isActive }) => <>
                    <item.icon size={17} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                    {item.label}
                  </>}
                </NavLink>
              ))}
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <button onClick={handleLogout} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderRadius: 'var(--radius)', background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--red)', fontSize: 14, fontFamily: 'var(--font-body)', textAlign: 'left',
                }}>
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-username { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
