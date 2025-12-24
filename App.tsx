
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

const App: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [recentFileIds, setRecentFileIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ev_recent_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Initial data fetch and entrance animation
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
        addNotification('Could not load workspace', 'error');
      } finally {
        setTimeout(() => setIsInitialLoading(false), 1500);
      }
    };
    init();
  }, []);

  // Sync theme with document class list
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Persist recent file IDs
  useEffect(() => {
    localStorage.setItem('ev_recent_ids', JSON.stringify(recentFileIds));
  }, [recentFileIds]);

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
      setSelectedSubject(subject);
      setCurrentView('subject');
      setIsSidebarOpen(false); // Close sidebar on mobile navigation
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
      setSelectedChapter(chapter);
      setCurrentView('chapter');
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
    try {
      const newChap = await api.createChapter({ ...data, subjectId: selectedSubject.id });
      setChapters(prev => [newChap, ...prev]);
      addNotification('Chapter added', 'success');
    } catch (err) {
      addNotification('Failed to add chapter', 'error');
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
        c.id === selectedChapter.id ? { ...c, fileCount: (c.fileCount || 0) + newFiles.length } : c
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
      return [file.id, ...filtered].slice(0, 20); // Keep last 20
    });
    addNotification(`Opening ${file.name}...`);
  };

  const handleDeleteFile = async (id: string) => {
    try {
      await api.deleteFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
      setAllFiles(prev => prev.filter(f => f.id !== id));
      addNotification('File deleted', 'success');
    } catch (err) {
      addNotification('Failed to delete file', 'error');
    }
  };

  const handleDeleteFiles = async (ids: string[]) => {
    setIsProcessing(true);
    try {
      for (const id of ids) {
        await api.deleteFile(id);
      }
      setFiles(prev => prev.filter(f => !ids.includes(f.id)));
      setAllFiles(prev => prev.filter(f => !ids.includes(f.id)));
      addNotification(`${ids.length} files deleted`, 'success');
    } catch (err) {
      addNotification('Failed to delete some files', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredSubjects = useMemo(() => {
    if (!searchQuery) return subjects;
    return subjects.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subjects, searchQuery]);

  const dummySubject: Subject = {
    id: 'meta',
    name: 'Collection',
    description: 'Your gathered materials',
    icon: 'folder_special',
    colorClass: 'bg-primary/10 text-primary',
    fileCount: 0,
    lastUpdated: 'Just now'
  };

  const dummyFavoritesChapter: Chapter = {
    id: 'favs',
    subjectId: 'meta',
    name: 'Favorites',
    chapterNumber: 0,
    icon: 'star',
    colorClass: 'bg-amber-50 text-amber-600',
    fileCount: 0,
    lastUpdated: 'Just now'
  };

  const dummyRecentChapter: Chapter = {
    id: 'recent',
    subjectId: 'meta',
    name: 'Recently Viewed',
    chapterNumber: 0,
    icon: 'schedule',
    colorClass: 'bg-blue-50 text-blue-600',
    fileCount: 0,
    lastUpdated: 'Just now'
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            subjects={filteredSubjects} 
            onSelectSubject={handleSelectSubject}
            onAddSubject={handleAddSubject}
            onDeleteSubject={async (id) => {
              if (window.confirm('Are you sure you want to delete this subject and all its materials?')) {
                setIsProcessing(true);
                try {
                  await api.deleteSubject(id);
                  setSubjects(prev => prev.filter(s => s.id !== id));
                  const updatedFiles = await api.getAllFiles();
                  setAllFiles(updatedFiles);
                  addNotification('Subject and associated data deleted', 'success');
                } catch (err) {
                  addNotification('Failed to delete subject', 'error');
                } finally {
                  setIsProcessing(false);
                }
              }
            }}
            onEditSubject={async (id, data) => {
              const updated = await api.updateSubject(id, data);
              setSubjects(prev => prev.map(s => s.id === id ? updated : s));
              addNotification('Subject updated', 'success');
            }}
          />
        );
      case 'subject':
        return selectedSubject && (
          <SubjectDetailView 
            subject={selectedSubject} 
            chapters={chapters} 
            onBack={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }}
            onSelectChapter={handleSelectChapter}
            onAddChapter={handleAddChapter}
            onDeleteChapter={async (id) => {
              if (window.confirm('Delete this chapter and its files?')) {
                setIsProcessing(true);
                try {
                  await api.deleteChapter(id);
                  setChapters(prev => prev.filter(c => c.id !== id));
                  const updatedFiles = await api.getAllFiles();
                  setAllFiles(updatedFiles);
                  addNotification('Chapter deleted', 'success');
                } finally {
                  setIsProcessing(false);
                }
              }
            }}
            onEditChapter={async (id, data) => {
              const updated = await api.updateChapter(id, data);
              setChapters(prev => prev.map(c => c.id === id ? updated : c));
              addNotification('Chapter updated', 'success');
            }}
          />
        );
      case 'chapter':
        return selectedSubject && selectedChapter && (
          <ChapterDetailView 
            viewMode={currentView}
            subject={selectedSubject} 
            chapter={selectedChapter} 
            files={files}
            onBack={() => setCurrentView('subject')}
            onToggleFavorite={handleToggleFavorite}
            onOpenFile={handleOpenFile}
            onAddFiles={handleAddFiles}
            onDeleteFile={(id) => {
              if (window.confirm('Delete this file?')) {
                handleDeleteFile(id);
              }
            }}
            onDeleteFiles={handleDeleteFiles}
          />
        );
      case 'favorites':
        return (
          <ChapterDetailView 
            viewMode="favorites"
            subject={dummySubject} 
            chapter={dummyFavoritesChapter} 
            files={allFiles.filter(f => f.isFavorite)}
            onBack={() => setCurrentView('dashboard')}
            onToggleFavorite={handleToggleFavorite}
            onOpenFile={handleOpenFile}
            onDeleteFile={(id) => {
              if (window.confirm('Delete this file?')) {
                handleDeleteFile(id);
              }
            }}
            onDeleteFiles={handleDeleteFiles}
          />
        );
      case 'recent':
        const recents = recentFileIds
          .map(id => allFiles.find(f => f.id === id))
          .filter((f): f is FileItem => !!f);
        return (
          <ChapterDetailView 
            viewMode="recent"
            subject={dummySubject} 
            chapter={dummyRecentChapter} 
            files={recents}
            onBack={() => setCurrentView('dashboard')}
            onToggleFavorite={handleToggleFavorite}
            onOpenFile={handleOpenFile}
            onDeleteFile={(id) => {
              if (window.confirm('Delete this file?')) {
                handleDeleteFile(id);
              }
            }}
            onDeleteFiles={handleDeleteFiles}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onClearData={() => {
              if (window.confirm('This will wipe all local data. Continue?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            totalFiles={allFiles.length}
          />
        );
      default:
        return null;
    }
  };

  const handleNavigation = (view: ViewState) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  if (isInitialLoading) return <LoadingView />;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#101922] overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={() => handleNavigation('dashboard')}
        onNavigateSettings={() => handleNavigation('settings')}
        onNavigateFavorites={() => handleNavigation('favorites')}
        onNavigateRecent={() => handleNavigation('recent')}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar relative">
          {renderView()}
        </main>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[300] bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default App;
