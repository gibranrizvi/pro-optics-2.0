import React from 'react';

import TextFieldGroup from '../text-field-group/TextFieldGroup';

const EquipmentFieldGroup = ({
  name,
  nameMac,
  nameSerial,
  value,
  valueMac,
  valueSerial,
  label,
  onCheck,
  onChange
}) => {
  return (
    <div className="row">
      <div className="col-4 form-check pl-5 mt-1">
        <input
          type="checkbox"
          className="form-check-input"
          name={name}
          value={value}
          checked={value}
          onChange={onCheck}
          id={name}
        />
        <label htmlFor={name} className="text-muted form-check-label">
          {label}
        </label>
      </div>
      {value && (
        <div className="col 8">
          <TextFieldGroup
            placeholder="MAC Address"
            name={nameMac}
            value={valueMac}
            onChange={onChange}
          />
          <TextFieldGroup
            placeholder="Serial Address"
            name={nameSerial}
            value={valueSerial}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
};

export default EquipmentFieldGroup;
