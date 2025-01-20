import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Login from './pages/Login';
import VoteheadManagement from './pages/VoteheadManagement';
import Expenditure from './pages/Expenditure';
import CategoryManagement from './pages/CategoryManagement';
import Report from './pages/Report';
import Visualization from './pages/Visualization';

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
          path="/expenditure"
          element={
            <MainLayout>
              <Expenditure />
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
        <Route
          path="/categories"
          element={
            <MainLayout>
              <CategoryManagement />
            </MainLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <MainLayout>
              <Report />
            </MainLayout>
          }
        />
        <Route
          path="/visualization"
          element={
            <MainLayout>
              <Visualization />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
