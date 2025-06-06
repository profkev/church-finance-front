import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Login from './pages/Login';
import VoteheadManagement from './pages/VoteheadManagement';
import Expenditure from './pages/Expenditure';
import Report from './pages/Report';
import Visualization from './pages/Visualization';
import AccountingReports from './pages/AccountingReports';
import AccountManagement from './pages/AccountManagement';
import JournalEntries from './pages/JournalEntries';
import RevenueSourceManagement from './pages/RevenueSourceManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Pages with MainLayout as a wrapper */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="income" element={<Income />} />
          <Route path="expenditure" element={<Expenditure />} />
          <Route path="voteheads" element={<VoteheadManagement />} />
          <Route path="reports" element={<Report />} />
          <Route path="visualization" element={<Visualization />} />
          <Route path="accounting-reports" element={<AccountingReports />} />
          <Route path="accounts" element={<AccountManagement />} />
          <Route path="journal-entries" element={<JournalEntries />} />
          <Route path="revenue-sources" element={<RevenueSourceManagement />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App; 