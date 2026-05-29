import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Layers, Search } from 'lucide-react';
import { categoriesAPI } from '../../api/services';
import { Button, Input, Table, Pagination, Modal, Card, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

const emptyForm = { name: '', icon_marker: '', color_code: '#4f7cff' };

const ICON_OPTIONS = ['🏢','🏫','🍽️','🚻','📚','⚽','🚗','🏥','🔧','🎓','💻','🏋️','🎭','🏊','☕'];

export default function CategoriesPage() {
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

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await categoriesAPI.list(p);
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch { toast.error('Gagal memuat kategori'); }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal('create'); };
  const openEdit = (c) => { setSelected(c); setForm({ name: c.name, icon_marker: c.icon_marker || '', color_code: c.color_code || '#4f7cff' }); setErrors({}); setModal('edit'); };
  const openDelete = (c) => { setSelected(c); setModal('delete'); };

  const handleSave = async () => {
    setSaving(true); setErrors({});
    try {
      if (modal === 'create') { await categoriesAPI.create(form); toast.success('Kategori ditambahkan'); }
      else { await categoriesAPI.update(selected.id, form); toast.success('Kategori diperbarui'); }
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
      await categoriesAPI.delete(selected.id);
      toast.success('Kategori dihapus'); setModal(null); load(page);
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menghapus'); setModal(null); }
    setSaving(false);
  };

  const filtered = data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{v}</span> },
    { key: 'name', label: 'Kategori', render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          background: row.color_code ? `${row.color_code}22` : 'var(--bg-elevated)',
          border: `1px solid ${row.color_code ? `${row.color_code}44` : 'var(--border)'}`,
        }}>{row.icon_marker || '📍'}</div>
        <div>
          <div style={{ fontWeight: 500 }}>{v}</div>
        </div>
      </div>
    )},
    { key: 'color_code', label: 'Warna', render: v => v ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: v, border: '1px solid var(--border)' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{v}</span>
      </div>
    ) : <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: '_actions', label: '', render: (_, row) => (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm" icon={<Edit2 size={13} />} onClick={() => openEdit(row)}>Edit</Button>
        <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => openDelete(row)}>Hapus</Button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 28, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Layers size={24} style={{ color: 'var(--purple)' }} /> Manajemen Kategori
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Kelola kategori fasilitas kampus</p>
        </div>
        <Button icon={<Plus size={15} />} onClick={openCreate}>Tambah Kategori</Button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kategori..."
              style={{ width: '100%', padding: '8px 12px 8px 34px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{meta?.total || 0} kategori</span>
        </div>
        <Table columns={columns} data={filtered} loading={loading} emptyText="Belum ada kategori" />
        <div style={{ padding: '0 20px 16px' }}>
          <Pagination meta={meta} onPage={p => { setPage(p); load(p); }} />
        </div>
      </Card>

      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'create' ? 'Tambah Kategori Baru' : 'Edit Kategori'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Nama Kategori" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name?.[0]} placeholder="Contoh: Toilet" />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Icon Marker</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 12, background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border-strong)', marginBottom: 4 }}>
              {ICON_OPTIONS.map(icon => (
                <button key={icon} type="button" onClick={() => setForm(f => ({ ...f, icon_marker: icon }))}
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: form.icon_marker === icon ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: form.icon_marker === icon ? 'var(--accent-dim)' : 'transparent',
                    cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.1s',
                  }}>{icon}</button>
              ))}
            </div>
            <Input value={form.icon_marker} onChange={e => setForm(f => ({ ...f, icon_marker: e.target.value }))} error={errors.icon_marker?.[0]} placeholder="Atau ketik emoji/teks" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kode Warna</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={form.color_code} onChange={e => setForm(f => ({ ...f, color_code: e.target.value }))}
                style={{ width: 44, height: 36, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', cursor: 'pointer', background: 'var(--bg-elevated)', padding: 2 }} />
              <Input value={form.color_code} onChange={e => setForm(f => ({ ...f, color_code: e.target.value }))} error={errors.color_code?.[0]} placeholder="#4f7cff" style={{ flex: 1 }} />
            </div>
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
          <p style={{ fontSize: 15, marginBottom: 8 }}>Hapus kategori <strong>{selected?.name}</strong>?</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Kategori tidak dapat dihapus jika masih digunakan fasilitas.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => setModal(null)}>Batal</Button>
            <Button variant="danger" loading={saving} onClick={handleDelete}>Ya, Hapus</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
