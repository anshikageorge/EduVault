
import React from 'react';
import { FileItem } from '../types';

interface FileViewerModalProps {
  file: FileItem | null;
  onClose: () => void;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ file, onClose }) => {
  if (!file) return null;

  // Determine if the URL is likely a live blob or a real external URL
  const hasValidUrl = !!file.url && (file.url.startsWith('blob:') || file.url.startsWith('http') || file.url.startsWith('/'));

  const handleOpenNewTab = () => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const renderContent = () => {
    // If the file is a document but we don't have a real previewable URL (e.g. from mock data)
    if (!hasValidUrl && (file.type === 'pptx' || file.type === 'docx' || file.type === 'pdf')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-[#0f172a]">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1a2632] shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col min-h-[450px] animate-in zoom-in-95 duration-300">
            {/* Mock Document Header */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-5">
              <div className={`size-16 rounded-2xl flex items-center justify-center shadow-lg ${
                file.type === 'pdf' ? 'bg-red-500 text-white' : 
                file.type === 'pptx' ? 'bg-orange-500 text-white' : 
                'bg-blue-500 text-white'
              }`}>
                <span className="material-symbols-outlined text-3xl icon-filled">
                  {file.type === 'pdf' ? 'picture_as_pdf' : file.type === 'pptx' ? 'slideshow' : 'description'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{file.name}</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-black mt-1">{file.type} Document • {file.size}</p>
              </div>
            </div>
            
            {/* Mock Content Body */}
            <div className="flex-1 p-8 flex flex-col justify-center text-center">
              <div className="mb-6 opacity-20">
                <span className="material-symbols-outlined text-8xl dark:text-white">auto_stories</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Detailed Preview Unavailable</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                To protect your privacy, Chrome restricts inline previews for some local file types. Please download or open the file in a new tab to view its contents.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={file.url}
                  download={file.name}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">download</span>
                  Download
                </a>
                {file.url && (
                   <button
                    onClick={handleOpenNewTab}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">open_in_new</span>
                    Open in New Tab
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (file.type) {
      case 'pdf':
        // Use object/embed instead of iframe, which Chrome handles more robustly for PDFs
        return (
          <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-inner flex flex-col">
            <object
              data={file.url}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 dark:bg-slate-900">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">picture_as_pdf</span>
                <h3 className="text-lg font-bold mb-2">Native PDF Viewer Blocked</h3>
                <p className="text-sm text-slate-500 mb-6">Your browser settings are preventing the PDF from loading inline.</p>
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
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=2070';
              }}
            />
          </div>
        );
      case 'txt':
        return (
          <div className="w-full h-full bg-white dark:bg-slate-900 p-8 overflow-y-auto custom-scrollbar font-mono text-sm text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <p className="whitespace-pre-wrap leading-relaxed">
              --- START OF {file.name.toUpperCase()} ---
              {"\n\n"}
              This is a text preview for your uploaded file.
              {"\n\n"}
              [Content generated for simulation purposes]
              {"\n\n"}
              The file contains your study notes and key concepts extracted from the course materials.
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
              This {file.type.toUpperCase()} file needs to be opened in its native application for the best experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm">
              <a
                href={file.url}
                download={file.name}
                className="w-full px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">download</span>
                Download File
              </a>
              <button 
                onClick={onClose}
                className="w-full px-8 py-4 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Close
              </button>
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
            {file.url && (
              <button
                onClick={handleOpenNewTab}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Pop-out
              </button>
            )}
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
        {file.url && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#1a2632]/50 flex items-center justify-between gap-4">
            <div className="hidden sm:block">
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">EduVault Safe Viewer</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <a
                href={file.url}
                download={file.name}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                <span className="material-symbols-outlined">download</span>
                Download
              </a>
              <button
                onClick={handleOpenNewTab}
                className="sm:hidden flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl text-sm font-black transition-all"
              >
                <span className="material-symbols-outlined">open_in_new</span>
                Pop-out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewerModal;
