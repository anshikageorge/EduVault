
import React, { useState } from 'react';
import { Subject } from '../types';
import SubjectModal from '../components/SubjectModal';

interface DashboardViewProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  onAddSubject: (data: { name: string; description: string }) => void;
  onDeleteSubject: (id: string) => void;
  onEditSubject: (id: string, data: { name: string; description: string }) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  subjects, onSelectSubject, onAddSubject, onDeleteSubject, onEditSubject 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: { name: string; description: string }) => {
    if (editingSubject) {
      onEditSubject(editingSubject.id, data);
    } else {
      onAddSubject(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SubjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingSubject}
      />

      <nav className="flex items-center text-xs md:text-sm text-slate-500 dark:text-slate-400">
        <button onClick={() => window.location.reload()} className="hover:text-primary transition-colors">Home</button>
        <span className="material-symbols-outlined text-base mx-2 text-slate-400">chevron_right</span>
        <span className="font-medium text-slate-900 dark:text-white">Subjects</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Subjects</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Manage your courses, assignments, and documents.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group active:scale-95 w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">add</span>
          <span>Add Subject</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {subjects.map((subject) => (
          <div 
            key={subject.id}
            onClick={() => onSelectSubject(subject)}
            className="flex flex-col p-5 rounded-2xl bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`size-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary transition-transform group-hover:scale-110`}>
                <span className="material-symbols-outlined text-2xl">{subject.icon || 'book'}</span>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenEdit(subject); }}
                  className="text-slate-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  title="Edit Subject"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteSubject(subject.id); }}
                  className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Delete Subject"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{subject.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 h-10">{subject.description}</p>
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-slate-400">folder_open</span>
                <span>{subject.fileCount} Files</span>
              </div>
              <span className="text-slate-400 italic">Updated {subject.lastUpdated}</span>
            </div>
          </div>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-slate-300">library_books</span>
            </div>
            <p className="font-bold text-lg text-slate-600 dark:text-slate-300">No subjects found</p>
            <p className="text-sm max-w-[200px] text-center mt-1">Create your first subject to start organizing your study materials.</p>
            <button 
              onClick={handleOpenAdd}
              className="mt-6 text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create Subject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
