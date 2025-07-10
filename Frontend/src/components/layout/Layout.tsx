import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export {Layout};
