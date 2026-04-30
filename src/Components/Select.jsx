import React, { useState } from 'react';

const CustomSelect = ({ value, onChange, options, label = "Categoría" }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value) || options[0];

  const handleSelect = (optValue) => {
    onChange({ target: { value: optValue } });
    setOpen(false);
  };

  return (
    <section className="mb-4">
      <label className="form-label fw-bold mb-2">
        {label}
      </label>

      <section className="custom-select-container">

        <button
          type="button"
          className={`custom-select-button ${open ? 'active' : ''}`}
          onClick={() => setOpen(!open)}
        >
          <span>{selected?.label}</span>
          <span className={`custom-select-arrow ${open ? 'open' : ''}`}>
            ▼
          </span>
        </button>

        {open && (
          <div className="custom-select-dropdown">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`custom-select-option ${opt.value === value ? 'selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.value === value && '✓ '}{opt.label}
              </button>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default CustomSelect;