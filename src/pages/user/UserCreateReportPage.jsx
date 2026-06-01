import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Upload, X, AlertCircle, CheckCircle2, Navigation, Building2, Map as MapIcon, Filter } from 'lucide-react';
import { reportsAPI, facilitiesAPI, buildingsAPI } from '../../api/services';
import { Button, Input, Textarea, Select, Badge } from '../../components/ui';
import { Map, MapPinSelector, MapClusterLayer, MapMarker } from '../../components/map';
import toast from 'react-hot-toast';

export default function UserCreateReportPage() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({
    title: '',
    description: '',
    facility_id: '',
    latitude: '',
    longitude: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [geoBuildings, setGeoBuildings] = useState(null);
  const [geoFacilities, setGeoFacilities] = useState(null);
  const [markerFilter, setMarkerFilter] = useState('all'); // 'all' | 'building' | 'facility' | 'none'
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mapCenter, setMapCenter] = useState([-0.9500, 100.3800]);
  const [selectedEntityName, setSelectedEntityName] = useState('');
  const [focusedBuildingId, setFocusedBuildingId] = useState(null);

  useEffect(() => {
    Promise.all([
      buildingsAPI.list({ format: 'geojson' }),
      facilitiesAPI.list({ format: 'geojson' })
    ]).then(([bRes, fRes]) => {
      setGeoBuildings(bRes.data);
      setGeoFacilities(fRes.data);
    }).catch(() => toast.error('Gagal memuat data peta'));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Ukuran gambar maksimal 2MB'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleMapSelect = ({ lat, lng }) => {
    setForm(f => ({ ...f, latitude: lat.toFixed(7), longitude: lng.toFixed(7), facility_id: '' }));
    setSelectedEntityName('');
  };

  const handleMarkerSelect = (type, entity) => {
    const coords = entity.geometry.coordinates;
    
    if (type === 'building') {
      setFocusedBuildingId(entity.properties.id);
      setMapCenter([coords[1], coords[0]]);
      toast.success(`Gedung ${entity.properties.name}: Pilih fasilitas di dalamnya`);
      return;
    }

    setForm(f => ({
      ...f,
      latitude: coords[1].toFixed(7),
      longitude: coords[0].toFixed(7),
      facility_id: entity.properties.id
    }));
    setSelectedEntityName(entity.properties.name);
    toast.success(`Dipilih: ${entity.properties.name}`);
  };

  const resetMapFocus = () => {
    setFocusedBuildingId(null);
    setMarkerFilter('all');
  };

  const handleGPS = ({ lat, lng }) => {
    setForm(f => ({ ...f, latitude: lat.toFixed(7), longitude: lng.toFixed(7), facility_id: '' }));
    setMapCenter([lat, lng]);
    setSelectedEntityName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.title.trim()) { setErrors({ title: ['Judul wajib diisi'] }); return; }
    if (!form.description.trim()) { setErrors({ description: ['Deskripsi wajib diisi'] }); return; }
    if (!form.latitude || !form.longitude) { toast.error('Koordinat lokasi wajib diisi'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('latitude', form.latitude);
      fd.append('longitude', form.longitude);
      if (form.facility_id) fd.append('facility_id', form.facility_id);
      if (image) fd.append('image', image);

      await reportsAPI.create(fd);
      setSubmitted(true);
      toast.success('Laporan berhasil dikirim!');
      setTimeout(() => navigate('/user/reports'), 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || 'Gagal mengirim laporan');
      }
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ textAlign: 'center', maxWidth: 380 }}
        >
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--green)' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Laporan Terkirim!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Laporan kamu sudah kami terima. Tim kami akan segera menindaklanjutinya.</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>Mengarahkan ke halaman laporan...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: '28px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={24} style={{ color: 'var(--green)' }} /> Buat Laporan
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Laporkan masalah atau kerusakan fasilitas kampus yang kamu temukan</p>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Input
                label="Judul Laporan *"
                placeholder="Contoh: Toilet rusak di lantai 2"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                error={errors.title?.[0]}
              />

              <Textarea
                label="Deskripsi *"
                placeholder="Jelaskan masalah secara detail..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                error={errors.description?.[0]}
                rows={4}
              />

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  Foto Bukti (opsional)
                </div>
                {preview ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={preview} alt="preview" style={{ width: '100%', maxWidth: 240, height: 160, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                    <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                      style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: 'var(--red)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current.click()}
                    style={{ width: '100%', padding: '24px', background: 'var(--bg-elevated)', border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.15s', color: 'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}>
                    <Upload size={18} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Upload Foto Masalah</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lokasi Masalah *
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {focusedBuildingId ? (
                    <button type="button" onClick={resetMapFocus}
                      style={{ padding: '4px 10px', fontSize: 11, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-active)', color: 'var(--accent)', fontWeight: 600 }}>
                      <Building2 size={12} /> ← Kembali ke Gedung
                    </button>
                  ) : (
                    [
                      { id: 'all', icon: <MapIcon size={12} />, label: 'Semua' },
                      { id: 'building', icon: <Building2 size={12} />, label: 'Gedung' },
                      { id: 'facility', icon: <MapPin size={12} />, label: 'Fasilitas' },
                      { id: 'none', icon: <X size={12} />, label: 'Sembunyikan' },
                    ].map(f => (
                      <button key={f.id} type="button" onClick={() => setMarkerFilter(f.id)}
                        style={{ padding: '4px 8px', fontSize: 10, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, background: markerFilter === f.id ? 'var(--accent)' : 'var(--bg-elevated)', color: markerFilter === f.id ? '#fff' : 'var(--text-secondary)' }}>
                        {f.icon} {f.label}
                      </button>
                    ))
                  )}
                </div>
              </div>
              
              <div style={{ position: 'relative', height: 320, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border-strong)', marginBottom: 12 }}>
                <Map center={mapCenter} zoom={focusedBuildingId ? 19 : 17} style={{ height: '100%' }} onGPS={handleGPS}>
                  <MapClusterLayer>
                    {!focusedBuildingId && (markerFilter === 'all' || markerFilter === 'building') && geoBuildings?.features?.map(feature => (
                      <MapMarker 
                        key={`b-${feature.properties.id}`} 
                        type="building"
                        position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                        onClick={() => handleMarkerSelect('building', feature)}
                      />
                    ))}
                    {((!focusedBuildingId && (markerFilter === 'all' || markerFilter === 'facility')) || focusedBuildingId) && 
                      geoFacilities?.features
                        ?.filter(f => !focusedBuildingId || f.properties.building_id === focusedBuildingId)
                        ?.map(feature => (
                          <MapMarker 
                            key={`f-${feature.properties.id}`} 
                            type="facility"
                            icon={feature.properties.category_icon}
                            color={feature.properties.category_color}
                            position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                            onClick={() => handleMarkerSelect('facility', feature)}
                          />
                        ))
                    }
                  </MapClusterLayer>
                  <MapPinSelector 
                    onSelect={handleMapSelect} 
                    position={form.latitude && form.longitude ? [parseFloat(form.latitude), parseFloat(form.longitude)] : null} 
                  />
                </Map>
              </div>

              {selectedEntityName && (
                <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ color: 'var(--accent)' }}>{form.facility_id ? <MapPin size={16} /> : <Building2 size={16} />}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>{form.facility_id ? 'Fasilitas Dipilih' : 'Gedung Dipilih'}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedEntityName}</div>
                  </div>
                  <button type="button" onClick={() => { setSelectedEntityName(''); setForm(f => ({ ...f, facility_id: '' })); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Lat"
                    value={form.latitude}
                    onChange={e => { setForm({ ...form, latitude: e.target.value, facility_id: '' }); setSelectedEntityName(''); }}
                    type="number" step="any"
                    error={errors.latitude?.[0]}
                    icon={<MapPin size={12} />}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Lng"
                    value={form.longitude}
                    onChange={e => { setForm({ ...form, longitude: e.target.value, facility_id: '' }); setSelectedEntityName(''); }}
                    type="number" step="any"
                    error={errors.longitude?.[0]}
                    icon={<MapPin size={12} />}
                  />
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Tips:</span> Klik marker gedung/fasilitas di peta untuk memilih lokasi secara otomatis, atau klik di area kosong untuk menandai koordinat bebas.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <Button type="button" variant="secondary" onClick={() => navigate('/user/reports')} style={{ flex: 1 }}>Batal</Button>
            <Button type="submit" variant="primary" loading={loading} icon={<FileText size={15} />} style={{ flex: 2 }}>Kirim Laporan</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
