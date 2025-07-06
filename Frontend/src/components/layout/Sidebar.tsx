import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserPlusIcon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useLayout } from '../../context/LayoutContext';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Add New Student', href: '/add-student', icon: UserPlusIcon },
  { name: 'Student List', href: '/students', icon: UsersIcon },
  { name: 'Add New Course', href: '/add-course', icon: BookOpenIcon },
  { name: 'Course List', href: '/courses', icon: AcademicCapIcon },
  { name: 'Add New Result', href: '/add-result', icon: ChartBarIcon },
  { name: 'Results List', href: '/results', icon: DocumentTextIcon },
];

export const Sidebar: React.FC = () => {
  const { collapsed, toggleSidebar } = useLayout(); // ✅ using context

  return (
    <div
      className={`flex flex-col h-screen bg-slate-800 shadow-2xl transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center px-6 py-8 border-b border-slate-700/50">
        {collapsed ? (
          <div className="flex items-center justify-center w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Student Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">Academic Portal</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center ${
                collapsed ? 'justify-center' : ''
              } px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out relative ${
                isActive
                  ? 'bg-slate-700 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && (
                  <div className="absolute left-0 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
                )}
                <div className="flex-shrink-0 w-5 h-5">
                  <item.icon className="w-5 h-5" />
                </div>
                {!collapsed && <span className="ml-3 truncate font-medium">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700/50">
        <div className={`flex items-center justify-between ${collapsed ? 'justify-center' : ''}`}>
          {!collapsed && (
            <div className="flex items-center text-xs text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>System Online</span>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 ease-in-out"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
