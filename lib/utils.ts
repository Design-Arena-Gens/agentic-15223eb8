import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { Task, TaskStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

export function formatRelativeDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isOverdue(date: Date): boolean {
  return isBefore(date, new Date());
}

export function isDueSoon(date: Date, days: number = 3): boolean {
  const targetDate = addDays(new Date(), days);
  return isAfter(date, new Date()) && isBefore(date, targetDate);
}

export function getStatusColor(status: TaskStatus): string {
  const colors = {
    'todo': 'bg-gray-500',
    'in-progress': 'bg-blue-500',
    'review': 'bg-yellow-500',
    'completed': 'bg-green-500',
  };
  return colors[status];
}

export function getPriorityColor(priority: string): string {
  const colors = {
    'low': 'text-gray-400',
    'medium': 'text-blue-400',
    'high': 'text-orange-400',
    'urgent': 'text-red-400',
  };
  return colors[priority as keyof typeof colors] || 'text-gray-400';
}

export function calculateProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
}

export function getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter(t => t.status === status);
}

export function getTasksDueToday(tasks: Task[]): Task[] {
  const today = new Date();
  return tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate.toDateString() === today.toDateString();
  });
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  return tasks.filter(t => isOverdue(new Date(t.dueDate)) && t.status !== 'completed');
}

export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
