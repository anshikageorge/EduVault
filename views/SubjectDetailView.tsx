
import React from 'react';
import { Subject, Chapter } from '../types';

interface SubjectDetailViewProps {
  subject: Subject;
  chapters: Chapter[];
  onBack: () => void;
  onSelectChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  onDeleteChapter: (id: string) => void;
  onEditChapter: (id: string) => void;
}

const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({ subject, chapters, onBack, onSelectChapter, onAddChapter, onDeleteChapter, onEditChapter }) => {
  const handleNewChapter = () => {
    const name = prompt("Enter Chapter Name:");
    if (!name) return;
    const numInput = prompt("Enter Chapter Number:");
    const num = numInput ? parseInt(numInput) : (chapters.length + 1);
    
    const newChap: Chapter = {
      id: Math.random().toString(36).substr(2, 9),
      subjectId: subject.id,
      name,
      chapterNumber: num,
      icon: 'menu_book',
      colorClass: 'bg-emerald-50 text-emerald-600',
      fileCount: 0,
      lastUpdated: 'Just now'
    };
    onAddChapter(newChap);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <nav className="flex items-center gap-2 mb-2 text-sm text-slate-500 dark:text-slate-400">
        <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          Dashboard
        </button>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-medium text-slate-900 dark:text-white">{subject.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">{subject.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">{subject.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleNewChapter}
            className="bg-primary hover:bg-blue-600 text-white flex items-center justify-center gap-2 px-5 h-10 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Chapter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {chapters.map((chapter) => (
          <div 
            key={chapter.id}
            onClick={() => onSelectChapter(chapter)}
            className="group relative bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${chapter.colorClass}`}>
                <span className="material-symbols-outlined text-[28px]">{chapter.icon}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEditChapter(chapter.id); }}
                  className="p-1.5 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteChapter(chapter.id); }}
                  className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{chapter.name}</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Chapter {chapter.chapterNumber}</p>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                {chapter.fileCount} Files
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">{chapter.lastUpdated}</span>
            </div>
          </div>
        ))}

        <div onClick={handleNewChapter} className="group flex flex-col items-center justify-center bg-slate-50 dark:bg-[#101922] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300 cursor-pointer min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors mb-3">
            <span className="material-symbols-outlined text-[24px]">add</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-400 group-hover:text-primary transition-colors">Add New Chapter</h3>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailView;
