
import { Subject, Chapter, FileItem, Folder } from './types';

export const MOTIVATIONAL_QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "It always seems impossible until it's done. - Nelson Mandela",
  "Don't let yesterday take up too much of today. - Will Rogers",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Your talent determines what you can do. Your motivation determines how much you are willing to do. Your attitude determines how well you do it. - Lou Holtz",
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela"
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: '1', name: 'Physics 101', description: 'Mechanics & Thermodynamics', icon: 'science', colorClass: 'bg-blue-50 text-blue-600', fileCount: 24, lastUpdated: '2h ago' },
  { id: '2', name: 'World History', description: 'Modern Era & Globalization', icon: 'public', colorClass: 'bg-amber-50 text-amber-600', fileCount: 12, lastUpdated: 'yesterday' },
  { id: '3', name: 'English Literature', description: 'Shakespeare & Poetry', icon: 'menu_book', colorClass: 'bg-emerald-50 text-emerald-600', fileCount: 8, lastUpdated: 'last week' },
  { id: '4', name: 'Mathematics', description: 'Calculus & Algebra', icon: 'calculate', colorClass: 'bg-purple-50 text-purple-600', fileCount: 5, lastUpdated: 'Created today' },
];

export const MOCK_CHAPTERS: Chapter[] = [
  { id: 'c1', subjectId: '4', name: 'Limits & Continuity', chapterNumber: 1, icon: 'functions', colorClass: 'bg-blue-50 text-blue-600', fileCount: 5, lastUpdated: '2h ago' },
  { id: 'c2', subjectId: '4', name: 'Differentiation', chapterNumber: 2, icon: 'show_chart', colorClass: 'bg-emerald-50 text-emerald-600', fileCount: 0, lastUpdated: 'Yesterday' },
];

export const MOCK_FOLDERS: Folder[] = [
  { id: 'f1', chapterId: 'c1', name: 'Lecture Notes', fileCount: 12, size: '24MB', colorClass: 'text-primary' },
  { id: 'f2', chapterId: 'c1', name: 'Assignments', fileCount: 4, size: '1.2MB', colorClass: 'text-indigo-500' },
  { id: 'f3', chapterId: 'c1', name: 'Lab Reports', fileCount: 8, size: '15MB', colorClass: 'text-emerald-500' },
];

export const MOCK_FILES: FileItem[] = [
  { id: 'file1', chapterId: 'c1', name: 'Limits_and_Derivatives_Homework.pdf', type: 'pdf', dateAdded: 'Oct 24, 2023', size: '2.4 MB', isFavorite: false },
  { id: 'file2', chapterId: 'c1', name: 'Continuity_Proofs.pdf', type: 'pdf', dateAdded: 'Oct 23, 2023', size: '1.1 MB', isFavorite: true },
  { id: 'file3', chapterId: 'c1', name: 'Graph_Visuals.png', type: 'png', dateAdded: 'Oct 22, 2023', size: '3.2 MB', isFavorite: false },
];

export const LIFESTYLE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBPrqRAjBNdrPTTRPG5H9Qo-qPdVQVig5Tbi0XF_R-HJ5aENaOiGLfM9OdMyC18Eh15623BkBhwdg87AJs6Tn96pqXkGFJ6PpwIOxOUwWVJpTRyot78dCixK8POqbjzIeRNzcQ2uD2bMgT8rlOJfEtWL_FTlYW0FIKoGnB9-Rjc_q_8tWD8Yd4YoAimQLYm1rQ5ieLEigWlCmSVgJ4pOlb3GBUkvJiDSyiBIhWNiYqBRrpubSVw2Ca9ywPfXBL9_5Ym8ln7M_-1lvk";
export const USER_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCbMZKQH4_JSUmPG3M9HEoKxEcM5vxQ_v9nAR6n8iiqdcQlgJ2FdiG36-20uV7kafVMnUo9KJ9-EAHYWX7UrO1SB1gZg3fmjU_y9YvwrFCCrJi_RsKy7epcddEibJk3GM81pMaH4Z9C20o8wg9eR5H7qBWdM1tUK0NFzEJREwUPsyA7MVeWNTrDwbYauQ8vVQex5zf1rar_lxxKAMz3nVth6BmsMTannIHhE6QKijxe6-Ue0jpF1LEiu5JrNDBOMJMBga0gX14DnME";
