
import React, { useState, useEffect } from 'react';
import { Chapter } from '../types';

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; chapterNumber: number }) => void;
  initialData?: Chapter | null;
}

const ChapterModal: React.FC<ChapterModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [chapterNumber, setChapterNumber] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setChapterNumber(initialData.chapterNumber.toString());
    } else {
      setName('');
      setChapterNumber('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
          {initialData ? 'Edit Chapter' : 'Add New Chapter'}
        </h2>
        
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          onSubmit({ name, chapterNumber: parseInt(chapterNumber) || 1 }); 
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Chapter Name</label>
            <input 
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Introduction to Physics"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Chapter Number</label>
            <input 
              required
              type="number"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(e.target.value)}
              placeholder="1"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors">
              {initialData ? 'Save Changes' : 'Create Chapter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChapterModal;
