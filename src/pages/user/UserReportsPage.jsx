import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Trash2, Clock, CheckCircle2, XCircle, RefreshCw, Search, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../../api/services';
import { Card, Badge, Button, Modal, Table, Pagination } from '../../components/ui';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:     { label: 'Menunggu',  color: 'yellow', icon: <Clock size={12} /> },
  in_progress: { label: 'Diproses', color: 'accent', icon: <RefreshCw size={12} /> },
  resolved:    { label: 'Selesai',   color: 'green',  icon: <CheckCircle2 size={12} /> },
  rejected:    { label: 'Ditolak',   color: 'red',    icon: <XCircle size={12} /> },
};

function DetailModal({ report, onClose }) {
  if (!report) return null;
  const sc = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;
  return (
    <Modal open={!!report} onClose={onClose} title="Detail Laporan" size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {report.image_url ? (
            <img src={report.image_url} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 120, height: 90, borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
              <FileText size={28} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>#{report.id}</span>
              <Badge color={sc.color}>{sc.label}</Badge>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{report.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{report.description}</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', padding: '11px 13px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fasilitas</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{report.facility?.name || 'Tidak terkait fasilitas'}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', padding: '11px 13px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tanggal</div>
            <div style={{ fontSize: 13 }}>{report.created_at ? new Date(report.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</div>
          </div>
          {report.coordinates?.latitude && (
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', padding: '11px 13px', gridColumn: 'span 2' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Koordinat</div>
              <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                {report.coordinates.latitude.toFixed(6)}, {report.coordinates.longitude.toFixed(6)}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default function UserReportsPage() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detail, setDetail] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await reportsAPI.list(p);
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch { toast.error('Gagal memuat laporan'); }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const handleDelete = async () => {
    setSaving(true);
    try {
      await reportsAPI.delete(deleteModal.id);
      toast.success('Laporan dihapus');
      setDeleteModal(null);
      load(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus');
      setDeleteModal(null);
    }
    setSaving(false);
  };

  const filtered = data.filter(r => {
    const ms = r.title.toLowerCase().includes(search.toLowerCase());
    const mc = !statusFilter || r.status === statusFilter;
    return ms && mc;
  });

  const columns = [
    { key: 'title', label: 'Laporan', render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {row.image_url ? (
          <img src={row.image_url} alt="" style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' }} />
        ) : (
          <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-muted)' }}>
            <FileText size={15} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 14 }} className="truncate">{v}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }} className="truncate">{row.description?.slice(0, 55)}…</div>
        </div>
      </div>
    )},
    { key: 'facility', label: 'Fasilitas', render: v => v ? <Badge color="cyan">{v.name}</Badge> : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span> },
    { key: 'status', label: 'Status', render: v => {
      const sc = STATUS_CONFIG[v] || STATUS_CONFIG.pending;
      return <Badge color={sc.color}>{sc.label}</Badge>;
    }},
    { key: 'created_at', label: 'Tanggal', render: v => v ? (
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
    ) : '—' },
    { key: '_actions', label: '', render: (_, row) => (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm" icon={<Eye size={13} />} onClick={() => setDetail(row)}>Lihat</Button>
        <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => setDeleteModal(row)}>Hapus</Button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={24} style={{ color: 'var(--yellow)' }} /> Laporan Saya
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pantau status laporan yang sudah kamu kirimkan</p>
        </div>
        <Link to="/user/reports/new" style={{ textDecoration: 'none' }}>
          <Button variant="primary" icon={<PlusCircle size={15} />}>Buat Laporan Baru</Button>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setStatusFilter('')} style={{ padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, background: !statusFilter ? 'var(--accent)' : 'var(--bg-surface)', color: !statusFilter ? '#fff' : 'var(--text-secondary)', border: `1px solid ${!statusFilter ? 'transparent' : 'var(--border)'}`, transition: 'all 0.15s' }}>
          Semua
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setStatusFilter(statusFilter === key ? '' : key)} style={{ padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, background: statusFilter === key ? 'var(--bg-active)' : 'var(--bg-surface)', color: statusFilter === key ? 'var(--text-primary)' : 'var(--text-secondary)', border: `1px solid ${statusFilter === key ? 'var(--border-strong)' : 'var(--border)'}`, transition: 'all 0.15s' }}>
            {cfg.label}
          </button>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180, maxWidth: 320 }}>
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul laporan..."
              style={{ width: '100%', padding: '7px 11px 7px 30px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>{filtered.length} laporan</span>
        </div>

        <Table columns={columns} data={filtered} loading={loading} emptyText="Belum ada laporan. Yuk buat laporan pertama!" />
        <div style={{ padding: '0 20px 14px' }}>
          <Pagination meta={meta} onPage={p => { setPage(p); load(p); }} />
        </div>
      </Card>

      <DetailModal report={detail} onClose={() => setDetail(null)} />

      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Hapus Laporan">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--red)' }}>
            <Trash2 size={22} />
          </div>
          <p style={{ fontSize: 15, marginBottom: 6 }}>Hapus laporan ini?</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{deleteModal?.title}</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 22 }}>Tindakan ini tidak dapat dibatalkan.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => setDeleteModal(null)}>Batal</Button>
            <Button variant="danger" loading={saving} onClick={handleDelete}>Hapus</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
