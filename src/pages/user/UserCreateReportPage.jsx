import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { reportsAPI, facilitiesAPI } from '../../api/services';
import { Button, Input, Textarea, Select } from '../../components/ui';
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
  const [facilities, setFacilities] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    facilitiesAPI.list().then(r => setFacilities(r.data.data)).catch(() => {});
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Ukuran gambar maksimal 2MB'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) { toast.error('Browser tidak mendukung geolokasi'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({ ...f, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() }));
        toast.success('Lokasi berhasil didapatkan');
        setLocating(false);
      },
      () => { toast.error('Gagal mendapatkan lokasi'); setLocating(false); }
    );
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

  const facilityOptions = [
    { value: '', label: '— Tidak terkait fasilitas —' },
    ...facilities.map(f => ({ value: String(f.id), label: f.name })),
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: '28px 24px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={24} style={{ color: 'var(--green)' }} /> Buat Laporan
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Laporkan masalah atau kerusakan fasilitas kampus yang kamu temukan</p>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <Input
            label="Judul Laporan *"
            placeholder="Contoh: Toilet rusak di lantai 2"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            error={errors.title?.[0]}
          />

          <Textarea
            label="Deskripsi *"
            placeholder="Jelaskan masalah secara detail: kondisi, lokasi tepatnya, dan dampaknya..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            error={errors.description?.[0]}
            rows={4}
          />

          <Select
            label="Fasilitas Terkait"
            value={form.facility_id}
            onChange={e => setForm({ ...form, facility_id: e.target.value })}
            options={facilityOptions}
            error={errors.facility_id?.[0]}
          />

          {/* Coordinates */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Koordinat Lokasi *
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <input
                  placeholder="Latitude"
                  value={form.latitude}
                  onChange={e => setForm({ ...form, latitude: e.target.value })}
                  type="number" step="any"
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: `1px solid ${errors.latitude ? 'var(--red)' : 'var(--border-strong)'}`, borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  placeholder="Longitude"
                  value={form.longitude}
                  onChange={e => setForm({ ...form, longitude: e.target.value })}
                  type="number" step="any"
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: `1px solid ${errors.longitude ? 'var(--red)' : 'var(--border-strong)'}`, borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                />
              </div>
              <Button type="button" variant="secondary" icon={<MapPin size={14} />} loading={locating} onClick={handleGetLocation} style={{ flexShrink: 0 }}>
                Lokasi Saya
              </Button>
            </div>
            {(form.latitude && form.longitude) && (
              <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle2 size={12} /> Koordinat sudah diisi: {parseFloat(form.latitude).toFixed(5)}, {parseFloat(form.longitude).toFixed(5)}
              </div>
            )}
            {(!form.latitude || !form.longitude) && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlertCircle size={12} /> Klik "Lokasi Saya" atau isi koordinat secara manual
              </div>
            )}
          </div>

          {/* Image upload */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Foto Bukti (opsional, maks. 2MB)
            </div>
            {preview ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={preview} alt="preview" style={{ width: 200, height: 140, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                  style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current.click()}
                style={{ width: '100%', padding: '28px 20px', background: 'var(--bg-elevated)', border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.15s', color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}>
                <Upload size={24} />
                <span style={{ fontSize: 14, fontFamily: 'var(--font-body)' }}>Klik untuk upload foto</span>
                <span style={{ fontSize: 12 }}>JPG, PNG, GIF · Maks 2MB</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <Button type="button" variant="secondary" onClick={() => navigate('/user/reports')}>Batal</Button>
            <Button type="submit" variant="primary" loading={loading} icon={<FileText size={15} />}>Kirim Laporan</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
