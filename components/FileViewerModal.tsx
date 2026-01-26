
import React from 'react';
import { FileItem } from '../types';

interface FileViewerModalProps {
  file: FileItem | null;
  onClose: () => void;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ file, onClose }) => {
  if (!file) return null;

  const renderContent = () => {
    switch (file.type) {
      case 'pdf':
        return (
          <iframe
            src={file.url || `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + '/placeholder.pdf')}&embedded=true`}
            className="w-full h-full rounded-xl border-none bg-white"
            title={file.name}
          />
        );
      case 'pptx':
      case 'docx':
        // Using Google Docs viewer as a fallback for office docs if no direct URL is available
        const viewerUrl = file.url 
          ? `https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`
          : `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + '/placeholder.' + file.type)}&embedded=true`;
        return (
          <iframe
            src={viewerUrl}
            className="w-full h-full rounded-xl border-none bg-white"
            title={file.name}
          />
        );
      case 'video':
        return (
          <div className="flex items-center justify-center w-full h-full bg-black rounded-xl overflow-hidden">
            <video
              controls
              autoPlay
              className="max-w-full max-h-full"
              src={file.url}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'png':
        return (
          <div className="flex items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden p-4">
            <img
              src={file.url || 'https://images.unsplash.com/photo-1454165833762-010378946021?auto=format&fit=crop&q=80&w=2070'}
              alt={file.name}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-[#1a2632] rounded-xl p-12 text-center">
            <div className="size-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl">insert_drive_file</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{file.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              This file type ({file.type.toUpperCase()}) cannot be previewed directly in the browser.
            </p>
            <a
              href={file.url}
              download={file.name}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">download</span>
              Download File ({file.size})
            </a>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
        onClick={onClose} 
      />
      <div className="relative w-full h-full max-w-6xl bg-slate-50 dark:bg-[#101922] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2632]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                {file.type === 'pdf' ? 'picture_as_pdf' : file.type === 'video' ? 'movie' : 'description'}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">{file.name}</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{file.type} • {file.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={file.url}
              download={file.name}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
              title="Download original file"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download
            </a>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
              aria-label="Close viewer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-6 overflow-hidden">
          {renderContent()}
        </div>

        {/* Mobile Download Bar */}
        <div className="sm:hidden p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2632]">
          <a
            href={file.url}
            download={file.name}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-bold transition-all"
          >
            <span className="material-symbols-outlined">download</span>
            Download original file
          </a>
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
