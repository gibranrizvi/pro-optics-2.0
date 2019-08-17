import React from 'react';
import spinner from '../../assets/gif/spinner.gif';

export default () => {
  return (
    <div>
      <img
        src={spinner}
        style={{
          width: '42px',
          margin: 'auto',
          marginTop: '40px',
          marginBottom: '40px',
          display: 'block'
        }}
        alt="Loading..."
      />
    </div>
  );
};
