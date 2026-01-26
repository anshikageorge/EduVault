
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ViewState, Subject, Chapter, FileItem, AppNotification } from './types';
import { api } from './apiService';
import DashboardView from './views/DashboardView';
import SubjectDetailView from './views/SubjectDetailView';
import ChapterDetailView from './views/ChapterDetailView';
import SettingsView from './views/SettingsView';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoadingView from './components/LoadingView';
import FileViewerModal from './components/FileViewerModal';

interface NavState {
  view: ViewState;
  subject: Subject | null;
  chapter: Chapter | null;
}

const App: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);
  
  // Content State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  
  // History Management
  const [history, setHistory] = useState<NavState[]>([{ view: 'dashboard', subject: null, chapter: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Recent files now stored temporarily in memory (cleared on refresh) with a limit of 5
  const [recentFileIds, setRecentFileIds] = useState<string[]>([]);

  // Unified Navigation Function
  const navigateTo = useCallback((view: ViewState, subject: Subject | null = null, chapter: Chapter | null = null, isFromHistory = false) => {
    setCurrentView(view);
    setSelectedSubject(subject);
    setSelectedChapter(chapter);
    setIsSidebarOpen(false);

    if (!isFromHistory) {
      const newEntry: NavState = { view, subject, chapter };
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, newEntry]);
      setHistoryIndex(newHistory.length);
    }
  }, [history, historyIndex]);

  const goBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      navigateTo(prev.view, prev.subject, prev.chapter, true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      navigateTo(next.view, next.subject, next.chapter, true);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const init = async () => {
      try {
        const [subList, fileList] = await Promise.all([
          api.getSubjects(),
          api.getAllFiles()
        ]);
        setSubjects(subList);
        setAllFiles(fileList);
      } catch (err) {
        console.error("Initialization error", err);
      }
    };
    
    init();

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const addNotification = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      time: 'Just now',
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleSelectSubject = async (subject: Subject) => {
    setIsProcessing(true);
    try {
      const chapterList = await api.getChapters(subject.id);
      setChapters(chapterList);
      navigateTo('subject', subject);
    } catch (err) {
      addNotification('Failed to load chapters', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectChapter = async (chapter: Chapter) => {
    setIsProcessing(true);
    try {
      const fileList = await api.getFiles(chapter.id);
      setFiles(fileList);
      navigateTo('chapter', selectedSubject, chapter);
    } catch (err) {
      addNotification('Failed to load files', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSubject = async (data: { name: string; description: string }) => {
    try {
      const newSub = await api.createSubject(data);
      setSubjects(prev => [newSub, ...prev]);
      addNotification('Subject created successfully', 'success');
    } catch (err) {
      addNotification('Failed to create subject', 'error');
    }
  };

  const handleAddChapter = async (data: { name: string; chapterNumber: number }) => {
    if (!selectedSubject) return;
    setIsProcessing(true);
    try {
      const newChap = await api.createChapter({ ...data, subjectId: selectedSubject.id });
      setChapters(prev => [...prev, newChap]);
      addNotification('Chapter added', 'success');
    } catch (err) {
      addNotification('Failed to add chapter', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddFiles = async (newFiles: File[]) => {
    if (!selectedChapter) return;
    setIsProcessing(true);
    try {
      const uploadedFiles: FileItem[] = [];
      for (const file of newFiles) {
        const uploadedFile = await api.uploadFile(selectedChapter.id, file);
        uploadedFiles.push(uploadedFile);
      }
      setFiles(prev => [...uploadedFiles, ...prev]);
      setAllFiles(prev => [...uploadedFiles, ...prev]);
      addNotification(`${newFiles.length} file(s) uploaded`, 'success');
      
      setChapters(prev => prev.map(c => 
        c.id === selectedChapter.id 
          ? { ...c, fileCount: (c.fileCount || 0) + newFiles.length, lastUpdated: 'Just now' } 
          : c
      ));
    } catch (err) {
      addNotification('Failed to upload files', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const file = allFiles.find(f => f.id === id);
    if (!file) return;
    try {
      const updated = await api.updateFile(id, { isFavorite: !file.isFavorite });
      setFiles(prev => prev.map(f => f.id === id ? updated : f));
      setAllFiles(prev => prev.map(f => f.id === id ? updated : f));
    } catch (err) {
      addNotification('Action failed', 'error');
    }
  };

  const handleOpenFile = (file: FileItem) => {
    setRecentFileIds(prev => {
      const filtered = prev.filter(id => id !== file.id);
      // Maintained only the last 5 files opened in FIFO memory
      return [file.id, ...filtered].slice(0, 5);
    });
    setViewingFile(file);
  };

  const handleDeleteFile = async (id: string) => {
    const fileToDelete = allFiles.find(f => f.id === id);
    if (!fileToDelete) return;

    setIsProcessing(true);
    try {
      await api.deleteFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
      setAllFiles(prev => prev.filter(f => f.id !== id));
      setChapters(prev => prev.map(c => 
        c.id === fileToDelete.chapterId 
          ? { ...c, fileCount: Math.max(0, (c.fileCount || 0) - 1) } 
          : c
      ));
      addNotification('Material deleted', 'success');
    } catch (err) {
      console.error("Delete error", err);
      addNotification('Failed to delete material', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteFiles = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;

    setIsProcessing(true);
    try {
      await api.deleteFiles(ids);
      
      const affectedFiles = allFiles.filter(f => ids.includes(f.id));
      const reductionMap: Record<string, number> = {};
      affectedFiles.forEach(f => {
        reductionMap[f.chapterId] = (reductionMap[f.chapterId] || 0) + 1;
      });

      setFiles(prev => prev.filter(f => !ids.includes(f.id)));
      setAllFiles(prev => prev.filter(f => !ids.includes(f.id)));
      
      setChapters(prev => prev.map(c => {
        const reduction = reductionMap[c.id] || 0;
        return reduction > 0 ? { ...c, fileCount: Math.max(0, (c.fileCount || 0) - reduction) } : c;
      }));

      addNotification(`${ids.length} materials deleted`, 'success');
    } catch (err) {
      console.error("Bulk delete error", err);
      addNotification('Failed to delete materials', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRenameFile = async (id: string) => {
    const file = allFiles.find(f => f.id === id);
    if (!file) return;
    const newName = window.prompt('Enter new file name:', file.name);
    if (newName && newName !== file.name) {
      try {
        const updated = await api.updateFile(id, { name: newName });
        setFiles(prev => prev.map(f => f.id === id ? updated : f));
        setAllFiles(prev => prev.map(f => f.id === id ? updated : f));
        addNotification('File renamed');
      } catch (err) {
        addNotification('Failed to rename', 'error');
      }
    }
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subjects, searchQuery]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            subjects={filteredSubjects}
            onSelectSubject={handleSelectSubject}
            onAddSubject={handleAddSubject}
            onDeleteSubject={async (id) => {
              await api.deleteSubject(id);
              setSubjects(prev => prev.filter(s => s.id !== id));
              addNotification('Subject deleted');
            }}
            onEditSubject={async (id, data) => {
              const updated = await api.updateSubject(id, data);
              setSubjects(prev => prev.map(s => s.id === id ? updated : s));
              addNotification('Subject updated');
            }}
          />
        );
      case 'subject':
        return selectedSubject && (
          <SubjectDetailView 
            subject={selectedSubject}
            chapters={chapters}
            onBack={() => navigateTo('dashboard')}
            onSelectChapter={handleSelectChapter}
            onAddChapter={handleAddChapter}
            onDeleteChapter={async (id) => {
              await api.deleteChapter(id);
              setChapters(prev => prev.filter(c => c.id !== id));
              addNotification('Chapter deleted');
            }}
            onEditChapter={async (id, data) => {
              const updated = await api.updateChapter(id, data);
              setChapters(prev => prev.map(c => c.id === id ? updated : c));
              addNotification('Chapter updated');
            }}
          />
        );
      case 'chapter':
        const filteredChapterFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return selectedSubject && selectedChapter && (
          <ChapterDetailView 
            viewMode="chapter"
            subject={selectedSubject}
            chapter={selectedChapter}
            files={filteredChapterFiles}
            onBack={() => navigateTo('subject', selectedSubject)}
            onToggleFavorite={handleToggleFavorite}
            onOpenFile={handleOpenFile}
            onAddFiles={handleAddFiles}
            onDeleteFile={handleDeleteFile}
            onDeleteFiles={handleDeleteFiles}
            onRenameFile={handleRenameFile}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onClearData={() => {
              if (window.confirm('Are you sure you want to clear all data?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            totalFiles={allFiles.length}
          />
        );
      case 'favorites':
      case 'recent':
        const metaFiles = (currentView === 'favorites' 
          ? allFiles.filter(f => f.isFavorite)
          : allFiles.filter(f => recentFileIds.includes(f.id)).sort((a,b) => recentFileIds.indexOf(a.id) - recentFileIds.indexOf(b.id))
        ).filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

        return (
          <ChapterDetailView 
            viewMode={currentView}
            subject={{ id: 'meta', name: 'Curriculum', description: '', icon: '', colorClass: '', fileCount: 0, lastUpdated: '' }}
            chapter={{ 
              id: 'meta', 
              subjectId: 'meta', 
              name: currentView === 'favorites' ? 'Starred Materials' : 'Recent Activity', 
              chapterNumber: 0, 
              icon: currentView === 'favorites' ? 'star' : 'schedule', 
              colorClass: '', 
              fileCount: metaFiles.length, 
              lastUpdated: '' 
            }}
            files={metaFiles}
            onBack={() => navigateTo('dashboard')}
            onToggleFavorite={handleToggleFavorite}
            onOpenFile={handleOpenFile}
            onDeleteFile={handleDeleteFile}
            onDeleteFiles={handleDeleteFiles}
            onRenameFile={handleRenameFile}
          />
        );
      default:
        return null;
    }
  };

  if (isInitialLoading) return <LoadingView />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#101922] transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={() => navigateTo('dashboard')}
        onNavigateSettings={() => navigateTo('settings')}
        onNavigateFavorites={() => navigateTo('favorites')}
        onNavigateRecent={() => navigateTo('recent')}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onGoBack={goBack}
          onGoForward={goForward}
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < history.length - 1}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderView()}
        </main>
      </div>
      <FileViewerModal 
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />
      {isProcessing && (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white dark:bg-[#1a2632] p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
