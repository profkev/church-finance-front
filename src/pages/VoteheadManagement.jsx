import React from 'react';
import VoteheadForm from './VoteheadForm';

const VoteheadManagement = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Votehead Management</h1>
      <VoteheadForm />
    </div>
  );
};

export default VoteheadManagement;
