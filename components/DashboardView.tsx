'use client';

import { Task, User, Milestone, Project } from '@/lib/types';
import { getTasksByStatus, getOverdueTasks, calculateProgress, formatDate } from '@/lib/utils';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import TaskCard from './TaskCard';

interface DashboardViewProps {
  tasks: Task[];
  user: User;
  milestones: Milestone[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
}

export default function DashboardView({ tasks, user, milestones, projects, onTaskClick }: DashboardViewProps) {
  const userTasks = tasks.filter(t => t.assignedTo.includes(user.id));
  const inProgressTasks = getTasksByStatus(userTasks, 'in-progress');
  const overdueTasks = getOverdueTasks(userTasks);
  const completedTasks = getTasksByStatus(userTasks, 'completed');
  const upcomingTasks = userTasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const activeMilestones = milestones.filter(m => m.status === 'active');

  const stats = [
    {
      label: 'In Progress',
      value: inProgressTasks.length,
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Overdue',
      value: overdueTasks.length,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
    {
      label: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Total Tasks',
      value: userTasks.length,
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-gray-400">Here's what's on your plate today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {overdueTasks.length > 0 && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">Overdue Tasks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overdueTasks.slice(0, 4).map(task => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            {upcomingTasks.map(task => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
            {upcomingTasks.length === 0 && (
              <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-400">All caught up! No upcoming tasks.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Active Milestones</h2>
          <div className="space-y-3">
            {activeMilestones.map(milestone => {
              const project = projects.find(p => p.id === milestone.projectId);
              return (
                <div key={milestone.id} className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium text-sm mb-1">{milestone.title}</h3>
                      {project && (
                        <p className="text-xs text-gray-400">{project.title}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(milestone.dueDate)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${milestone.progress}%`,
                          backgroundColor: project?.color || '#3B82F6',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {activeMilestones.length === 0 && (
              <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">No active milestones</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
