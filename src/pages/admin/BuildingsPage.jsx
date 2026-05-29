import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Building2, MapPin, Search } from 'lucide-react';
import { buildingsAPI } from '../../api/services';
import { Button, Input, Textarea, Table, Pagination, Modal, Card, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', latitude: '', longitude: '' };

export default function BuildingsPage() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // 'create' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await buildingsAPI.list(p);
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch { toast.error('Gagal memuat data gedung'); }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal('create'); };
  const openEdit = (b) => { setSelected(b); setForm({ name: b.name, description: b.description || '', latitude: b.coordinate.lat, longitude: b.coordinate.lng }); setErrors({}); setModal('edit'); };
  const openDelete = (b) => { setSelected(b); setModal('delete'); };

  const handleSave = async () => {
    setSaving(true); setErrors({});
    try {
      if (modal === 'create') {
        await buildingsAPI.create(form);
        toast.success('Gedung berhasil ditambahkan');
      } else {
        await buildingsAPI.update(selected.id, form);
        toast.success('Gedung berhasil diperbarui');
      }
      setModal(null); load(page);
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await buildingsAPI.delete(selected.id);
      toast.success('Gedung berhasil dihapus');
      setModal(null); load(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus gedung');
      setModal(null);
    }
    setSaving(false);
  };

  const filtered = data.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'id', label: '#', render: (v) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{v}</span> },
    { key: 'name', label: 'Nama Gedung', render: (v, row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{v}</div>
        {row.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{row.description.slice(0, 60)}{row.description.length > 60 ? '…' : ''}</div>}
      </div>
    )},
    { key: 'coordinate', label: 'Koordinat', render: (v) => (
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
        {v?.lat?.toFixed(6)}, {v?.lng?.toFixed(6)}
      </div>
    )},
    { key: 'amenities', label: 'Fasilitas', render: (v) => (
      <Badge color="cyan">{v?.length || 0} fasilitas</Badge>
    )},
    { key: '_actions', label: '', render: (_, row) => (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm" icon={<Edit2 size={13} />} onClick={() => openEdit(row)}>Edit</Button>
        <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => openDelete(row)}>Hapus</Button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 28, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building2 size={24} style={{ color: 'var(--accent)' }} /> Manajemen Gedung
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Kelola data gedung di kampus</p>
        </div>
        <Button icon={<Plus size={15} />} onClick={openCreate}>Tambah Gedung</Button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari gedung..."
              style={{
                width: '100%', padding: '8px 12px 8px 34px', background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)',
                color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none',
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{meta?.total || 0} gedung</span>
        </div>

        <div style={{ padding: '0 0 8px' }}>
          <Table columns={columns} data={filtered} loading={loading} emptyText="Belum ada gedung" />
        </div>

        <div style={{ padding: '0 20px 16px' }}>
          <Pagination meta={meta} onPage={p => { setPage(p); load(p); }} />
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'create' ? 'Tambah Gedung Baru' : 'Edit Gedung'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Nama Gedung" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name?.[0]} placeholder="Contoh: Gedung A" />
          <Textarea label="Deskripsi (opsional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} error={errors.description?.[0]} placeholder="Deskripsi gedung..." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Latitude" type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} error={errors.latitude?.[0]} placeholder="-0.9471" icon={<MapPin size={13} />} />
            <Input label="Longitude" type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} error={errors.longitude?.[0]} placeholder="100.4172" icon={<MapPin size={13} />} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={() => setModal(null)}>Batal</Button>
            <Button loading={saving} onClick={handleSave}>{modal === 'create' ? 'Tambahkan' : 'Simpan Perubahan'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Konfirmasi Hapus">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--red)' }}>
            <Trash2 size={24} />
          </div>
          <p style={{ fontSize: 15, marginBottom: 8 }}>Hapus gedung <strong>{selected?.name}</strong>?</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Gedung tidak dapat dihapus jika masih memiliki fasilitas terkait.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => setModal(null)}>Batal</Button>
            <Button variant="danger" loading={saving} onClick={handleDelete}>Ya, Hapus</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
