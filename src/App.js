import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Login from './pages/Login';


const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
        <Route path="/login" element={<Login />} />

          <Route path="/" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
