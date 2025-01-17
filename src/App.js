import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Login from './pages/Login';
import VoteheadManagement from './pages/VoteheadManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Pages with MainLayout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/income"
          element={
            <MainLayout>
              <Income />
            </MainLayout>
          }
        />
        <Route
          path="/voteheads"
          element={
            <MainLayout>
              <VoteheadManagement />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
