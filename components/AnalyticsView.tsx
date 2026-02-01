'use client';

import { Task, Project, Milestone } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';
import { BarChart3, PieChart, TrendingUp, Clock } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  projects: Project[];
  milestones: Milestone[];
}

export default function AnalyticsView({ tasks, projects, milestones }: AnalyticsViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const avgCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const tasksByType = tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const totalActual = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
  const timeEfficiency = totalEstimated > 0 ? Math.round((totalActual / totalEstimated) * 100) : 0;

  const teamMembers = mockUsers.filter(u => u.role === 'employee' || u.role === 'manager');
  const memberStats = teamMembers.map(member => {
    const memberTasks = tasks.filter(t => t.assignedTo.includes(member.id));
    const completed = memberTasks.filter(t => t.status === 'completed').length;
    return {
      name: member.name,
      total: memberTasks.length,
      completed,
      rate: memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Performance insights and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-400/10">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-3xl font-bold text-green-400">{avgCompletionRate}%</span>
          </div>
          <p className="text-gray-400 text-sm">Avg Completion Rate</p>
        </div>

        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-400/10">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-blue-400">{totalTasks}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Tasks</p>
        </div>

        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-400/10">
              <PieChart className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-3xl font-bold text-purple-400">{projects.length}</span>
          </div>
          <p className="text-gray-400 text-sm">Active Projects</p>
        </div>

        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-400/10">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-3xl font-bold text-orange-400">{timeEfficiency}%</span>
          </div>
          <p className="text-gray-400 text-sm">Time Efficiency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Tasks by Type</h2>
          <div className="space-y-3">
            {Object.entries(tasksByType).map(([type, count]) => {
              const percentage = Math.round((count / totalTasks) * 100);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400 capitalize">{type.replace('-', ' ')}</span>
                    <span className="text-white font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-urbanweb-accent h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Tasks by Priority</h2>
          <div className="space-y-3">
            {Object.entries(tasksByPriority).map(([priority, count]) => {
              const percentage = Math.round((count / totalTasks) * 100);
              const colors = {
                low: 'bg-gray-500',
                medium: 'bg-blue-500',
                high: 'bg-orange-500',
                urgent: 'bg-red-500',
              };
              return (
                <div key={priority}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400 capitalize">{priority}</span>
                    <span className="text-white font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${colors[priority as keyof typeof colors]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Team Performance</h2>
        <div className="space-y-4">
          {memberStats.map(stat => (
            <div key={stat.name} className="border-b border-gray-800 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{stat.name}</span>
                <span className="text-sm text-gray-400">
                  {stat.completed}/{stat.total} completed ({stat.rate}%)
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${stat.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Time Tracking Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Estimated Hours</p>
            <p className="text-3xl font-bold text-white">{totalEstimated}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Actual Hours</p>
            <p className="text-3xl font-bold text-white">{totalActual}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Efficiency</p>
            <p className={`text-3xl font-bold ${timeEfficiency <= 100 ? 'text-green-400' : 'text-orange-400'}`}>
              {timeEfficiency}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
