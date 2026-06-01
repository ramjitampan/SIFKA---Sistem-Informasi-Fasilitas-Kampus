import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Building2, MapPin, Search, List, Map as MapIcon } from 'lucide-react';
import { buildingsAPI } from '../../api/services';
import { Button, Input, Textarea, Table, Pagination, Modal, Card, Badge } from '../../components/ui';
import { Map, MapPinSelector, MapClusterLayer, MapMarker } from '../../components/map';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', latitude: '', longitude: '' };

export default function BuildingsPage() {
  const [data, setData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // 'create' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [mapCenter, setMapCenter] = useState([-0.9500, 100.3800]);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await buildingsAPI.list({ page: p });
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch { toast.error('Gagal memuat data gedung'); }
    setLoading(false);
  };

  const loadGeo = async () => {
    try {
      const res = await buildingsAPI.list({ format: 'geojson' });
      setGeoData(res.data);
    } catch { toast.error('Gagal memuat data peta'); }
  };

  useEffect(() => { load(page); }, [page]);

  useEffect(() => {
    if (viewMode === 'map' && !geoData) {
      loadGeo();
    }
  }, [viewMode]);

  const openCreate = () => { 
    setForm(emptyForm); 
    setErrors({}); 
    setMapCenter([-0.9500, 100.3800]);
    setModal('create'); 
  };
  const openEdit = (b) => { 
    setSelected(b); 
    const lat = b.coordinate?.lat || -0.9500;
    const lng = b.coordinate?.lng || 100.3800;
    setForm({ name: b.name, description: b.description || '', latitude: lat.toString(), longitude: lng.toString() }); 
    setMapCenter([lat, lng]);
    setErrors({}); 
    setModal('edit'); 
  };
  const openDelete = (b) => { setSelected(b); setModal('delete'); };

  const handleMapSelect = ({ lat, lng }) => {
    setForm(f => ({ ...f, latitude: lat.toFixed(7), longitude: lng.toFixed(7) }));
  };

  const handleGPS = ({ lat, lng }) => {
    setForm(f => ({ ...f, latitude: lat.toFixed(7), longitude: lng.toFixed(7) }));
    setMapCenter([lat, lng]);
  };

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
      setModal(null); 
      load(page);
      loadGeo(); // Refresh geo data too
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
      setModal(null); load(page); loadGeo();
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
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 500 }} className="truncate" title={v}>{v}</div>
        {row.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }} className="truncate" title={row.description}>{row.description}</div>}
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

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--bg-elevated)', padding: 4, borderRadius: 10, border: '1px solid var(--border-strong)' }}>
            <button 
              onClick={() => setViewMode('list')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: viewMode === 'list' ? 'var(--accent)' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              <List size={14} /> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: viewMode === 'map' ? 'var(--accent)' : 'transparent',
                color: viewMode === 'map' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              <MapIcon size={14} /> Map
            </button>
          </div>
          <Button icon={<Plus size={15} />} onClick={openCreate}>Tambah Gedung</Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
          </motion.div>
        ) : (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: 'calc(100vh - 250px)', minHeight: 600 }}>
            <Map>
              <MapClusterLayer>
                {geoData?.features?.map(feature => (
                  <MapMarker 
                    key={feature.properties.id} 
                    type="building"
                    position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                  >
                    <div style={{ width: 220 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{feature.properties.name}</div>
                        <Button variant="ghost" size="sm" icon={<Edit2 size={12} />} onClick={() => {
                          const b = data.find(item => item.id === feature.properties.id);
                          if (b) openEdit(b);
                        }} />
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.4 }}>{feature.properties.description}</div>
                      <Badge color="purple">Gedung</Badge>
                    </div>
                  </MapMarker>
                ))}
              </MapClusterLayer>
            </Map>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'create' ? 'Tambah Gedung Baru' : 'Edit Gedung'} size="lg">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Nama Gedung" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name?.[0]} placeholder="Contoh: Gedung A" />
            <Textarea label="Deskripsi (opsional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} error={errors.description?.[0]} placeholder="Deskripsi gedung..." rows={4} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Latitude" type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} error={errors.latitude?.[0]} placeholder="-0.9471" icon={<MapPin size={13} />} />
              <Input label="Longitude" type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} error={errors.longitude?.[0]} placeholder="100.4172" icon={<MapPin size={13} />} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Button variant="secondary" onClick={() => setModal(null)}>Batal</Button>
              <Button loading={saving} onClick={handleSave}>{modal === 'create' ? 'Tambahkan' : 'Simpan Perubahan'}</Button>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Tandai Lokasi di Peta
            </div>
            <Map center={mapCenter} zoom={17} style={{ height: 320, minHeight: 320 }} onGPS={handleGPS}>
              <MapPinSelector 
                onSelect={handleMapSelect} 
                position={form.latitude && form.longitude ? [parseFloat(form.latitude), parseFloat(form.longitude)] : null} 
              />
            </Map>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              Klik pada peta untuk mengatur koordinat gedung secara visual.
            </div>
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
