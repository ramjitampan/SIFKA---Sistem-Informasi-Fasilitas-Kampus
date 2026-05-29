import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap } from 'lucide-react';
import { authAPI } from '../../api/services';
import useAuthStore from '../../store/authStore';
import { Button, Input } from '../../components/ui';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await authAPI.register(form);
      setAuth(res.data.user, res.data.access_token);
      toast.success('Registrasi berhasil!');
      navigate(res.data.user?.role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,124,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
            background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px var(--accent-glow)',
          }}>
            <GraduationCap size={24} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>SIFKA</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Buat akun baru</p>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 32, boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Daftar Akun</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Nama Lengkap" type="text" placeholder="John Doe" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              icon={<User size={14} />} error={errors.name?.[0]} />
            <Input label="Email" type="email" placeholder="nama@kampus.ac.id" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              icon={<Mail size={14} />} error={errors.email?.[0]} />
            <Input label="Password" type="password" placeholder="Min. 8 karakter" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              icon={<Lock size={14} />} error={errors.password?.[0]} />
            <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password" value={form.password_confirmation}
              onChange={e => setForm(f => ({ ...f, password_confirmation: e.target.value }))}
              icon={<Lock size={14} />} error={errors.password_confirmation?.[0]} />
            <Button type="submit" loading={loading} size="lg" style={{ marginTop: 8 }}>Daftar</Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            Sudah punya akun?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Masuk</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
