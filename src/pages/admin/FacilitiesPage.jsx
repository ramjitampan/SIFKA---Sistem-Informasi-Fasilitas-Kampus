import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, MapPin, Search } from 'lucide-react';
import { facilitiesAPI, categoriesAPI, buildingsAPI } from '../../api/services';
import { Button, Input, Textarea, Select, Table, Pagination, Modal, Card, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

const emptyForm = { category_id: '', name: '', description: '', latitude: '', longitude: '' };

export default function FacilitiesPage() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const [fRes, cRes] = await Promise.all([facilitiesAPI.list(p), categoriesAPI.list()]);
      setData(fRes.data.data);
      setMeta(fRes.data.meta);
      setCategories(cRes.data.data);
    } catch { toast.error('Gagal memuat data'); }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const catOptions = [{ value: '', label: '— Pilih Kategori —' }, ...categories.map(c => ({ value: c.id, label: `${c.icon_marker || ''} ${c.name}` }))];

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal('create'); };
  const openEdit = (f) => {
    setSelected(f);
    setForm({ category_id: f.category?.id || '', name: f.name, description: f.description || '', latitude: f.coordinate?.lat || '', longitude: f.coordinate?.lng || '' });
    setErrors({}); setModal('edit');
  };
  const openDelete = (f) => { setSelected(f); setModal('delete'); };

  const handleSave = async () => {
    setSaving(true); setErrors({});
    try {
      if (modal === 'create') { await facilitiesAPI.create(form); toast.success('Fasilitas ditambahkan'); }
      else { await facilitiesAPI.update(selected.id, form); toast.success('Fasilitas diperbarui'); }
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
      await facilitiesAPI.delete(selected.id);
      toast.success('Fasilitas dihapus'); setModal(null); load(page);
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menghapus'); setModal(null); }
    setSaving(false);
  };

  const filtered = data.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{v}</span> },
    { key: 'name', label: 'Fasilitas', render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: row.category?.color_code ? `${row.category.color_code}22` : 'var(--bg-elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>{row.category?.icon_marker || '📍'}</div>
        <div>
          <div style={{ fontWeight: 500 }}>{v}</div>
          {row.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{row.description.slice(0, 50)}…</div>}
        </div>
      </div>
    )},
    { key: 'category', label: 'Kategori', render: v => v ? (
      <Badge color="purple">{v.name}</Badge>
    ) : <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'coordinate', label: 'Koordinat', render: v => v?.lat ? (
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{v.lat?.toFixed(5)}, {v.lng?.toFixed(5)}</span>
    ) : <span style={{ color: 'var(--text-muted)' }}>—</span> },
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
            <MapPin size={24} style={{ color: 'var(--green)' }} /> Manajemen Fasilitas
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Kelola semua fasilitas yang tersedia di kampus</p>
        </div>
        <Button icon={<Plus size={15} />} onClick={openCreate}>Tambah Fasilitas</Button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari fasilitas..."
              style={{ width: '100%', padding: '8px 12px 8px 34px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{meta?.total || 0} fasilitas</span>
        </div>
        <Table columns={columns} data={filtered} loading={loading} emptyText="Belum ada fasilitas" />
        <div style={{ padding: '0 20px 16px' }}>
          <Pagination meta={meta} onPage={p => { setPage(p); load(p); }} />
        </div>
      </Card>

      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'create' ? 'Tambah Fasilitas Baru' : 'Edit Fasilitas'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select label="Kategori" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} options={catOptions} error={errors.category_id?.[0]} />
          <Input label="Nama Fasilitas" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name?.[0]} placeholder="Contoh: Toilet Lantai 2" />
          <Textarea label="Deskripsi (opsional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} error={errors.description?.[0]} placeholder="Deskripsi fasilitas..." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Latitude" type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} error={errors.latitude?.[0]} placeholder="-0.9471" icon={<MapPin size={13} />} />
            <Input label="Longitude" type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} error={errors.longitude?.[0]} placeholder="100.4172" icon={<MapPin size={13} />} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={() => setModal(null)}>Batal</Button>
            <Button loading={saving} onClick={handleSave}>{modal === 'create' ? 'Tambahkan' : 'Simpan'}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Konfirmasi Hapus">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--red)' }}>
            <Trash2 size={24} />
          </div>
          <p style={{ fontSize: 15, marginBottom: 8 }}>Hapus fasilitas <strong>{selected?.name}</strong>?</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Fasilitas tidak dapat dihapus jika masih memiliki laporan terkait.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => setModal(null)}>Batal</Button>
            <Button variant="danger" loading={saving} onClick={handleDelete}>Ya, Hapus</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
