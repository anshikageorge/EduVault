
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ViewState, Subject, Chapter, FileItem, AppNotification } from './types';
import { MOCK_SUBJECTS, MOCK_CHAPTERS, MOCK_FILES } from './constants';
import DashboardView from './views/DashboardView';
import SubjectDetailView from './views/SubjectDetailView';
import ChapterDetailView from './views/ChapterDetailView';
import SettingsView from './views/SettingsView';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoadingView from './components/LoadingView';

const App: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('ev_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Persistent State
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('ev_subjects');
    return saved ? JSON.parse(saved) : MOCK_SUBJECTS;
  });
  
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('ev_chapters');
    return saved ? JSON.parse(saved) : MOCK_CHAPTERS;
  });
  
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('ev_files');
    return saved ? JSON.parse(saved) : MOCK_FILES;
  });

  const [recentFiles, setRecentFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('ev_recent');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('ev_theme') === 'dark';
  });

  // Initial Loading Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Sync with Local Storage
  useEffect(() => localStorage.setItem('ev_subjects', JSON.stringify(subjects)), [subjects]);
  useEffect(() => localStorage.setItem('ev_chapters', JSON.stringify(chapters)), [chapters]);
  useEffect(() => localStorage.setItem('ev_files', JSON.stringify(files)), [files]);
  useEffect(() => localStorage.setItem('ev_recent', JSON.stringify(recentFiles)), [recentFiles]);
  useEffect(() => localStorage.setItem('ev_notifications', JSON.stringify(notifications)), [notifications]);
  useEffect(() => {
    localStorage.setItem('ev_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const addNotification = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const navigateToDashboard = useCallback(() => {
    setCurrentView('dashboard');
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSearchQuery('');
  }, []);

  const navigateToSubject = useCallback((subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView('subject');
    setSelectedChapter(null);
    setSearchQuery('');
  }, []);

  const navigateToChapter = useCallback((chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('chapter');
    setSearchQuery('');
  }, []);

  const navigateToSettings = useCallback(() => setCurrentView('settings'), []);
  const navigateToFavorites = useCallback(() => setCurrentView('favorites'), []);
  const navigateToRecent = useCallback(() => setCurrentView('recent'), []);

  // CRUD Handlers
  const handleAddSubject = (newSub: Subject) => {
    setSubjects(prev => [newSub, ...prev]);
    addNotification(`Subject "${newSub.name}" created.`, 'success');
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm("Delete this subject and all its contents?")) {
      setSubjects(prev => prev.filter(s => s.id !== id));
      setChapters(prev => prev.filter(c => c.subjectId !== id));
      const removedChapters = chapters.filter(c => c.subjectId === id).map(c => c.id);
      setFiles(prev => prev.filter(f => !removedChapters.includes(f.chapterId)));
      addNotification("Subject deleted.", 'info');
      navigateToDashboard();
    }
  };

  const handleEditSubject = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    if (!subject) return;
    const newName = prompt("Edit Subject Name:", subject.name);
    if (newName && newName !== subject.name) {
      setSubjects(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
      addNotification("Subject renamed.", 'success');
    }
  };

  const handleAddChapter = (newChap: Chapter) => {
    setChapters(prev => [newChap, ...prev]);
    addNotification(`Chapter "${newChap.name}" created.`, 'success');
  };

  const handleDeleteChapter = (id: string) => {
    if (window.confirm("Delete this chapter and all its files?")) {
      setChapters(prev => prev.filter(c => c.id !== id));
      setFiles(prev => prev.filter(f => f.chapterId !== id));
      addNotification("Chapter deleted.", 'info');
      if (selectedSubject) navigateToSubject(selectedSubject);
    }
  };

  const handleEditChapter = (id: string) => {
    const chapter = chapters.find(c => c.id === id);
    if (!chapter) return;
    const newName = prompt("Edit Chapter Name:", chapter.name);
    if (newName && newName !== chapter.name) {
      setChapters(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
      addNotification("Chapter renamed.", 'success');
    }
  };

  const handleAddFile = (newFile: FileItem) => {
    setFiles(prev => [newFile, ...prev]);
    addNotification(`"${newFile.name}" uploaded successfully!`, 'success');
    setChapters(prev => prev.map(c => c.id === newFile.chapterId ? { ...c, fileCount: c.fileCount + 1, lastUpdated: 'Just now' } : c));
  };

  const handleDeleteFile = (id: string) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      const file = files.find(f => f.id === id);
      if (file) {
        setFiles(prev => prev.filter(f => f.id !== id));
        setRecentFiles(prev => prev.filter(f => f.id !== id));
        setChapters(prev => prev.map(c => c.id === file.chapterId ? { ...c, fileCount: Math.max(0, c.fileCount - 1) } : c));
        addNotification(`"${file.name}" deleted.`, 'info');
      }
    }
  };

  const handleRenameFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    const currentName = file.name.split('.').slice(0, -1).join('.');
    const ext = file.name.split('.').pop();
    const newBaseName = prompt("Enter new file name:", currentName);
    if (newBaseName && newBaseName !== currentName) {
      const newFullName = `${newBaseName}.${ext}`;
      setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newFullName } : f));
      addNotification(`File renamed to "${newFullName}".`, 'success');
    }
  };

  const handleToggleFavorite = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  const handleOpenFile = (file: FileItem) => {
    setRecentFiles(prev => {
      const filtered = prev.filter(f => f.id !== file.id);
      return [file, ...filtered].slice(0, 8);
    });
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      setSubjects(MOCK_SUBJECTS);
      setChapters(MOCK_CHAPTERS);
      setFiles(MOCK_FILES);
      setRecentFiles([]);
      setNotifications([]);
      navigateToDashboard();
    }
  };

  // Filtered lists for views
  const filteredSubjects = useMemo(() => {
    if (!searchQuery) return subjects;
    return subjects.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subjects, searchQuery]);

  const filteredChapters = useMemo(() => {
    if (!selectedSubject) return [];
    const subjectChapters = chapters.filter(c => c.subjectId === selectedSubject.id);
    if (!searchQuery) return subjectChapters;
    return subjectChapters.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chapters, selectedSubject, searchQuery]);

  const getFilteredFiles = useCallback((baseFiles: FileItem[]) => {
    if (!searchQuery) return baseFiles;
    const lowerQuery = searchQuery.toLowerCase();
    return baseFiles.filter(f => f.name.toLowerCase().includes(lowerQuery));
  }, [searchQuery]);

  if (isInitialLoading) {
    return <LoadingView />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      <Sidebar 
        currentView={currentView} 
        onNavigate={navigateToDashboard} 
        onNavigateSettings={navigateToSettings}
        onNavigateFavorites={navigateToFavorites}
        onNavigateRecent={navigateToRecent}
      />
      
      <div className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <Navbar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onClearNotifications={clearNotifications}
        />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          {currentView === 'dashboard' && (
            <DashboardView 
              subjects={filteredSubjects}
              onSelectSubject={navigateToSubject} 
              onAddSubject={handleAddSubject}
              onDeleteSubject={handleDeleteSubject}
              onEditSubject={handleEditSubject}
            />
          )}
          
          {currentView === 'subject' && selectedSubject && (
            <SubjectDetailView 
              subject={selectedSubject} 
              chapters={filteredChapters}
              onBack={navigateToDashboard} 
              onSelectChapter={navigateToChapter}
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
              onEditChapter={handleEditChapter}
            />
          )}
          
          {(currentView === 'chapter' || currentView === 'favorites' || currentView === 'recent') && (
            <ChapterDetailView 
              viewMode={currentView}
              subject={selectedSubject || { name: 'Library', id: 'lib' } as Subject}
              chapter={selectedChapter || { name: currentView === 'favorites' ? 'My Favorites' : 'Recent Files', id: 'meta', chapterNumber: 0 } as Chapter}
              files={getFilteredFiles(
                currentView === 'favorites' ? files.filter(f => f.isFavorite) :
                currentView === 'recent' ? recentFiles :
                files.filter(f => f.chapterId === selectedChapter?.id)
              )}
              onBack={navigateToDashboard}
              onToggleFavorite={handleToggleFavorite}
              onOpenFile={handleOpenFile}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView 
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              onClearData={handleClearData}
              totalFiles={files.length}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
