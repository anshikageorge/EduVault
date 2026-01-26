
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

  const sortedChapters = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);

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
        message="Are you sure you want to delete this chapter? This will remove all materials inside it permanently."
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
          <div className={`size-20 mx-auto rounded-3xl flex items-center justify-center mb-6 bg-primary/10 text-primary shadow-lg shadow-primary/5`}>
            <span className="material-symbols-outlined text-4xl">{subject.icon || 'school'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">{subject.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">{subject.description}</p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-blue-600 text-white flex items-center justify-center gap-3 px-8 h-14 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-primary/30 active:scale-95 group"
        >
          <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
          <span>Add Chapter</span>
        </button>

        <div className="w-full max-w-4xl mt-12 flex flex-col gap-4">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Course Curriculum</h2>
            <span className="text-xs text-slate-400 font-bold">{chapters.length} {chapters.length === 1 ? 'Chapter' : 'Chapters'}</span>
          </div>
          
          {sortedChapters.length === 0 ? (
            <div className="py-12 bg-slate-50/50 dark:bg-slate-800/10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">menu_book</span>
              <p className="text-slate-500 font-bold">No chapters yet</p>
              <button onClick={handleOpenAdd} className="text-primary text-sm font-bold mt-2 hover:underline">Create Chapter 1</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedChapters.map(chapter => (
                <div 
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter)}
                  className="flex items-center justify-between p-5 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold text-lg border border-primary/10">
                      {chapter.chapterNumber}
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{chapter.name}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{chapter.fileCount || 0} Materials</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenEdit(chapter); }}
                      className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit Chapter"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setChapterToDelete(chapter.id); }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete Chapter"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform ml-1">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailView;
