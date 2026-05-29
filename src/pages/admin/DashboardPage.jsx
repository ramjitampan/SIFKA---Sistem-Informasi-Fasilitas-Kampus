import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Layers, FileText, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { buildingsAPI, facilitiesAPI, categoriesAPI, reportsAPI } from '../../api/services';
import { StatCard, Card, Badge } from '../../components/ui';

const STATUS_COLOR = {
  pending: 'yellow',
  in_progress: 'accent',
  resolved: 'green',
  rejected: 'red',
};

const STATUS_LABEL = {
  pending: 'Menunggu',
  in_progress: 'Diproses',
  resolved: 'Selesai',
  rejected: 'Ditolak',
};

const PIE_COLORS = ['#4f7cff', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'];

export default function DashboardPage() {
  const [stats, setStats] = useState({ buildings: 0, facilities: 0, categories: 0, reports: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, f, c, r] = await Promise.all([
          buildingsAPI.list(), facilitiesAPI.list(), categoriesAPI.list(), reportsAPI.list(),
        ]);
        setStats({
          buildings: b.data.meta.total,
          facilities: f.data.meta.total,
          categories: c.data.meta.total,
          reports: r.data.meta.total,
        });
        setRecentReports(r.data.data.slice(0, 6));

        // Status breakdown
        const statusCount = {};
        r.data.data.forEach(rep => {
          statusCount[rep.status] = (statusCount[rep.status] || 0) + 1;
        });
        setStatusData(Object.entries(statusCount).map(([name, value]) => ({
          name: STATUS_LABEL[name] || name, value, status: name,
        })));
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  };

  return (
    <motion.div
      variants={containerVariants} initial="hidden" animate="show"
      style={{ padding: 28, maxWidth: 1400, margin: '0 auto' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Ringkasan kondisi fasilitas kampus secara keseluruhan</p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Gedung', value: stats.buildings, icon: <Building2 size={20} />, color: 'accent' },
          { label: 'Total Fasilitas', value: stats.facilities, icon: <MapPin size={20} />, color: 'green' },
          { label: 'Kategori', value: stats.categories, icon: <Layers size={20} />, color: 'purple' },
          { label: 'Laporan Masuk', value: stats.reports, icon: <FileText size={20} />, color: 'yellow' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={itemVariants}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Status Pie */}
        <motion.div variants={itemVariants}>
          <Card style={{ height: 280 }}>
            <div style={{ marginBottom: 16, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Status Laporan</div>
            {statusData.length > 0 ? (
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 220 }}>
                <ResponsiveContainer width="60%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {statusData.map((s, i) => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{s.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--text-muted)' }}>Belum ada laporan</div>
            )}
          </Card>
        </motion.div>

        {/* Overview Bar */}
        <motion.div variants={itemVariants}>
          <Card style={{ height: 280 }}>
            <div style={{ marginBottom: 16, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Ringkasan Data</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'Gedung', value: stats.buildings },
                { name: 'Fasilitas', value: stats.facilities },
                { name: 'Kategori', value: stats.categories },
                { name: 'Laporan', value: stats.reports },
              ]} barSize={32}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} cursor={{ fill: 'rgba(79,124,255,0.05)' }} />
                <Bar dataKey="value" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div variants={itemVariants}>
        <Card>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Laporan Terbaru</span>
            <a href="/admin/reports" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Lihat semua →</a>
          </div>
          {recentReports.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada laporan</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentReports.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 0', borderBottom: i < recentReports.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)',
                  }}>
                    <FileText size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }} className="truncate">{r.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      oleh {r.user?.name} · {r.facility?.name || 'Tanpa fasilitas'}
                    </div>
                  </div>
                  <Badge color={STATUS_COLOR[r.status] || 'gray'}>{STATUS_LABEL[r.status] || r.status}</Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
