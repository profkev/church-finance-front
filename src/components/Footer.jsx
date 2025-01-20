import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-4 text-center w-full fixed bottom-0 left-0">
      <p>&copy; {new Date().getFullYear()} Church Finance Manager. ACK Kamune Parish. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
