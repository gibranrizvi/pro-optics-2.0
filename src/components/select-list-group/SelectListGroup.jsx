import React from 'react';

const SelectListGroup = ({
  name,
  value,
  info,
  fieldLabel,
  error,
  type,
  onChange,
  placeholderOption,
  items,
  disabled,
  required
}) => {
  return (
    <div className="form-group">
      {fieldLabel && <label className="text-muted">{fieldLabel}</label>}
      <select
        className={`form-control ${error && 'is-invalid'}`}
        name={name}
        value={value}
        onChange={onChange}
        info={info}
        type={type}
        disabled={disabled}
        required={required}
      >
        {placeholderOption && <option hidden>{placeholderOption}</option>}
        {items &&
          items.map(item => (
            <option key={item.label} value={item.value}>
              {item.label}
            </option>
          ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default SelectListGroup;
