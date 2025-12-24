
import { Subject, Chapter, FileItem } from './types';

const LATENCY = 400;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated Database helper
const getDB = (key: string, initial: any) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : initial;
};

const setDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  // Subjects
  getSubjects: async (): Promise<Subject[]> => {
    await delay(LATENCY);
    return getDB('ev_subjects', []);
  },
  createSubject: async (subject: Partial<Subject>): Promise<Subject> => {
    await delay(LATENCY);
    const subjects = getDB('ev_subjects', []);
    const newSub = { 
      ...subject, 
      id: Math.random().toString(36).substr(2, 9),
      fileCount: 0,
      lastUpdated: 'Just now'
    } as Subject;
    setDB('ev_subjects', [newSub, ...subjects]);
    return newSub;
  },
  updateSubject: async (id: string, updates: Partial<Subject>): Promise<Subject> => {
    await delay(LATENCY);
    const subjects = getDB('ev_subjects', []);
    const updated = subjects.map((s: Subject) => s.id === id ? { ...s, ...updates } : s);
    setDB('ev_subjects', updated);
    return updated.find((s: Subject) => s.id === id);
  },
  deleteSubject: async (id: string): Promise<void> => {
    await delay(LATENCY);
    const subjects = getDB('ev_subjects', []);
    setDB('ev_subjects', subjects.filter((s: Subject) => s.id !== id));
    
    // Cleanup linked chapters and files
    const chapters = getDB('ev_chapters', []);
    const filteredChapters = chapters.filter((c: Chapter) => c.subjectId !== id);
    setDB('ev_chapters', filteredChapters);
    
    const chapterIds = chapters.filter((c: Chapter) => c.subjectId === id).map((c: Chapter) => c.id);
    const files = getDB('ev_files', []);
    setDB('ev_files', files.filter((f: FileItem) => !chapterIds.includes(f.chapterId)));
  },

  // Chapters
  getChapters: async (subjectId: string): Promise<Chapter[]> => {
    await delay(LATENCY);
    const chapters = getDB('ev_chapters', []);
    return chapters.filter((c: Chapter) => c.subjectId === subjectId);
  },
  createChapter: async (chapter: Partial<Chapter>): Promise<Chapter> => {
    await delay(LATENCY);
    const chapters = getDB('ev_chapters', []);
    const newChap = {
      ...chapter,
      id: Math.random().toString(36).substr(2, 9),
      fileCount: 0,
      lastUpdated: 'Just now',
      icon: 'menu_book',
      colorClass: 'bg-emerald-50 text-emerald-600'
    } as Chapter;
    setDB('ev_chapters', [newChap, ...chapters]);
    return newChap;
  },
  updateChapter: async (id: string, updates: Partial<Chapter>): Promise<Chapter> => {
    await delay(LATENCY);
    const chapters = getDB('ev_chapters', []);
    const updated = chapters.map((c: Chapter) => c.id === id ? { ...c, ...updates } : c);
    setDB('ev_chapters', updated);
    return updated.find((c: Chapter) => c.id === id);
  },
  deleteChapter: async (id: string): Promise<void> => {
    await delay(LATENCY);
    const chapters = getDB('ev_chapters', []);
    setDB('ev_chapters', chapters.filter((c: Chapter) => c.id !== id));
    
    // Cleanup linked files
    const files = getDB('ev_files', []);
    setDB('ev_files', files.filter((f: FileItem) => f.chapterId !== id));
  },

  // Files
  getAllFiles: async (): Promise<FileItem[]> => {
    await delay(LATENCY);
    return getDB('ev_files', []);
  },
  getFiles: async (chapterId: string): Promise<FileItem[]> => {
    await delay(LATENCY);
    const files = getDB('ev_files', []);
    return files.filter((f: FileItem) => f.chapterId === chapterId);
  },
  uploadFile: async (chapterId: string, file: File): Promise<FileItem> => {
    await delay(LATENCY + 600);
    const files = getDB('ev_files', []);
    const ext = file.name.split('.').pop()?.toLowerCase();
    let type: 'pdf' | 'pptx' | 'png' | 'docx' | 'video' = 'pdf';
    
    if (ext === 'pptx') type = 'pptx';
    else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) type = 'png';
    else if (ext === 'docx') type = 'docx';
    else if (['mp4', 'mov', 'webm', 'avi'].includes(ext || '')) type = 'video';

    const newFile: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      chapterId,
      name: file.name,
      type,
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      isFavorite: false
    };
    setDB('ev_files', [newFile, ...files]);

    // Update chapter file count
    const chapters = getDB('ev_chapters', []);
    const updatedChapters = chapters.map((c: Chapter) => 
      c.id === chapterId ? { ...c, fileCount: (c.fileCount || 0) + 1, lastUpdated: 'Just now' } : c
    );
    setDB('ev_chapters', updatedChapters);

    return newFile;
  },
  updateFile: async (id: string, updates: Partial<FileItem>): Promise<FileItem> => {
    await delay(LATENCY);
    const files = getDB('ev_files', []);
    const updated = files.map((f: FileItem) => f.id === id ? { ...f, ...updates } : f);
    setDB('ev_files', updated);
    return updated.find((f: FileItem) => f.id === id);
  },
  deleteFile: async (fileId: string): Promise<void> => {
    await delay(LATENCY);
    const files = getDB('ev_files', []);
    const fileToDelete = files.find((f: FileItem) => f.id === fileId);
    if (!fileToDelete) return;

    setDB('ev_files', files.filter((f: FileItem) => f.id !== fileId));

    // Update chapter file count
    const chapters = getDB('ev_chapters', []);
    const updatedChapters = chapters.map((c: Chapter) => 
      c.id === fileToDelete.chapterId ? { ...c, fileCount: Math.max(0, (c.fileCount || 0) - 1) } : c
    );
    setDB('ev_chapters', updatedChapters);
  }
};
