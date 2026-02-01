'use client';

import { Task, User, Project, Milestone, WorkloadStats } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';
import { getUserInitials, getOverdueTasks } from '@/lib/utils';
import { Users, TrendingUp, AlertCircle, Target } from 'lucide-react';
import TaskCard from './TaskCard';

interface TeamViewProps {
  tasks: Task[];
  projects: Project[];
  milestones: Milestone[];
  onTaskClick: (task: Task) => void;
}

export default function TeamView({ tasks, projects, milestones, onTaskClick }: TeamViewProps) {
  const teamMembers = mockUsers.filter(u => u.role === 'employee' || u.role === 'manager');

  const getWorkloadStats = (userId: string): WorkloadStats => {
    const userTasks = tasks.filter(t => t.assignedTo.includes(userId));
    return {
      userId,
      totalTasks: userTasks.length,
      completedTasks: userTasks.filter(t => t.status === 'completed').length,
      inProgressTasks: userTasks.filter(t => t.status === 'in-progress').length,
      overdueTasks: getOverdueTasks(userTasks).length,
      totalHours: userTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
    };
  };

  const allOverdueTasks = getOverdueTasks(tasks);
  const blockedTasks = tasks.filter(t => t.status === 'review');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Team Overview</h1>
        <p className="text-gray-400">Monitor team progress and workload distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-400/10">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-blue-400">{teamMembers.length}</span>
          </div>
          <p className="text-gray-400 text-sm">Active Team Members</p>
        </div>

        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-400/10">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-3xl font-bold text-red-400">{allOverdueTasks.length}</span>
          </div>
          <p className="text-gray-400 text-sm">Overdue Tasks</p>
        </div>

        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-400/10">
              <Target className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-3xl font-bold text-yellow-400">{blockedTasks.length}</span>
          </div>
          <p className="text-gray-400 text-sm">Tasks in Review</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Team Workload</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => {
            const stats = getWorkloadStats(member.id);
            const completionRate = stats.totalTasks > 0
              ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
              : 0;

            return (
              <div key={member.id} className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-5">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-urbanweb-accent flex items-center justify-center text-white font-semibold">
                    {getUserInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{member.name}</h3>
                    <p className="text-xs text-gray-400">{member.department}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total Tasks</span>
                    <span className="text-white font-medium">{stats.totalTasks}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">In Progress</span>
                    <span className="text-blue-400 font-medium">{stats.inProgressTasks}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Completed</span>
                    <span className="text-green-400 font-medium">{stats.completedTasks}</span>
                  </div>
                  {stats.overdueTasks > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Overdue</span>
                      <span className="text-red-400 font-medium">{stats.overdueTasks}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-800">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Completion Rate</span>
                      <span>{completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {allOverdueTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span>Attention Required</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allOverdueTasks.slice(0, 6).map(task => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.filter(p => p.status === 'active').map(project => {
            const projectTasks = tasks.filter(t => {
              const milestone = milestones.find(m => m.id === t.milestoneId);
              return milestone?.projectId === project.id;
            });
            const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
            const progress = projectTasks.length > 0
              ? Math.round((completedTasks / projectTasks.length) * 100)
              : 0;

            return (
              <div key={project.id} className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium mb-1">{project.title}</h3>
                    <p className="text-xs text-gray-400">{project.client}</p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                </div>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{projectTasks.length} tasks</span>
                    <span>{progress}% complete</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${progress}%`, backgroundColor: project.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
