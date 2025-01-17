import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center w-full fixed bottom-0 left-0">
      <p>&copy; {new Date().getFullYear()} Church Finance. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
