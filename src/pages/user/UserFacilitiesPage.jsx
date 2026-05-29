import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Building2, Layers, Filter } from 'lucide-react';
import { facilitiesAPI, categoriesAPI } from '../../api/services';
import { Card, Badge, Pagination } from '../../components/ui';
import toast from 'react-hot-toast';

export default function UserFacilitiesPage() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await facilitiesAPI.list(p);
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch { toast.error('Gagal memuat fasilitas'); }
    setLoading(false);
  };

  useEffect(() => {
    load(1);
    categoriesAPI.list().then(r => setCategories(r.data.data)).catch(() => {});
  }, []);

  const filtered = data.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || String(f.category?.id) === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
          <MapPin size={24} style={{ color: 'var(--accent)' }} /> Fasilitas Kampus
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Temukan dan eksplorasi fasilitas yang tersedia di kampus</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari fasilitas..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ padding: '9px 32px 9px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b91a8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>{filtered.length} fasilitas</span>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height: 140, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <MapPin size={36} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
          <p>Tidak ada fasilitas ditemukan</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }} className="truncate">{f.name}</div>
                    {f.category && <Badge color="accent">{f.category.name}</Badge>}
                  </div>
                </div>
                {f.description && (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                    {f.description.slice(0, 100)}{f.description.length > 100 ? '…' : ''}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', marginTop: 'auto' }}>
                  {f.coordinate?.lat && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={11} /> {f.coordinate.lat.toFixed(4)}, {f.coordinate.lng.toFixed(4)}
                    </span>
                  )}
                  {f.building_id && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Building2 size={11} /> Gedung #{f.building_id}
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Pagination meta={meta} onPage={p => { setPage(p); load(p); }} />
      </div>
    </motion.div>
  );
}
