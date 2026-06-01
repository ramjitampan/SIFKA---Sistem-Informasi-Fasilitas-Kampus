import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, MapPin, ChevronDown, ChevronUp, Map as MapIcon, List } from 'lucide-react';
import { buildingsAPI } from '../../api/services';
import { Card, Badge, Pagination, Button } from '../../components/ui';
import { Map, MapClusterLayer, MapMarker } from '../../components/map';
import toast from 'react-hot-toast';

export default function UserBuildingsPage() {
  const [data, setData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await buildingsAPI.list({ page: p });
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch { toast.error('Gagal memuat gedung'); }
    setLoading(false);
  };

  const loadGeo = async () => {
    try {
      const res = await buildingsAPI.list({ format: 'geojson' });
      setGeoData(res.data);
    } catch { toast.error('Gagal memuat data peta'); }
  };

  useEffect(() => { load(1); }, []);

  useEffect(() => {
    if (viewMode === 'map' && !geoData) {
      loadGeo();
    }
  }, [viewMode]);

  const filtered = data.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building2 size={24} style={{ color: 'var(--purple)' }} /> Gedung Kampus
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Daftar gedung beserta fasilitas yang ada di dalamnya</p>
        </div>
        
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
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ position: 'relative', maxWidth: 380, marginBottom: 20 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari gedung..."
                style={{ width: '100%', padding: '9px 12px 9px 34px', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }} />
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 80, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Building2 size={36} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                <p>Tidak ada gedung ditemukan</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Card style={{ padding: 0, overflow: 'hidden' }}>
                      <button
                        onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'var(--font-body)' }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple)', flexShrink: 0 }}>
                          <Building2 size={20} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }} className="truncate" title={b.name}>{b.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                            {b.description && <span style={{ fontSize: 12, color: 'var(--text-muted)' }} className="truncate" title={b.description}>{b.description}</span>}
                            {b.coordinate?.lat && (
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={10} /> {b.coordinate.lat.toFixed(4)}, {b.coordinate.lng.toFixed(4)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {b.amenities?.length > 0 && (
                            <Badge color="purple">{b.amenities.length} fasilitas</Badge>
                          )}
                          <div style={{ color: 'var(--text-muted)' }}>
                            {expanded === b.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </button>

                      {expanded === b.id && b.amenities?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          style={{ borderTop: '1px solid var(--border)', padding: '16px 20px' }}
                        >
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, fontWeight: 600 }}>Fasilitas di Gedung Ini</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                            {b.amenities.map(a => (
                              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                <MapPin size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 500 }} className="truncate">{a.name}</div>
                                  {a.category && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.category.name}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <Pagination meta={meta} onPage={p => { setPage(p); load(p); }} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: 'calc(100vh - 250px)', minHeight: 500 }}>
            <Map>
              <MapClusterLayer>
                {geoData?.features?.map(feature => (
                  <MapMarker 
                    key={feature.properties.id} 
                    type="building"
                    position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                  >
                    <div style={{ width: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{feature.properties.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{feature.properties.description}</div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Badge color="purple">Gedung</Badge>
                      </div>
                    </div>
                  </MapMarker>
                ))}
              </MapClusterLayer>
            </Map>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
