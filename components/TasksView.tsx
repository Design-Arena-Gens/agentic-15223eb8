'use client';

import { useState } from 'react';
import { Task, User, TaskStatus, TaskPriority } from '@/lib/types';
import { Filter } from 'lucide-react';
import TaskCard from './TaskCard';

interface TasksViewProps {
  tasks: Task[];
  user: User;
  onTaskClick: (task: Task) => void;
}

export default function TasksView({ tasks, user, onTaskClick }: TasksViewProps) {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const userTasks = tasks.filter(t => t.assignedTo.includes(user.id));

  const filteredTasks = userTasks.filter(task => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (typeFilter !== 'all' && task.type !== typeFilter) return false;
    return true;
  });

  const groupedTasks: Record<TaskStatus, Task[]> = {
    'todo': filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    'review': filteredTasks.filter(t => t.status === 'review'),
    'completed': filteredTasks.filter(t => t.status === 'completed'),
  };

  const taskTypes = Array.from(new Set(tasks.map(t => t.type)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
        <p className="text-gray-400">Manage and track your assigned work</p>
      </div>

      <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-white font-medium">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-urbanweb-accent"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-2">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-urbanweb-accent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-urbanweb-accent"
            >
              <option value="all">All Types</option>
              {taskTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white capitalize">
                {status.replace('-', ' ')}
              </h2>
              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">
                {tasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} />
              ))}
              {tasks.length === 0 && (
                <div className="bg-urbanweb-secondary border border-dashed border-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-500 text-sm">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
