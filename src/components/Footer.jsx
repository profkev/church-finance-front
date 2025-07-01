import React from 'react';

const Footer = () => {
  const tenantName = JSON.parse(localStorage.getItem('tenant'))?.name || 'Church Finance';
  return (
    <footer className="bg-white border-t border-gray-200 py-4 text-center w-full mt-auto shadow-inner">
      <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} <span className="font-semibold text-blue-700">{tenantName}</span>. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
