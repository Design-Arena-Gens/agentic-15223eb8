'use client';

import { Task, Project, Milestone } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { FolderOpen, Target, CheckCircle2 } from 'lucide-react';

interface ViewerViewProps {
  tasks: Task[];
  projects: Project[];
  milestones: Milestone[];
}

export default function ViewerView({ tasks, projects, milestones }: ViewerViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Project Overview</h1>
        <p className="text-gray-400">Track project progress and milestones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-400/10">
              <FolderOpen className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-blue-400">{projects.length}</span>
          </div>
          <p className="text-gray-400 text-sm">Active Projects</p>
        </div>

        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-400/10">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-3xl font-bold text-purple-400">{milestones.length}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Milestones</p>
        </div>

        <div className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-400/10">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-3xl font-bold text-green-400">
              {tasks.filter(t => t.status === 'completed').length}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Completed Tasks</p>
        </div>
      </div>

      <div className="space-y-6">
        {projects.map(project => {
          const projectMilestones = milestones.filter(m => m.projectId === project.id);
          const projectTasks = tasks.filter(t => {
            const milestone = milestones.find(m => m.id === t.milestoneId);
            return milestone?.projectId === project.id;
          });
          const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
          const progress = projectTasks.length > 0
            ? Math.round((completedTasks / projectTasks.length) * 100)
            : 0;

          return (
            <div key={project.id} className="bg-urbanweb-secondary border border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                  </div>
                  <p className="text-gray-400">{project.description}</p>
                  {project.client && (
                    <p className="text-sm text-gray-500 mt-2">Client: {project.client}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-400/10 text-green-400' :
                  project.status === 'completed' ? 'bg-blue-400/10 text-blue-400' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {project.status}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Overall Progress</span>
                  <span>{progress}% • {completedTasks}/{projectTasks.length} tasks</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{ width: `${progress}%`, backgroundColor: project.color }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Milestones</h3>
                {projectMilestones.map(milestone => {
                  const milestoneTasks = tasks.filter(t => t.milestoneId === milestone.id);
                  const completedMilestoneTasks = milestoneTasks.filter(t => t.status === 'completed').length;

                  return (
                    <div key={milestone.id} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1">{milestone.title}</h4>
                          <p className="text-sm text-gray-400">{milestone.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500">Due Date</p>
                          <p className="text-sm text-white">{formatDate(milestone.dueDate)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Progress</span>
                          <span>{completedMilestoneTasks}/{milestoneTasks.length} tasks completed</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${milestone.progress}%`,
                              backgroundColor: project.color,
                            }}
                          />
                        </div>
                      </div>

                      {milestoneTasks.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {milestoneTasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between text-sm py-2 border-t border-gray-700">
                              <div className="flex items-center space-x-3">
                                {task.status === 'completed' ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                ) : (
                                  <div className="w-4 h-4 border-2 border-gray-600 rounded-full" />
                                )}
                                <span className={task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}>
                                  {task.title}
                                </span>
                              </div>
                              <span className={`px-2 py-0.5 text-xs rounded ${
                                task.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                                task.status === 'in-progress' ? 'bg-blue-400/10 text-blue-400' :
                                task.status === 'review' ? 'bg-yellow-400/10 text-yellow-400' :
                                'bg-gray-700 text-gray-400'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
