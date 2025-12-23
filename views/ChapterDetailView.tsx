
import React, { useState, useMemo } from 'react';
import { Subject, Chapter, FileItem, ViewState } from '../types';
import { MOCK_FOLDERS } from '../constants';
import UploadModal from '../components/UploadModal';
import { summarizeChapter } from '../geminiService';

interface ChapterDetailViewProps {
  viewMode: ViewState;
  subject: Subject;
  chapter: Chapter;
  files: FileItem[];
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenFile: (file: FileItem) => void;
  onAddFile?: (file: FileItem) => void;
  onDeleteFile?: (id: string) => void;
  onRenameFile?: (id: string) => void;
}

type FileTypeFilter = 'all' | 'pdf' | 'pptx' | 'png' | 'docx';

const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({ 
  viewMode, subject, chapter, files, onBack, onToggleFavorite, onOpenFile, onAddFile, onDeleteFile, onRenameFile
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<{ summary: string[], studyTip: string } | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>('all');

  const handleAiSummarize = async () => {
    setIsSummarizing(true);
    const result = await summarizeChapter(chapter.name, files.map(f => f.name));
    setAiSummary(result);
    setIsSummarizing(false);
  };

  const isMetaView = viewMode === 'favorites' || viewMode === 'recent';

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf': return 'picture_as_pdf';
      case 'pptx': return 'slideshow';
      case 'png': return 'image';
      case 'docx': return 'description';
      default: return 'insert_drive_file';
    }
  };

  const getIconColor = (type: string) => {
    switch(type) {
      case 'pdf': return 'bg-red-50 text-red-500';
      case 'pptx': return 'bg-orange-50 text-orange-500';
      case 'png': return 'bg-blue-50 text-blue-500';
      case 'docx': return 'bg-indigo-50 text-indigo-500';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const filteredFiles = useMemo(() => {
    if (typeFilter === 'all') return files;
    return files.filter(f => f.type === typeFilter);
  }, [files, typeFilter]);

  const filterChips: { label: string; value: FileTypeFilter; icon: string }[] = [
    { label: 'All Files', value: 'all', icon: 'inventory' },
    { label: 'PDFs', value: 'pdf', icon: 'picture_as_pdf' },
    { label: 'Slides', value: 'pptx', icon: 'slideshow' },
    { label: 'Images', value: 'png', icon: 'image' },
    { label: 'Documents', value: 'docx', icon: 'description' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        subjectName={subject.name}
        chapterName={chapter.name}
        chapterId={chapter.id}
        onUpload={(newFile) => {
            if (onAddFile) onAddFile(newFile);
            setIsUploadOpen(false);
        }}
      />

      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium">Dashboard</button>
        <span className="text-slate-300 material-symbols-outlined text-[16px]">chevron_right</span>
        {!isMetaView && (
          <>
            <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium">{subject.name}</button>
            <span className="text-slate-300 material-symbols-outlined text-[16px]">chevron_right</span>
          </>
        )}
        <span className="text-slate-900 dark:text-white font-semibold">{chapter.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className={`size-12 rounded-xl flex items-center justify-center ${viewMode === 'favorites' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '28px' }}>
                {viewMode === 'favorites' ? 'star' : viewMode === 'recent' ? 'schedule' : 'folder_open'}
              </span>
            </div>
            <div>
              <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
                {isMetaView ? chapter.name : `Chapter ${chapter.chapterNumber}: ${chapter.name}`}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {isMetaView ? `${files.length} items in your collection` : `Managed in ${subject.name} • Last updated ${chapter.lastUpdated}`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isMetaView && (
            <button 
              onClick={handleAiSummarize}
              disabled={isSummarizing || files.length === 0}
              className="flex items-center justify-center h-10 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm transition-colors gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>psychology</span>
              <span>{isSummarizing ? 'Analyzing...' : 'AI Summary'}</span>
            </button>
          )}
          {!isMetaView && (
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center justify-center h-10 px-4 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-semibold shadow-sm transition-colors gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>upload_file</span>
              <span>Upload File</span>
            </button>
          )}
        </div>
      </div>

      {aiSummary && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-emerald-800 dark:text-emerald-400 font-bold mb-3 flex items-center gap-2">
             <span className="material-symbols-outlined">auto_awesome</span>
             Gemini AI Insight
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm mb-2">Key Topics:</p>
              <ul className="space-y-1">
                {aiSummary.summary.map((item, idx) => (
                  <li key={idx} className="text-sm text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l border-emerald-100 dark:border-emerald-800/50 pl-6">
              <p className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm mb-2">Study Strategy:</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 leading-relaxed italic">"{aiSummary.studyTip}"</p>
            </div>
          </div>
        </div>
      )}

      {!isMetaView && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Folders</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_FOLDERS.map((folder) => (
              <a key={folder.id} className="group flex flex-col gap-3 p-4 bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-200" href="#">
                <div className="flex justify-between items-start">
                  <span className={`material-symbols-outlined icon-filled text-4xl group-hover:scale-110 transition-transform ${folder.colorClass}`}>folder</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{folder.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{folder.fileCount} files • {folder.size}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {viewMode === 'recent' ? 'Last Viewed' : viewMode === 'favorites' ? 'Starred Materials' : 'Files'}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setTypeFilter(chip.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  typeFilter === chip.value
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white dark:bg-[#1a2632] border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary/50'
                }`}
              >
                <span className={`material-symbols-outlined text-[16px] ${typeFilter === chip.value ? 'icon-filled' : ''}`}>
                  {chip.icon}
                </span>
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="material-symbols-outlined text-4xl mb-2">filter_alt_off</span>
            <p className="font-medium">No {typeFilter !== 'all' ? typeFilter.toUpperCase() : ''} files found.</p>
            <p className="text-sm">Try changing your filter or search query.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="py-3 px-4 font-medium text-xs text-slate-500 uppercase tracking-wider w-[45%]">Name</th>
                    <th className="py-3 px-4 font-medium text-xs text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date Added</th>
                    <th className="py-3 px-4 font-medium text-xs text-slate-500 uppercase tracking-wider hidden md:table-cell text-right">Size</th>
                    <th className="py-3 px-4 font-medium text-xs text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredFiles.map((file) => (
                    <tr 
                      key={file.id} 
                      onClick={() => onOpenFile(file)}
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(file.type)}`}>
                            <span className="material-symbols-outlined icon-filled">
                              {getFileIcon(file.type)}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{file.name}</span>
                            <span className="text-xs text-slate-500 sm:hidden">{file.dateAdded} • {file.size}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500 hidden sm:table-cell">{file.dateAdded}</td>
                      <td className="py-3 px-4 text-sm text-slate-500 hidden md:table-cell text-right">{file.size}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onToggleFavorite(file.id); }}
                            className={`p-2 rounded-full transition-colors ${file.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}
                            title="Favorite"
                          >
                            <span className={`material-symbols-outlined text-[20px] ${file.isFavorite ? 'icon-filled' : ''}`}>star</span>
                          </button>
                          {onRenameFile && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); onRenameFile(file.id); }}
                              className="p-2 rounded-full text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                              title="Rename"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                          )}
                          {onDeleteFile && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }}
                              className="p-2 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChapterDetailView;
