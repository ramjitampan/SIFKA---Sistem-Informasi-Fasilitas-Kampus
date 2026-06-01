import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Layers, FileText, TrendingUp, AlertCircle, CheckCircle2, Clock, Map as MapIcon, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { buildingsAPI, facilitiesAPI, categoriesAPI, reportsAPI } from '../../api/services';
import { StatCard, Card, Badge } from '../../components/ui';
import { Map, MapClusterLayer, MapMarker } from '../../components/map';
import toast from 'react-hot-toast';

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
  const [geoData, setGeoData] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(''); // Status filter for the map

  useEffect(() => {
    const load = async () => {
      try {
        const [b, f, c, r, g] = await Promise.all([
          buildingsAPI.list(), 
          facilitiesAPI.list(), 
          categoriesAPI.list(), 
          reportsAPI.list(),
          reportsAPI.list({ format: 'geojson' }),
        ]);
        setStats({
          buildings: b.data.meta?.total || 0,
          facilities: f.data.meta?.total || 0,
          categories: c.data.meta?.total || 0,
          reports: r.data.meta?.total || 0,
        });
        setRecentReports(r.data.data?.slice(0, 6) || []);
        setGeoData(g.data);

        // Status breakdown
        const counts = r.data.status_counts || {};
        setStatusData(Object.entries(counts).map(([status, value]) => ({
          name: STATUS_LABEL[status] || status, value, status,
        })));
      } catch (err) {
        console.error('Dashboard load error:', err);
        toast.error('Gagal memuat data dashboard');
      }
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

  const filteredFeatures = geoData?.features?.filter(f => !statusFilter || f.properties.status === statusFilter);

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

      {/* Map Overview Section */}
      <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
        <Card style={{ padding: 0, overflow: 'hidden', height: 500 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapIcon size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Monitor Kondisi Fasilitas Kampus</span>
            </div>
            
            {/* Map Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button 
                onClick={() => setStatusFilter('')}
                style={{ 
                  padding: '4px 10px', fontSize: 11, fontWeight: 600, borderRadius: 6, cursor: 'pointer',
                  background: statusFilter === '' ? 'var(--bg-active)' : 'var(--bg-elevated)',
                  border: `1px solid ${statusFilter === '' ? 'var(--border-strong)' : 'var(--border)'}`,
                  color: statusFilter === '' ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
              >Semua</button>
              {Object.entries(STATUS_LABEL).map(([key, label]) => (
                <button 
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  style={{ 
                    padding: '4px 10px', fontSize: 11, fontWeight: 600, borderRadius: 6, cursor: 'pointer',
                    background: statusFilter === key ? `var(--${STATUS_COLOR[key]}-dim)` : 'var(--bg-elevated)',
                    border: `1px solid ${statusFilter === key ? `var(--${STATUS_COLOR[key]})` : 'var(--border)'}`,
                    color: statusFilter === key ? `var(--${STATUS_COLOR[key]})` : 'var(--text-muted)'
                  }}
                >{label}</button>
              ))}
            </div>
          </div>
          <div style={{ height: 440 }}>
            <Map>
              <MapClusterLayer>
                {filteredFeatures?.map(feature => (
                  <MapMarker 
                    key={feature.properties.id} 
                    type="report"
                    status={feature.properties.status}
                    position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                  >
                    <div style={{ width: 220 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }} className="truncate">{feature.properties.title}</div>
                        <Badge color={STATUS_COLOR[feature.properties.status] || 'gray'}>
                          {STATUS_LABEL[feature.properties.status] || feature.properties.status}
                        </Badge>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.4 }}>
                        {feature.properties.description?.slice(0, 80)}...
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Fasilitas: {feature.properties.facility_name || 'Umum'}
                      </div>
                    </div>
                  </MapMarker>
                ))}
              </MapClusterLayer>
            </Map>
          </div>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Status Pie */}
        <motion.div variants={itemVariants}>
          <Card style={{ height: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Status Laporan</span>
            </div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8 }}
                    itemStyle={{ color: 'var(--text-primary)', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 10 }}>
              {statusData.map((s, i) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 2' }}>
          <Card style={{ height: 280, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Aktivitas Terbaru</span>
              </div>
              <Badge color="accent">6 Laporan Terakhir</Badge>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }} className="custom-scrollbar">
              {recentReports.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20, fontSize: 14 }}>Belum ada laporan masuk</div>
              ) : recentReports.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `var(--${STATUS_COLOR[r.status] || 'gray'}-dim)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `var(--${STATUS_COLOR[r.status] || 'gray'})`, flexShrink: 0 }}>
                    {r.status === 'resolved' ? <CheckCircle2 size={16} /> : r.status === 'rejected' ? <XCircle size={16} /> : <AlertCircle size={16} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }} className="truncate" title={r.title}>{r.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Oleh {r.user?.name} • {new Date(r.created_at).toLocaleDateString('id-ID')}</div>
                  </div>
                  <Badge color={STATUS_COLOR[r.status] || 'gray'}>{STATUS_LABEL[r.status] || r.status}</Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
