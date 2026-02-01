'use client';

import { User } from '@/lib/types';
import { LayoutDashboard, CheckSquare, Users, BarChart3, Settings, Bell } from 'lucide-react';
import { getUserInitials } from '@/lib/utils';

interface SidebarProps {
  user: User;
  activeView: string;
  onViewChange: (view: string) => void;
  unreadCount: number;
}

export default function Sidebar({ user, activeView, onViewChange, unreadCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee'] },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, roles: ['admin', 'manager', 'employee'] },
    { id: 'team', label: 'Team Overview', icon: Users, roles: ['admin', 'manager'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'manager'] },
    { id: 'viewer', label: 'Project View', icon: LayoutDashboard, roles: ['viewer'] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="w-64 bg-urbanweb-secondary h-screen flex flex-col border-r border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-urbanweb-accent flex items-center justify-center text-white font-semibold">
            {getUserInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.department}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-urbanweb-accent text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-1">
        <button
          onClick={() => onViewChange('notifications')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
            activeView === 'notifications'
              ? 'bg-urbanweb-accent text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5" />
            <span className="text-sm font-medium">Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'settings'
              ? 'bg-urbanweb-accent text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          <p>Urbanweb Task Scheduler</p>
          <p className="mt-1">www.urbanweb.host</p>
        </div>
      </div>
    </div>
  );
}
