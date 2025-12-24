
export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  fileCount: number;
  lastUpdated: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  chapterNumber: number;
  icon: string;
  colorClass: string;
  fileCount: number;
  lastUpdated: string;
}

export interface Folder {
  id: string;
  chapterId: string;
  name: string;
  fileCount: number;
  size: string;
  colorClass: string;
}

export interface FileItem {
  id: string;
  folderId?: string;
  chapterId: string;
  name: string;
  type: 'pdf' | 'pptx' | 'png' | 'docx' | 'video';
  dateAdded: string;
  size: string;
  isFavorite?: boolean;
}

export interface AppNotification {
  id: string;
  text: string;
  time: string;
  type: 'success' | 'error' | 'info';
}

export type ViewState = 'dashboard' | 'subject' | 'chapter' | 'settings' | 'favorites' | 'recent';
