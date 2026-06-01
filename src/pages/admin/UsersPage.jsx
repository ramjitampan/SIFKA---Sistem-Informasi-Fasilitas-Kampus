import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, User, Search, Mail, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { usersAPI } from '../../api/services';
import { Button, Input, Table, Pagination, Modal, Card, Badge } from '../../components/ui';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const emptyForm = { name: '', email: '', password: '', role: 'student' };

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
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

  const load = async (p = 1, s = search) => {
    setLoading(true);
    try {
      const res = await usersAPI.list({ page: p, q: s });
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch { toast.error('Gagal memuat data pengguna'); }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      load(1, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const openCreate = () => { 
    setForm(emptyForm); 
    setErrors({}); 
    setModal('create'); 
  };

  const openEdit = (u) => { 
    setSelected(u); 
    setForm({ name: u.name, email: u.email, password: '', role: u.role }); 
    setErrors({}); 
    setModal('edit'); 
  };
  const openDelete = (u) => { setSelected(u); setModal('delete'); };

  const handleSave = async () => {
    setSaving(true); setErrors({});
    try {
      if (modal === 'create') {
        await usersAPI.create(form);
        toast.success('Pengguna berhasil ditambahkan');
      } else {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await usersAPI.update(selected.id, payload);
        toast.success('Pengguna berhasil diperbarui');
      }
      setModal(null); 
      load(page);
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await usersAPI.delete(selected.id);
      toast.success('Pengguna berhasil dihapus');
      setModal(null); load(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus pengguna');
      setModal(null);
    }
    setSaving(false);
  };

  const columns = [
    { key: 'id', label: '#', render: (v) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{v}</span> },
    { key: 'name', label: 'Nama Pengguna', render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
        }}>{v[0].toUpperCase()}</div>
        <div>
          <div style={{ fontWeight: 500 }}>{v} {row.id === currentUser?.id && <span style={{ color: 'var(--accent)', fontSize: 11 }}>(Anda)</span>}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{row.email}</div>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (v) => (
      <Badge color={v === 'admin' ? 'red' : v === 'staff' ? 'purple' : 'accent'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {v === 'admin' ? <ShieldAlert size={12} /> : v === 'staff' ? <ShieldCheck size={12} /> : <User size={12} />}
          {v.toUpperCase()}
        </div>
      </Badge>
    )},
    { key: 'created_at', label: 'Terdaftar', render: (v) => (
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        {new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    )},
    { key: '_actions', label: '', render: (_, row) => (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm" icon={<Edit2 size={13} />} onClick={() => openEdit(row)}>Edit</Button>
        {row.id !== currentUser?.id && (
          <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => openDelete(row)}>Hapus</Button>
        )}
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 28, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={24} style={{ color: 'var(--accent)' }} /> Manajemen Pengguna
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Kelola akun pengguna dan hak akses</p>
        </div>

        <Button icon={<Plus size={15} />} onClick={openCreate}>Tambah Pengguna</Button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              style={{
                width: '100%', padding: '8px 12px 8px 34px', background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)',
                color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none',
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{meta?.total || 0} pengguna</span>
        </div>

        <div style={{ padding: '0 0 8px' }}>
          <Table columns={columns} data={data} loading={loading} emptyText="Belum ada pengguna" />
        </div>

        <div style={{ padding: '0 20px 16px' }}>
          <Pagination meta={meta} onPage={p => { setPage(p); load(p); }} />
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'create' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Nama Lengkap" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name?.[0]} placeholder="Masukkan nama..." icon={<User size={13} />} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email?.[0]} placeholder="email@example.com" icon={<Mail size={13} />} />
          <Input label={modal === 'create' ? "Password" : "Password (biarkan kosong jika tidak ingin mengubah)"} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password?.[0]} placeholder="********" icon={<Shield size={13} />} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
             <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Role / Hak Akses</label>
             <div style={{ display: 'flex', gap: 12 }}>
                {['student', 'staff', 'admin'].map(r => (
                  <button
                    key={r}
                    onClick={() => setForm(f => ({ ...f, role: r }))}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 10, border: '1px solid',
                      borderColor: form.role === r ? 'var(--accent)' : 'var(--border-strong)',
                      background: form.role === r ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                      color: form.role === r ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    {r === 'admin' ? <ShieldAlert size={14} /> : r === 'staff' ? <ShieldCheck size={14} /> : <User size={14} />}
                    <span style={{ textTransform: 'capitalize' }}>{r}</span>
                  </button>
                ))}
             </div>
             {errors.role && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.role[0]}</div>}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
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
          <p style={{ fontSize: 15, marginBottom: 8 }}>Hapus pengguna <strong>{selected?.name}</strong>?</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Tindakan ini tidak dapat dibatalkan. Semua laporan terkait pengguna ini mungkin akan terpengaruh.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => setModal(null)}>Batal</Button>
            <Button variant="danger" loading={saving} onClick={handleDelete}>Ya, Hapus</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
