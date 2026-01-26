
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

      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">{subject.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">{subject.description}</p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-blue-600 text-white flex items-center justify-center gap-3 px-8 h-14 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-primary/30 active:scale-95 group"
        >
          <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
          <span>+ Add Subject</span>
        </button>

        {/* Hidden List to preserve navigation logic without showing cards */}
        <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapters.map(chapter => (
            <div 
              key={chapter.id}
              onClick={() => onSelectChapter(chapter)}
              className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2632] border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold">
                  {chapter.chapterNumber}
                </div>
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{chapter.name}</span>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailView;
