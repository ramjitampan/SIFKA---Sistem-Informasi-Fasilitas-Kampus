import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../../api/services';
import useAuthStore from '../../store/authStore';
import { Button, Input } from '../../components/ui';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await authAPI.login(form);
      setAuth(res.data.user, res.data.access_token);
      toast.success(`Selamat datang, ${res.data.user.name}!`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || 'Login gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -200, right: -200, width: 600, height: 600,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,124,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -200, left: -200, width: 500, height: 500,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            style={{
              width: 60, height: 60, borderRadius: 18, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px var(--accent-glow)',
            }}
          >
            <GraduationCap size={28} color="#fff" />
          </motion.div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>SIFKA</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sistem Informasi Fasilitas Kampus</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: 32, boxShadow: 'var(--shadow-lg)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Masuk ke Akun</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Email"
              type="email"
              placeholder="nama@kampus.ac.id"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              icon={<Mail size={14} />}
              error={errors.email?.[0]}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}><Lock size={14} /></span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 40px 10px 38px',
                    background: 'var(--bg-elevated)', border: `1px solid ${errors.password ? 'var(--red)' : 'var(--border-strong)'}`,
                    borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = errors.password ? 'var(--red)' : 'var(--border-strong)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
                }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <span style={{ fontSize: 12, color: 'var(--red)' }}>{errors.password[0]}</span>}
            </div>

            <Button type="submit" loading={loading} size="lg" style={{ marginTop: 8 }}>
              Masuk
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            Belum punya akun?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Daftar sekarang</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
