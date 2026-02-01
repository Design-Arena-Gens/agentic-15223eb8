'use client';

import { Task } from '@/lib/types';
import { formatDate, getStatusColor, getPriorityColor, isOverdue, isDueSoon, getUserInitials } from '@/lib/utils';
import { Clock, AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { getUserById } from '@/lib/mockData';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  showProject?: boolean;
}

export default function TaskCard({ task, onClick, showProject = false }: TaskCardProps) {
  const dueDate = new Date(task.dueDate);
  const overdue = isOverdue(dueDate) && task.status !== 'completed';
  const dueSoon = isDueSoon(dueDate);
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const progressPercent = task.subtasks.length > 0
    ? Math.round((completedSubtasks / task.subtasks.length) * 100)
    : 0;

  return (
    <div
      onClick={() => onClick(task)}
      className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-4 hover:border-urbanweb-accent transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(task.status)} text-white`}>
              {task.status}
            </span>
            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            {task.recurring && (
              <span className="text-xs text-gray-500">↻ Recurring</span>
            )}
          </div>
          <h3 className="text-white font-medium text-sm mb-1">{task.title}</h3>
          <p className="text-gray-400 text-xs line-clamp-2">{task.description}</p>
        </div>
      </div>

      {task.subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{completedSubtasks}/{task.subtasks.length} subtasks</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-urbanweb-accent h-1.5 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          {task.assignedTo.slice(0, 3).map((userId, idx) => {
            const user = getUserById(userId);
            return (
              <div
                key={userId}
                className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border border-gray-600"
                style={{ marginLeft: idx > 0 ? '-8px' : '0' }}
                title={user?.name}
              >
                {user ? getUserInitials(user.name) : '?'}
              </div>
            );
          })}
          {task.assignedTo.length > 3 && (
            <span className="text-xs text-gray-400 ml-1">+{task.assignedTo.length - 3}</span>
          )}
        </div>

        <div className={`flex items-center space-x-1 text-xs ${
          overdue ? 'text-red-400' : dueSoon ? 'text-yellow-400' : 'text-gray-400'
        }`}>
          {overdue ? (
            <AlertCircle className="w-3.5 h-3.5" />
          ) : task.status === 'completed' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Clock className="w-3.5 h-3.5" />
          )}
          <span>{formatDate(dueDate)}</span>
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {task.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
