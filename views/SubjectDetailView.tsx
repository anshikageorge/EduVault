
import React, { useState } from 'react';
import { Subject, Chapter } from '../types';
import ChapterModal from '../components/ChapterModal';
import ConfirmationModal from '../components/ConfirmationModal';

interface SubjectDetailViewProps {
  subject: Subject;
  chapters: Chapter[];
  onBack: () => void;
  onSelectChapter: (chapter: Chapter) => void;
  onAddChapter: (data: { name: string; chapterNumber: number }) => void;
  onDeleteChapter: (id: string) => void;
  onEditChapter: (id: string, data: { name: string; chapterNumber: number }) => void;
}

const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({ 
  subject, chapters, onBack, onSelectChapter, onAddChapter, onDeleteChapter, onEditChapter
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingChapter(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: { name: string; chapterNumber: number }) => {
    if (editingChapter) {
      onEditChapter(editingChapter.id, data);
    } else {
      onAddChapter(data);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (chapterToDelete) {
      onDeleteChapter(chapterToDelete);
      setChapterToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <ChapterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingChapter}
      />

      <ConfirmationModal 
        isOpen={!!chapterToDelete}
        onClose={() => setChapterToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Chapter"
        message="Are you sure you want to delete this chapter?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
      />

      <nav className="flex items-center gap-2 mb-2 text-sm text-slate-500 dark:text-slate-400">
        <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          Dashboard
        </button>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-medium text-slate-900 dark:text-white">{subject.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">{subject.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">{subject.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-blue-600 text-white flex items-center justify-center gap-2 px-5 h-10 rounded-lg text-sm font-bold transition-all shadow-sm"
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
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${chapter.colorClass || 'bg-emerald-50 text-emerald-600'}`}>
                <span className="material-symbols-outlined text-[28px]">{chapter.icon || 'menu_book'}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenEdit(chapter); }}
                  className="p-1.5 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setChapterToDelete(chapter.id); }}
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

        {/* Add New Chapter Tile Card */}
        <div 
          onClick={handleOpenAdd} 
          className="group flex flex-col items-center justify-center bg-slate-50 dark:bg-[#101922] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300 cursor-pointer min-h-[180px]"
        >
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors mb-3">
            <span className="material-symbols-outlined text-[24px]">add</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-400 group-hover:text-primary transition-colors">Add New Chapter</h3>
        </div>

        {chapters.length === 0 && (
          <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-400">
            <p className="text-sm">Start your curriculum by creating chapters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetailView;
