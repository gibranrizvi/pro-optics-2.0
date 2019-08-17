import React from 'react';

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  errorMessage,
  info,
  type,
  onChange,
  disabled,
  autoFocus
}) => {
  return (
    <div>
      <div className="form-group">
        {label && <label className="text-muted">{label}</label>}
        <input
          type={type}
          className={`form-control ${error && 'is-invalid'}`}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoFocus={autoFocus}
        />
        {info && <small className="form-text text-muted">{info}</small>}
        {error && <div className="invalid-feedback">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default TextFieldGroup;
