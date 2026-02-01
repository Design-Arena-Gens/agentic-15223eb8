'use client';

import { Notification } from '@/lib/types';
import { formatRelativeDate } from '@/lib/utils';
import { Bell, CheckCircle2, AlertCircle, Clock, FileEdit } from 'lucide-react';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationsView({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationsViewProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task-assigned':
        return <Bell className="w-5 h-5 text-blue-400" />;
      case 'deadline-approaching':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'task-completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'revision-requested':
        return <FileEdit className="w-5 h-5 text-orange-400" />;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'task-assigned':
        return 'border-blue-800 bg-blue-900/10';
      case 'deadline-approaching':
        return 'border-yellow-800 bg-yellow-900/10';
      case 'task-completed':
        return 'border-green-800 bg-green-900/10';
      case 'revision-requested':
        return 'border-orange-800 bg-orange-900/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2 bg-urbanweb-accent text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all ${
                notification.read
                  ? 'bg-urbanweb-secondary border-gray-800 opacity-60'
                  : `${getColor(notification.type)}`
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm mb-1">{notification.message}</p>
                  <p className="text-xs text-gray-500">{formatRelativeDate(notification.createdAt)}</p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="flex-shrink-0 text-xs text-urbanweb-accent hover:text-blue-400 transition-colors font-medium"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
