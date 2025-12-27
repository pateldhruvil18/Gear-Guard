import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaTools,
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaThLarge,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout, isManager, isTechnician } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome, roles: ['manager', 'technician', 'user'] },
    { path: '/equipment', label: 'Equipment', icon: FaTools, roles: ['manager', 'technician'] },
    { path: '/teams', label: 'Teams', icon: FaUsers, roles: ['manager'] },
    { path: '/requests', label: 'My Requests', icon: FaClipboardList, roles: ['manager', 'technician', 'user'] },
    { path: '/kanban', label: 'Kanban Board', icon: FaThLarge, roles: ['manager', 'technician', 'user'] },
    { path: '/calendar', label: 'Calendar', icon: FaCalendarAlt, roles: ['manager', 'technician'] },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (user?.role === 'manager') return true;
    if (user?.role === 'technician') return item.roles.includes('technician') || item.roles.includes('user');
    // Users can see Dashboard, Requests, and Kanban
    if (user?.role === 'user') return item.path === '/dashboard' || item.path === '/requests' || item.path === '/kanban';
    return item.roles.includes('user');
  });

  return (
    <aside className="hidden lg:flex w-64 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white min-h-screen flex-col shadow-2xl border-r border-slate-700/50">
      <div className="p-6 border-b border-gray-700/50 bg-gray-900/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
            <FaTools className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            GearGuard
          </h1>
        </div>
        <p className="text-sm text-gray-400 ml-12">Maintenance System</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1.5">
          {filteredMenuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-700 text-white shadow-lg shadow-gray-700/30'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700/50 bg-gray-900/30">
        <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-gray-800/50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate capitalize">{user?.role || ''}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 font-medium hover:shadow-lg"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

