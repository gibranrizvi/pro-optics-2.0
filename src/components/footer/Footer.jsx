import React from 'react';

export default () => {
  return (
    <div>
      <footer className="bg-dark text-light mt-5 p-4 text-center">
        Copyright &copy; {new Date().getFullYear()}{' '}
        <a
          href="https://calibanholding.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pro Optics
        </a>
      </footer>
    </div>
  );
};
