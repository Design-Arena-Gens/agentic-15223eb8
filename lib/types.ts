export type UserRole = 'admin' | 'manager' | 'employee' | 'viewer';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskType = 'design' | 'video-editing' | 'branding' | 'development' | 'revision' | 'deployment' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  assignedTo: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  milestoneId: string;
  subtasks: Subtask[];
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  attachments?: string[];
  internalNotes?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  projectId: string;
  dueDate: Date;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  client?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  startDate: Date;
  endDate?: Date;
  teamMembers: string[];
  color: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task-assigned' | 'deadline-approaching' | 'task-completed' | 'revision-requested';
  message: string;
  taskId?: string;
  read: boolean;
  createdAt: Date;
}

export interface WorkloadStats {
  userId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalHours: number;
}
