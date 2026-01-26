
import React, { useState, useMemo } from 'react';
import { Subject, Chapter, FileItem, ViewState } from '../types';
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
  onAddFiles?: (files: File[]) => void;
  onDeleteFile?: (id: string) => void;
  onDeleteFiles?: (ids: string[]) => void;
  onRenameFile?: (id: string) => void;
}

type FileTypeFilter = 'all' | 'pdf' | 'pptx' | 'png' | 'docx' | 'video';

interface AISummaryResult {
  summary: string[];
  studyTip: string;
  confidenceScore: number;
}

const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({ 
  viewMode, subject, chapter, files, onBack, onToggleFavorite, onOpenFile, onAddFiles, onDeleteFile, onDeleteFiles, onRenameFile
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<AISummaryResult | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleAiSummarize = async () => {
    setIsSummarizing(true);
    try {
      const result = await summarizeChapter(chapter.name, files.map(f => f.name));
      if (result) {
        setAiSummary(result);
      }
    } catch (err) {
      console.error("Error generating summary", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const isMetaView = viewMode === 'favorites' || viewMode === 'recent';

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf': return 'picture_as_pdf';
      case 'pptx': return 'slideshow';
      case 'png': return 'image';
      case 'docx': return 'description';
      case 'video': return 'movie';
      default: return 'insert_drive_file';
    }
  };

  const getIconColor = (type: string) => {
    switch(type) {
      case 'pdf': return 'bg-red-50 text-red-600 dark:text-red-400';
      case 'pptx': return 'bg-orange-50 text-orange-600 dark:text-orange-400';
      case 'png': return 'bg-blue-50 text-blue-600 dark:text-blue-400';
      case 'docx': return 'bg-indigo-50 text-indigo-600 dark:text-indigo-400';
      case 'video': return 'bg-purple-50 text-purple-600 dark:text-purple-400';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const filteredFiles = useMemo(() => {
    let list = files;
    if (typeFilter !== 'all') {
      list = files.filter(f => f.type === typeFilter);
    }
    return list;
  }, [files, typeFilter]);

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredFiles.map(f => f.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected file(s) permanently?`)) {
      if (onDeleteFiles) {
        onDeleteFiles(Array.from(selectedIds));
      } else if (onDeleteFile) {
        selectedIds.forEach(id => onDeleteFile(id));
      }
      setSelectedIds(new Set());
    }
  };

  const filterChips: { label: string; value: FileTypeFilter; icon: string }[] = [
    { label: 'All', value: 'all', icon: 'inventory' },
    { label: 'PDFs', value: 'pdf', icon: 'picture_as_pdf' },
    { label: 'Slides', value: 'pptx', icon: 'slideshow' },
    { label: 'Images', value: 'png', icon: 'image' },
    { label: 'Docs', value: 'docx', icon: 'description' },
    { label: 'Videos', value: 'video', icon: 'movie' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        subjectName={subject.name}
        chapterName={chapter.name}
        chapterId={chapter.id}
        onUpload={() => setIsUploadOpen(false)}
        onAddFiles={(files) => {
          if (onAddFiles) onAddFiles(files);
          setIsUploadOpen(false);
        }}
      />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-base">dashboard</span>
              Dashboard
            </button>
          </li>
          <li aria-hidden="true" className="text-slate-300 material-symbols-outlined text-[16px]">chevron_right</li>
          {!isMetaView && (
            <>
              <li>
                <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium truncate max-w-[100px] sm:max-w-none">{subject.name}</button>
              </li>
              <li aria-hidden="true" className="text-slate-300 material-symbols-outlined text-[16px]">chevron_right</li>
            </>
          )}
          <li>
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[120px] sm:max-w-none" aria-current="page">{chapter.name}</span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className={`size-10 md:size-12 rounded-xl flex items-center justify-center flex-shrink-0 ${viewMode === 'favorites' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`} aria-hidden="true">
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '24px' }}>
                {viewMode === 'favorites' ? 'star' : viewMode === 'recent' ? 'schedule' : 'folder_open'}
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-slate-900 dark:text-white text-xl md:text-3xl font-bold tracking-tight truncate">
                {isMetaView ? chapter.name : `${chapter.name}`}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-0.5 truncate font-medium">
                {isMetaView ? `${files.length} items collected` : `Chapter ${chapter.chapterNumber} • ${files.length} files`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {selectedIds.size > 0 && (
            <button 
              onClick={handleBulkDelete}
              aria-label={`Delete ${selectedIds.size} selected files`}
              className="flex-1 sm:flex-none flex items-center justify-center h-10 px-4 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 text-[13px] font-bold shadow-sm transition-colors gap-2 focus:ring-2 focus:ring-red-500 focus:outline-none border border-red-200 dark:border-red-900/40"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">delete_sweep</span>
              <span>Delete ({selectedIds.size})</span>
            </button>
          )}
          {!isMetaView && (
            <button 
              onClick={handleAiSummarize}
              disabled={isSummarizing || files.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold shadow-sm transition-colors gap-2 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined ${isSummarizing ? 'animate-spin' : ''}`} style={{ fontSize: '18px' }}>
                {aiSummary ? 'refresh' : 'psychology'}
              </span>
              <span>{isSummarizing ? 'Thinking...' : (aiSummary ? 'Regenerate' : 'AI Summary')}</span>
            </button>
          )}
          {!isMetaView && (
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center h-10 px-4 rounded-xl bg-primary hover:bg-blue-600 text-white text-[13px] font-bold shadow-sm transition-colors gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
              <span>Upload</span>
            </button>
          )}
        </div>
      </div>

      {aiSummary && (
        <section className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-emerald-900 dark:text-emerald-400 font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-[10px]">
               <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
               AI Contextual Summary
            </h3>
            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-500 uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
              {aiSummary.confidenceScore}% Confidence
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-emerald-900 dark:text-emerald-300 font-bold text-[9px] uppercase tracking-[0.2em] mb-3">Key Topics</p>
              <ul className="space-y-1.5">
                {aiSummary.summary.map((item, idx) => (
                  <li key={idx} className="text-[13px] text-emerald-800 dark:text-emerald-400 flex items-start gap-2 leading-relaxed">
                    <span className="mt-1.5 size-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:border-l border-emerald-100 dark:border-emerald-800/50 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
              <p className="text-emerald-900 dark:text-emerald-300 font-bold text-[9px] uppercase tracking-[0.2em] mb-3">Study Strategy</p>
              <p className="text-[13px] text-emerald-800 dark:text-emerald-400 leading-relaxed italic font-medium">"{aiSummary.studyTip}"</p>
            </div>
          </div>
        </section>
      )}

      <section className="flex-1 flex flex-col gap-4 mt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[10px]">
            {viewMode === 'recent' ? 'Recently Viewed' : viewMode === 'favorites' ? 'Starred Collection' : 'Materials List'}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto -mx-1 px-1 sm:mx-0 sm:px-0 scrollbar-none">
            {filterChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setTypeFilter(chip.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border whitespace-nowrap ${
                  typeFilter === chip.value
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white dark:bg-[#1a2632] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                }`}
              >
                <span className={`material-symbols-outlined text-[14px] ${typeFilter === chip.value ? 'icon-filled' : ''}`}>
                  {chip.icon}
                </span>
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <span className="material-symbols-outlined text-5xl mb-3 opacity-20">inventory_2</span>
            <p className="font-bold text-slate-600 dark:text-slate-300">No materials found</p>
            <p className="text-xs mt-1">Try changing the filter or upload new files.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="py-4 px-4 w-12">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="size-4 rounded border-slate-300 text-primary focus:ring-primary dark:bg-slate-900 dark:border-slate-700 cursor-pointer"
                          checked={selectedIds.size === filteredFiles.length && filteredFiles.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th className="py-4 px-4 font-black text-[9px] text-slate-400 uppercase tracking-[0.2em] w-[45%]">File Name</th>
                    <th className="py-4 px-4 font-black text-[9px] text-slate-400 uppercase tracking-[0.2em] hidden sm:table-cell">Date Added</th>
                    <th className="py-4 px-4 font-black text-[9px] text-slate-400 uppercase tracking-[0.2em] hidden md:table-cell text-right">Size</th>
                    <th className="py-4 px-4 font-black text-[9px] text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredFiles.map((file) => (
                    <tr 
                      key={file.id} 
                      onClick={() => onOpenFile(file)}
                      className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${selectedIds.has(file.id) ? 'bg-blue-50/50 dark:bg-primary/5' : ''}`}
                    >
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="size-4 rounded border-slate-300 text-primary focus:ring-primary dark:bg-slate-900 dark:border-slate-700 cursor-pointer"
                            checked={selectedIds.has(file.id)}
                            onChange={() => {}} 
                            onClick={(e) => toggleSelectOne(file.id, e)}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(file.type)} border border-current/10 shadow-sm`}>
                            <span className="material-symbols-outlined text-[20px] icon-filled">
                              {getFileIcon(file.type)}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{file.name}</span>
                            <span className="text-[10px] text-slate-500 font-bold sm:hidden uppercase tracking-wider">{file.size} • {file.dateAdded}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:table-cell uppercase tracking-wider">{file.dateAdded}</td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-500 dark:text-slate-400 hidden md:table-cell text-right uppercase tracking-wider">{file.size}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={file.url}
                            download={file.name}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            title="Download original file"
                          >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                          </a>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onToggleFavorite(file.id); }}
                            className={`p-2.5 rounded-xl transition-all ${file.isFavorite ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10'}`}
                            title={file.isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <span className={`material-symbols-outlined text-[18px] ${file.isFavorite ? 'icon-filled' : ''}`}>star</span>
                          </button>
                          {onDeleteFile && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDeleteFile(file.id); }}
                              className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                              title="Delete file permanently"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
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
