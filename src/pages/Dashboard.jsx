import React from 'react';
import VoteheadForm from '../components/VoteheadForm';

const Dashboard = () => {
  return (
    <div className="bg-white shadow-md rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to the Church Financial Management System!</p>
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Votehead Management</h1>
            <VoteheadForm />
          </div>
    </div>
  );
};

export default Dashboard;
