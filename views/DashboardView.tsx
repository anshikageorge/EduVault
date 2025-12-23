
import React, { useState } from 'react';
import { Subject } from '../types';

interface DashboardViewProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  onAddSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onEditSubject: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ subjects, onSelectSubject, onAddSubject, onDeleteSubject, onEditSubject }) => {
  const handleCreateNew = () => {
    const name = prompt("Enter Subject Name:");
    if (!name) return;
    const desc = prompt("Enter Description:");
    
    const themes = [
      { bg: 'bg-indigo-50 text-indigo-600', icon: 'book' },
      { bg: 'bg-rose-50 text-rose-600', icon: 'biotech' },
      { bg: 'bg-amber-50 text-amber-600', icon: 'history' },
      { bg: 'bg-emerald-50 text-emerald-600', icon: 'eco' },
      { bg: 'bg-purple-50 text-purple-600', icon: 'calculate' },
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];

    const newSub: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: desc || 'Academic course',
      icon: theme.icon,
      colorClass: theme.bg,
      fileCount: 0,
      lastUpdated: 'Just now'
    };
    onAddSubject(newSub);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400">
        <a className="hover:text-primary transition-colors" href="#">Home</a>
        <span className="material-symbols-outlined text-base mx-2 text-slate-400">chevron_right</span>
        <span className="font-medium text-slate-900 dark:text-white">Subjects</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Subjects</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your courses, assignments, and documents.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all flex items-center gap-2 group active:scale-95"
        >
          <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">add</span>
          <span>Add Subject</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <button 
          onClick={handleCreateNew}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary text-slate-400 hover:text-primary transition-all h-full min-h-[180px] hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">add_circle</span>
          </div>
          <span className="font-semibold text-sm">Create New Subject</span>
        </button>

        {subjects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 italic">
            No subjects found. Try adjusting your search or create a new one.
          </div>
        ) : (
          subjects.map((subject) => (
            <div 
              key={subject.id}
              onClick={() => onSelectSubject(subject)}
              className="flex flex-col p-5 rounded-xl bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`size-12 rounded-lg flex items-center justify-center ${subject.colorClass}`}>
                  <span className="material-symbols-outlined text-2xl">{subject.icon}</span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEditSubject(subject.id); }}
                    className="text-slate-400 hover:text-blue-500 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteSubject(subject.id); }}
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{subject.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">{subject.description}</p>
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">folder</span>
                  <span className="font-medium">{subject.fileCount} Files</span>
                </div>
                <span className="text-slate-400">Updated {subject.lastUpdated}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardView;
