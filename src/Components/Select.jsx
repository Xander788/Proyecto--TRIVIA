import React, { useState } from 'react';

const CustomSelect = ({ value, onChange, options, label = "Categoría" }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value) || options[0];

  const handleSelect = (optValue) => {
    onChange({ target: { value: optValue } });
    setOpen(false);
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-bold mb-2" style={{ color: '#fff' }}>
        {label}
      </label>

      <div style={{ position: 'relative' }}>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(0, 188, 140, 0.4)',
            borderRadius: '12px',
            color: '#f0f0ff',
            fontSize: '1.1rem',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s',
            boxShadow: open ? '0 0 15px rgba(0, 188, 140, 0.3)' : 'none',
          }}
        >
          <span>{selected?.label}</span>
          <span style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            opacity: 0.8,
          }}>
            ▼
          </span>
        </button>

        {open && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: 'rgba(20, 20, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(0, 188, 140, 0.4)',
            borderRadius: '12px',
            overflow: 'hidden',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: opt.value === value
                    ? 'rgba(0, 188, 140, 0.25)'
                    : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  color: opt.value === value ? '#00bc8c' : '#f0f0ff',
                  fontSize: '1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: opt.value === value ? 'bold' : 'normal',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => {
                  if (opt.value !== value)
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={e => {
                  if (opt.value !== value)
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                {opt.value === value && '✓ '}{opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;