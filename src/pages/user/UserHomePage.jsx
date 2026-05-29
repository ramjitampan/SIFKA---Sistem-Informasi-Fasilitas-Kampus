import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, MapPin, FileText, PlusCircle, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { buildingsAPI, facilitiesAPI, reportsAPI } from '../../api/services';
import { Card, Badge } from '../../components/ui';
import useAuthStore from '../../store/authStore';

const STATUS_CONFIG = {
  pending:     { label: 'Menunggu',  color: 'yellow', icon: <Clock size={12} /> },
  in_progress: { label: 'Diproses', color: 'accent', icon: <RefreshCw size={12} /> },
  resolved:    { label: 'Selesai',   color: 'green',  icon: <CheckCircle2 size={12} /> },
  rejected:    { label: 'Ditolak',   color: 'red',    icon: <XCircle size={12} /> },
};

const iv = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

export default function UserHomePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ buildings: 0, facilities: 0, reports: 0 });
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [b, f, r] = await Promise.all([
          buildingsAPI.list(), facilitiesAPI.list(), reportsAPI.list(),
        ]);
        setStats({
          buildings: b.data.meta.total,
          facilities: f.data.meta.total,
          reports: r.data.meta.total,
        });
        setMyReports(r.data.data.slice(0, 5));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const quickLinks = [
    { to: '/user/facilities', icon: <MapPin size={20} />, label: 'Lihat Fasilitas', color: 'accent', desc: 'Temukan fasilitas kampus' },
    { to: '/user/buildings', icon: <Building2 size={20} />, label: 'Daftar Gedung', color: 'purple', desc: 'Info gedung & lokasi' },
    { to: '/user/reports/new', icon: <PlusCircle size={20} />, label: 'Buat Laporan', color: 'green', desc: 'Laporkan masalah fasilitas' },
    { to: '/user/reports', icon: <FileText size={20} />, label: 'Laporan Saya', color: 'yellow', desc: 'Pantau status laporan' },
  ];

  const colorMap = {
    accent: { bg: 'var(--accent-dim)', color: 'var(--accent)' },
    purple: { bg: 'var(--purple-dim)', color: 'var(--purple)' },
    green: { bg: 'var(--green-dim)', color: 'var(--green)' },
    yellow: { bg: 'var(--yellow-dim)', color: 'var(--yellow)' },
  };

  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      initial="hidden" animate="show"
      style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}
    >
      {/* Hero greeting */}
      <motion.div variants={iv} style={{
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
        padding: '28px 32px', marginBottom: 28, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -60, top: -60, width: 240, height: 240,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,124,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Selamat datang kembali</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          {user?.name} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 480 }}>
          Temukan informasi fasilitas kampus dan laporkan masalah yang kamu temukan. Bersama kita jaga kualitas fasilitas kampus.
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Gedung', value: stats.buildings, icon: <Building2 size={18} />, color: 'accent' },
          { label: 'Total Fasilitas', value: stats.facilities, icon: <MapPin size={18} />, color: 'purple' },
          { label: 'Laporan Terkirim', value: stats.reports, icon: <FileText size={18} />, color: 'yellow' },
        ].map(s => (
          <motion.div key={s.label} variants={iv}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{loading ? '—' : s.value}</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: colorMap[s.color].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMap[s.color].color }}>
                  {s.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div variants={iv} style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 600 }}>Aksi Cepat</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {quickLinks.map(q => (
            <Link key={q.to} to={q.to} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '18px 20px',
                  display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: colorMap[q.color].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMap[q.color].color, flexShrink: 0 }}>
                  {q.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{q.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.desc}</div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent reports */}
      <motion.div variants={iv}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Laporan Terbaru</span>
            <Link to="/user/reports" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Lihat semua →</Link>
          </div>
          {myReports.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={32} style={{ margin: '0 auto 10px', opacity: 0.3, display: 'block' }} />
              Belum ada laporan. <Link to="/user/reports/new" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Buat laporan pertama →</Link>
            </div>
          ) : (
            <div>
              {myReports.map((r, i) => {
                const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
                return (
                  <div key={r.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 0', borderBottom: i < myReports.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    {r.image_url ? (
                      <img src={r.image_url} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 10, flexShrink: 0, border: '1px solid var(--border)' }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                        <FileText size={18} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }} className="truncate">{r.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{r.facility?.name || 'Tanpa fasilitas'}</div>
                    </div>
                    <Badge color={sc.color}>{sc.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
