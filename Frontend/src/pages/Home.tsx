import React from 'react';
import Dashboard from '../components/dashboard/Dashboard';

const Home: React.FC = () => {
  return (
   <div className="h-full w-full overflow-hidden bg-gray-100 px-4 md:px-6 py-8">
      <Dashboard />
   </div>
  );
};

export default Home;
