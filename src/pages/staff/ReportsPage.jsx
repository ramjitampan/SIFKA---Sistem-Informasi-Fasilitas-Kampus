import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, Eye, CheckCircle2, XCircle, Clock,
  MapPin, User, Calendar, RefreshCw
} from 'lucide-react';
import { reportsAPI } from '../../api/services';
import { Button, Table, Pagination, Modal, Card, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: 'yellow', icon: <Clock size={12} /> },
  in_progress: { label: 'Diproses', color: 'accent', icon: <RefreshCw size={12} /> },
  resolved: { label: 'Selesai', color: 'green', icon: <CheckCircle2 size={12} /> },
  rejected: { label: 'Ditolak', color: 'red', icon: <XCircle size={12} /> },
};

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'pending', label: '⏳ Menunggu' },
  { value: 'in_progress', label: '🔄 Diproses' },
  { value: 'resolved', label: '✅ Selesai' },
  { value: 'rejected', label: '❌ Ditolak' },
];

function ReportDetailModal({ report, onClose, onStatusChange }) {
  const [status, setStatus] = useState(report?.status || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (report) setStatus(report.status); }, [report]);

  const handleUpdate = async (newStatus) => {
    setSaving(true);
    try {
      await reportsAPI.updateStatus(report.id, newStatus);
      toast.success(`Status diperbarui: ${STATUS_CONFIG[newStatus]?.label}`);
      onStatusChange(report.id, newStatus);
      onClose();
    } catch { toast.error('Gagal memperbarui status'); }
    setSaving(false);
  };

  if (!report) return null;
  const s = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;

  return (
    <Modal open={!!report} onClose={onClose} title="Detail Laporan" size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {report.image_url ? (
            <img src={report.image_url} alt="laporan" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 120, height: 90, borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
              <FileText size={28} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{report.id}</span>
              <Badge color={s.color}>{s.label}</Badge>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{report.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{report.description}</p>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={11} /> Pelapor
            </div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{report.user?.name || '—'}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={11} /> Fasilitas
            </div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{report.facility?.name || 'Tidak terkait fasilitas'}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Koordinat</div>
            <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
              {report.coordinate?.lat?.toFixed(6)}, {report.coordinate?.lng?.toFixed(6)}
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={11} /> Tanggal
            </div>
            <div style={{ fontSize: 13 }}>{report.created_at ? new Date(report.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ubah Status</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => handleUpdate(key)} disabled={saving || report.status === key}
                style={{
                  padding: '8px 16px', borderRadius: 'var(--radius)', border: 'none', cursor: report.status === key ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6,
                  opacity: report.status === key ? 0.5 : 1, transition: 'all 0.15s',
                  background: report.status === key ? 'var(--bg-active)' : 'var(--bg-elevated)',
                  color: report.status === key ? 'var(--text-muted)' : 'var(--text-primary)',
                  border: `1px solid ${report.status === key ? 'var(--border-strong)' : 'var(--border)'}`,
                }}
              >{cfg.icon} {cfg.label}{report.status === key && ' ✓'}</button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function StaffReportsPage() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailReport, setDetailReport] = useState(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await reportsAPI.list({ page: p });
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch { toast.error('Gagal memuat laporan'); }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const handleStatusChange = (id, newStatus) => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const filtered = data.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{v}</span> },
    { key: 'title', label: 'Laporan', render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {row.image_url ? (
          <img src={row.image_url} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' }} />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-muted)' }}>
            <FileText size={16} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 14 }} className="truncate">{v}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }} className="truncate">{row.description?.slice(0, 60)}…</div>
        </div>
      </div>
    )},
    { key: 'user', label: 'Pelapor', render: v => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
          {v?.name?.[0]?.toUpperCase()}
        </div>
        <span style={{ fontSize: 13 }}>{v?.name}</span>
      </div>
    )},
    { key: 'facility', label: 'Fasilitas', render: v => v ? <Badge color="cyan">{v.name}</Badge> : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span> },
    { key: 'status', label: 'Status', render: v => {
      const s = STATUS_CONFIG[v] || STATUS_CONFIG.pending;
      return <Badge color={s.color}>{s.label}</Badge>;
    }},
    { key: 'created_at', label: 'Tanggal', render: v => v ? (
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
    ) : '—' },
    { key: '_actions', label: '', render: (_, row) => (
        <Button variant="ghost" size="sm" icon={<Eye size={13} />} onClick={() => setDetailReport(row)}>Detail</Button>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 28, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={24} style={{ color: 'var(--yellow)' }} /> Manajemen Laporan (Staff)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Tindaklanjuti laporan pengguna</p>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul atau pelapor..."
              style={{ width: '100%', padding: '8px 12px 8px 34px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 32px 8px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', cursor: 'pointer',
              appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b91a8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
            }}
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>{filtered.length} laporan ditampilkan</span>
        </div>

        <Table columns={columns} data={filtered} loading={loading} emptyText="Tidak ada laporan yang sesuai filter" />
        <div style={{ padding: '0 20px 16px' }}>
          <Pagination meta={meta} onPage={p => { setPage(p); load(p); }} />
        </div>
      </Card>

      <ReportDetailModal
        report={detailReport}
        onClose={() => setDetailReport(null)}
        onStatusChange={handleStatusChange}
      />
    </motion.div>
  );
}
