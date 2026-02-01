'use client';

import { Task, User, TaskStatus } from '@/lib/types';
import { formatDate, getStatusColor, getPriorityColor, getUserInitials } from '@/lib/utils';
import { X, Calendar, User as UserIcon, Clock, Tag, FileText, CheckSquare } from 'lucide-react';
import { getUserById } from '@/lib/mockData';

interface TaskModalProps {
  task: Task;
  currentUser: User;
  onClose: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
}

export default function TaskModal({ task, currentUser, onClose, onStatusChange, onSubtaskToggle }: TaskModalProps) {
  const creator = getUserById(task.createdBy);
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'manager' || task.assignedTo.includes(currentUser.id);
  const showInternalNotes = currentUser.role !== 'viewer';

  const statusOptions: TaskStatus[] = ['todo', 'in-progress', 'review', 'completed'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-urbanweb-secondary rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-urbanweb-secondary border-b border-gray-800 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(task.status)} text-white`}>
                {task.status}
              </span>
              <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority} priority
              </span>
              <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
                {task.type}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-white">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
            <p className="text-white">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Due Date</span>
              </h3>
              <p className="text-white">{formatDate(new Date(task.dueDate))}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Time Tracking</span>
              </h3>
              <p className="text-white">
                {task.actualHours || 0}h / {task.estimatedHours || 0}h estimated
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center space-x-2">
              <UserIcon className="w-4 h-4" />
              <span>Assigned To</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {task.assignedTo.map(userId => {
                const user = getUserById(userId);
                return user ? (
                  <div key={userId} className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-urbanweb-accent flex items-center justify-center text-xs text-white">
                      {getUserInitials(user.name)}
                    </div>
                    <span className="text-sm text-white">{user.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {task.subtasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center space-x-2">
                <CheckSquare className="w-4 h-4" />
                <span>Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})</span>
              </h3>
              <div className="space-y-2">
                {task.subtasks.map(subtask => (
                  <label
                    key={subtask.id}
                    className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => canEdit && onSubtaskToggle(task.id, subtask.id)}
                      disabled={!canEdit}
                      className="w-4 h-4 rounded border-gray-600 text-urbanweb-accent focus:ring-urbanweb-accent"
                    />
                    <span className={`text-sm ${subtask.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {subtask.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {task.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map(tag => (
                  <span key={tag} className="text-sm px-3 py-1 bg-gray-800 text-gray-300 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {showInternalNotes && task.internalNotes && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Internal Notes</span>
              </h3>
              <p className="text-white bg-gray-800 p-3 rounded-lg text-sm">{task.internalNotes}</p>
            </div>
          )}

          {canEdit && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Update Status</h3>
              <div className="grid grid-cols-4 gap-2">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    onClick={() => onStatusChange(task.id, status)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      task.status === status
                        ? `${getStatusColor(status)} text-white`
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800 text-xs text-gray-500">
            <p>Created by {creator?.name} on {formatDate(new Date(task.createdAt))}</p>
            <p>Last updated {formatDate(new Date(task.updatedAt))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
