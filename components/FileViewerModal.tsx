
import React, { useState } from 'react';
import { FileItem } from '../types';

interface FileViewerModalProps {
  file: FileItem | null;
  onClose: () => void;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ file, onClose }) => {
  const [hasError, setHasError] = useState(false);

  if (!file) return null;

  // Determine if the URL is likely a live blob or a real external URL
  const isBlob = !!file.url && file.url.startsWith('blob:');
  const isRemote = !!file.url && file.url.startsWith('http');

  const handleOpenNewTab = () => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const renderContent = () => {
    if (hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl">
          <div className="size-20 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl">warning</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Preview Blocked</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
            Chrome's security settings are preventing this file from being previewed inside the app. Please open it in a new tab or download it.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleOpenNewTab}
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">open_in_new</span>
              Open in New Tab
            </button>
            <a
              href={file.url}
              download={file.name}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">download</span>
              Download
            </a>
          </div>
        </div>
      );
    }

    // For Word and PowerPoint, we can use the Google Docs Viewer for remote files
    if (isRemote && (file.type === 'pptx' || file.type === 'docx')) {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(file.url!)}&embedded=true`;
      return (
        <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-inner">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-none"
            title="Document Viewer"
            onError={() => setHasError(true)}
          />
        </div>
      );
    }

    switch (file.type) {
      case 'pdf':
        // Object tag is often more reliable than iframe for PDFs in Chrome
        return (
          <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-inner">
            <object
              data={isBlob ? file.url : `${file.url}#toolbar=0&navpanes=0`}
              type="application/pdf"
              className="w-full h-full"
              onError={() => setHasError(true)}
            >
              <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 dark:bg-slate-900">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">picture_as_pdf</span>
                <h3 className="text-lg font-bold mb-2">PDF Viewer Issue</h3>
                <p className="text-sm text-slate-500 mb-6">Your browser cannot render this PDF inline.</p>
                <button 
                  onClick={handleOpenNewTab}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-all"
                >
                  Open in New Tab
                </button>
              </div>
            </object>
          </div>
        );
      case 'video':
        return (
          <div className="flex items-center justify-center w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl">
            <video
              controls
              autoPlay
              className="max-w-full max-h-full"
              src={file.url}
              onError={() => setHasError(true)}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'png':
        return (
          <div className="flex items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden p-4">
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
              onError={() => setHasError(true)}
            />
          </div>
        );
      case 'txt':
        return (
          <div className="w-full h-full bg-white dark:bg-slate-900 p-8 overflow-y-auto custom-scrollbar font-mono text-sm text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <p className="whitespace-pre-wrap leading-relaxed">
              --- START OF {file.name.toUpperCase()} ---
              {"\n\n"}
              {/* In a real app, we would fetch the text content here */}
              This is a text preview for your uploaded file.
              {"\n\n"}
              Note: For local .txt files, browsers typically allow viewing them. 
              If the content isn't visible, please use the "Open in New Tab" button.
            </p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-[#1a2632] rounded-3xl p-12 text-center shadow-inner">
            <div className={`size-32 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl ${
              file.type === 'pptx' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              <span className="material-symbols-outlined text-6xl icon-filled">
                {file.type === 'pptx' ? 'slideshow' : 'description'}
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{file.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto leading-relaxed font-medium">
              This {file.type.toUpperCase()} file requires its native application or a new tab to be viewed safely.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm">
              <button
                onClick={handleOpenNewTab}
                className="w-full px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">open_in_new</span>
                Open to View
              </button>
              <a
                href={file.url}
                download={file.name}
                className="w-full px-8 py-4 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">download</span>
                Download
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" 
        onClick={onClose} 
      />
      <div className="relative w-full h-full max-w-6xl bg-slate-50 dark:bg-[#0f172a] rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#1a2632]/50 backdrop-blur-md">
          <div className="flex items-center gap-4 min-w-0">
            <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              file.type === 'pdf' ? 'bg-red-50 text-red-500' : 
              file.type === 'pptx' ? 'bg-orange-50 text-orange-500' : 
              'bg-blue-50 text-blue-500'
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {file.type === 'pdf' ? 'picture_as_pdf' : file.type === 'video' ? 'movie' : 'description'}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] font-black text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-md">{file.name}</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{file.type} • {file.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              <span className="hidden sm:inline">Open in New Tab</span>
              <span className="sm:hidden">Open</span>
            </button>
            <button 
              onClick={onClose}
              className="size-10 flex items-center justify-center hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 rounded-full text-slate-400 transition-all active:scale-90"
              aria-label="Close viewer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-6 overflow-hidden relative">
          {renderContent()}
        </div>

        {/* Action Bar */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#1a2632]/50 flex items-center justify-between gap-4">
          <div className="hidden sm:block">
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">EduVault Safe Viewer</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {file.url && (
              <a
                href={file.url}
                download={file.name}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                <span className="material-symbols-outlined">download</span>
                Download
              </a>
            )}
            <button
              onClick={handleOpenNewTab}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl text-sm font-black transition-all"
            >
              <span className="material-symbols-outlined">open_in_new</span>
              Full Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
