import React from 'react';
import { motion } from 'framer-motion';

// Button
export const Button = ({ children, variant = 'primary', size = 'md', loading, icon, onClick, type = 'button', disabled, className = '' }) => {
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover shadow-accent-sm',
    secondary: 'bg-elevated border border-border-strong text-primary hover:bg-hover',
    danger: 'bg-red-dim text-red border border-red/20 hover:bg-red/20',
    ghost: 'text-secondary hover:text-primary hover:bg-hover',
    success: 'bg-green-dim text-green border border-green/20 hover:bg-green/20',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontFamily: 'var(--font-body)', fontWeight: 500,
        borderRadius: 'var(--radius)',
        border: 'none', cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease', opacity: disabled || loading ? 0.5 : 1,
        ...styleMap[variant], ...sizeMap[size],
      }}
    >
      {loading ? <span className="animate-spin" style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block' }} /> : icon}
      {children}
    </button>
  );
};

const styleMap = {
  primary: { background: 'var(--accent)', color: '#fff', boxShadow: '0 0 20px var(--accent-glow)' },
  secondary: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-strong)' },
  danger: { background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' },
  ghost: { background: 'transparent', color: 'var(--text-secondary)' },
  success: { background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.2)' },
};

const sizeMap = {
  sm: { padding: '6px 12px', fontSize: '12px' },
  md: { padding: '8px 16px', fontSize: '14px' },
  lg: { padding: '12px 24px', fontSize: '15px' },
};

// Input
export const Input = ({ label, error, icon, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
    <div style={{ position: 'relative' }}>
      {icon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>}
      <input
        {...props}
        style={{
          width: '100%', padding: icon ? '10px 14px 10px 38px' : '10px 14px',
          background: 'var(--bg-elevated)', border: `1px solid ${error ? 'var(--red)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14,
          outline: 'none', transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border-strong)'}
      />
    </div>
    {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
  </div>
);

// Textarea
export const Textarea = ({ label, error, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
    <textarea
      {...props}
      style={{
        width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14,
        outline: 'none', resize: 'vertical', minHeight: 80, transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border-strong)'}
    />
    {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
  </div>
);

// Select
export const Select = ({ label, error, options = [], ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
    <select
      {...props}
      style={{
        width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14,
        outline: 'none', cursor: 'pointer', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b91a8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
      }}
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
  </div>
);

// Badge
export const Badge = ({ children, color = 'accent' }) => {
  const colors = {
    accent: { bg: 'var(--accent-dim)', color: 'var(--accent)' },
    green: { bg: 'var(--green-dim)', color: 'var(--green)' },
    yellow: { bg: 'var(--yellow-dim)', color: 'var(--yellow)' },
    red: { bg: 'var(--red-dim)', color: 'var(--red)' },
    purple: { bg: 'var(--purple-dim)', color: 'var(--purple)' },
    cyan: { bg: 'var(--cyan-dim)', color: 'var(--cyan)' },
    gray: { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' },
  };
  const c = colors[color] || colors.accent;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 100,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
      background: c.bg, color: c.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {children}
    </span>
  );
};

// Card
export const Card = ({ children, style = {}, onClick, className = '' }) => (
  <motion.div
    whileHover={onClick ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' } : {}}
    onClick={onClick}
    style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 20,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
  >
    {children}
  </motion.div>
);

// Stat Card
export const StatCard = ({ label, value, icon, color = 'accent', change }) => {
  const colors = {
    accent: { bg: 'var(--accent-dim)', color: 'var(--accent)' },
    green: { bg: 'var(--green-dim)', color: 'var(--green)' },
    yellow: { bg: 'var(--yellow-dim)', color: 'var(--yellow)' },
    red: { bg: 'var(--red-dim)', color: 'var(--red)' },
    purple: { bg: 'var(--purple-dim)', color: 'var(--purple)' },
    cyan: { bg: 'var(--cyan-dim)', color: 'var(--cyan)' },
  };
  const c = colors[color] || colors.accent;
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{value}</div>
          {change && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{change}</div>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

// Modal
export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const widths = { sm: 400, md: 560, lg: 720, xl: 900 };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)', padding: 28, width: '100%',
          maxWidth: widths[size], maxHeight: '90vh', overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{title}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
};

// Table
export const Table = ({ columns, data, loading, emptyText = 'No data' }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          {columns.map(col => (
            <th key={col.key} style={{
              padding: '10px 16px', textAlign: 'left', fontSize: 11,
              fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase',
              letterSpacing: '0.08em', whiteSpace: 'nowrap',
            }}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={columns.length} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span className="animate-spin" style={{ width: 24, height: 24, border: '2px solid var(--border-strong)', borderTopColor: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }} />
            </div>
          </td></tr>
        ) : data.length === 0 ? (
          <tr><td colSpan={columns.length} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>{emptyText}</td></tr>
        ) : data.map((row, i) => (
          <motion.tr
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {columns.map(col => (
              <td key={col.key} style={{ padding: '12px 16px', fontSize: 14, color: 'var(--text-primary)' }}>
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Pagination
export const Pagination = ({ meta, onPage }) => {
  if (!meta || meta.last_page <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', gap: 8, padding: '16px 0 0', borderTop: '1px solid var(--border)', marginTop: 8 }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1 }}>
        Showing {meta.from}–{meta.to} of {meta.total}
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPage(p)} style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
            background: meta.current_page === p ? 'var(--accent)' : 'var(--bg-elevated)',
            color: meta.current_page === p ? '#fff' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
          }}>{p}</button>
        ))}
      </div>
    </div>
  );
};

// Loading Skeleton
export const Skeleton = ({ width = '100%', height = 16, style = {} }) => (
  <div style={{
    width, height, borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    ...style,
  }} />
);

// Toast-like inline alert
export const Alert = ({ type = 'info', children }) => {
  const types = {
    info: { bg: 'var(--accent-dim)', color: 'var(--accent)', border: 'var(--accent)' },
    success: { bg: 'var(--green-dim)', color: 'var(--green)', border: 'var(--green)' },
    error: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'var(--red)' },
    warning: { bg: 'var(--yellow-dim)', color: 'var(--yellow)', border: 'var(--yellow)' },
  };
  const t = types[type];
  return (
    <div style={{
      padding: '12px 16px', borderRadius: 'var(--radius)', background: t.bg,
      border: `1px solid ${t.border}20`, color: t.color, fontSize: 13,
    }}>
      {children}
    </div>
  );
};

export const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    {label && <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
  </div>
);
