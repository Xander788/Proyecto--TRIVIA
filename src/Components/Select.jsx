import { useState } from 'react';

const CustomSelect = ({ value, onChange, options }) => {
  return (
    <div className="mb-4">
      <label className="form-label fw-bold text-white">Categoría</label>
      <select
        className="form-select form-select-lg shadow"
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option 
            key={opt.value} 
            value={opt.value}
            style={{ 
              backgroundColor: '#2b2b40', 
              color: '#fff',
              padding: '12px 20px'
            }}
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;