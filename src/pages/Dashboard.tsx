import React from 'react';
import { useParams } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2>Dashboard</h2>
      {id ? <p>ID: {id}</p> : <p>No ID provided</p>}
    </div>
  );
};

export default Dashboard;