import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 text-center w-full mt-auto shadow-inner">
      <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} <span className="font-semibold text-blue-700">Church Finance Manager</span>. ACK Kamune Parish. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
