import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, FileText, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { reportsAPI } from '../../api/services';
import { Card, Badge } from '../../components/ui';

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

export default function StaffHomePage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await reportsAPI.list();
        const counts = res.data.status_counts;
        setStats({
          total: res.data.meta.total,
          pending: counts.pending,
          resolved: counts.resolved,
        });
        setRecentReports(res.data.data.slice(0, 5));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const colorMap = {
    total: { bg: 'var(--accent-dim)', color: 'var(--accent)' },
    pending: { bg: 'var(--yellow-dim)', color: 'var(--yellow)' },
    resolved: { bg: 'var(--green-dim)', color: 'var(--green)' },
  };

  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      initial="hidden" animate="show"
      style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}
    >
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Dashboard Staff 🛠
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pantau dan tindaklanjuti laporan fasilitas kampus.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Laporan', value: stats.total, icon: <FileText size={18} />, color: 'total' },
          { label: 'Menunggu', value: stats.pending, icon: <Clock size={18} />, color: 'pending' },
          { label: 'Terselesaikan', value: stats.resolved, icon: <CheckCircle2 size={18} />, color: 'resolved' },
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

      <motion.div variants={iv}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Laporan Masuk Terbaru</span>
          </div>
          {recentReports.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada laporan baru.</div>
          ) : (
            <div>
              {recentReports.map((r, i) => {
                const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
                return (
                  <div key={r.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 0', borderBottom: i < recentReports.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }} className="truncate" title={r.title}>{r.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }} className="truncate" title={`Pelapor: ${r.user?.name} | ${r.facility?.name || 'Tanpa fasilitas'}`}>Pelapor: {r.user?.name} | {r.facility?.name || 'Tanpa fasilitas'}</div>
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
