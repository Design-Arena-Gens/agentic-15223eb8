'use client';

import { useState } from 'react';
import { mockTasks, mockUsers, mockProjects, mockMilestones, mockNotifications, getCurrentUser } from '@/lib/mockData';
import { Task, TaskStatus, Notification } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import DashboardView from '@/components/DashboardView';
import TasksView from '@/components/TasksView';
import TeamView from '@/components/TeamView';
import AnalyticsView from '@/components/AnalyticsView';
import ViewerView from '@/components/ViewerView';
import NotificationsView from '@/components/NotificationsView';
import TaskModal from '@/components/TaskModal';

export default function Home() {
  const [currentUser] = useState(getCurrentUser());
  const [activeView, setActiveView] = useState(
    currentUser.role === 'viewer' ? 'viewer' : 'dashboard'
  );
  const [tasks, setTasks] = useState(mockTasks);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, status, updatedAt: new Date() }
        : t
    ));
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, status, updatedAt: new Date() });
    }
  };

  const handleSubtaskToggle = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? {
            ...t,
            subtasks: t.subtasks.map(st =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
            updatedAt: new Date(),
          }
        : t
    ));
    if (selectedTask?.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        subtasks: selectedTask.subtasks.map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        ),
        updatedAt: new Date(),
      });
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-urbanweb-primary overflow-hidden">
      <Sidebar
        user={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
        unreadCount={unreadCount}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {activeView === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              user={currentUser}
              milestones={mockMilestones}
              projects={mockProjects}
              onTaskClick={setSelectedTask}
            />
          )}

          {activeView === 'tasks' && (
            <TasksView
              tasks={tasks}
              user={currentUser}
              onTaskClick={setSelectedTask}
            />
          )}

          {activeView === 'team' && (
            <TeamView
              tasks={tasks}
              projects={mockProjects}
              milestones={mockMilestones}
              onTaskClick={setSelectedTask}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView
              tasks={tasks}
              projects={mockProjects}
              milestones={mockMilestones}
            />
          )}

          {activeView === 'viewer' && (
            <ViewerView
              tasks={tasks}
              projects={mockProjects}
              milestones={mockMilestones}
            />
          )}

          {activeView === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}

          {activeView === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account and preferences</p>
              </div>
              <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">Settings panel coming soon</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onStatusChange={handleStatusChange}
          onSubtaskToggle={handleSubtaskToggle}
        />
      )}
    </div>
  );
}
