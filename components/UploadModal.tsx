
import React, { useState, useRef } from 'react';
import { FileItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  chapterName: string;
  chapterId: string;
  onUpload: (file: FileItem) => void;
  onAddFiles?: (files: File[]) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, subjectName, chapterName, chapterId, onUpload, onAddFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    if (onAddFiles) {
      onAddFiles(selectedFiles);
    } else {
      // Fallback for single file logic if needed
      selectedFiles.forEach(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        let type: 'pdf' | 'pptx' | 'png' | 'docx' | 'video' = 'pdf';
        
        if (ext === 'pptx') type = 'pptx';
        else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') type = 'png';
        else if (ext === 'docx') type = 'docx';
        else if (['mp4', 'mov', 'webm', 'avi'].includes(ext || '')) type = 'video';

        const newFile: FileItem = {
          id: Math.random().toString(36).substr(2, 9),
          chapterId: chapterId,
          name: file.name,
          type: type,
          dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        };

        onUpload(newFile);
      });
    }

    setSelectedFiles([]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'webm', 'avi'].includes(ext || '')) return 'movie';
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) return 'image';
    if (ext === 'pdf') return 'picture_as_pdf';
    if (ext === 'pptx') return 'slideshow';
    return 'insert_drive_file';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-[640px] bg-white dark:bg-[#1a2632] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-[20px] font-bold text-[#111827] dark:text-white">Upload Materials</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined !text-[24px]">close</span>
          </button>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[14px] bg-[#eff6ff] dark:bg-[#1e3a8a]/20 text-[#1e40af] dark:text-blue-300 px-4 py-2.5 rounded-xl w-fit font-medium">
            <span className="material-symbols-outlined !text-[18px] icon-filled">folder</span>
            <span>Uploading to: <strong className="font-bold text-[#1e3a8a] dark:text-blue-200">{subjectName}</strong> <span className="mx-1 text-[#93c5fd]">/</span> <strong className="font-bold text-[#1e3a8a] dark:text-blue-200">{chapterName}</strong></span>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex flex-col items-center justify-center w-full py-12 border-2 border-dashed border-[#d1d5db] dark:border-slate-700 rounded-[20px] hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="relative h-16 w-32 mb-6 flex justify-center items-center gap-2">
                <div className="size-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-sm flex items-center justify-center text-[#ef4444] transform -rotate-[15deg] z-10 translate-x-2">
                  <span className="material-symbols-outlined !text-[24px] icon-filled">picture_as_pdf</span>
                </div>
                <div className="size-12 bg-[#2563eb] rounded-xl shadow-lg flex items-center justify-center text-white z-20">
                  <span className="material-symbols-outlined !text-[28px]">cloud_upload</span>
                </div>
                <div className="size-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-sm flex items-center justify-center text-purple-500 transform rotate-[15deg] z-10 -translate-x-2">
                  <span className="material-symbols-outlined !text-[24px] icon-filled">movie</span>
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-[18px] font-bold text-[#111827] dark:text-white">Drag & drop files here</p>
                <p className="text-[14px] text-slate-500">or <span className="text-[#2563eb] font-semibold hover:underline">browse your computer</span></p>
              </div>
              <p className="text-[12px] text-[#9ca3af] mt-5">Supports PDF, PPTX, Video, Images up to 100MB</p>
            </div>
            <input className="hidden" multiple type="file" ref={fileInputRef} onChange={handleFileChange} />
          </div>

          {selectedFiles.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-bold text-[#6b7280] dark:text-slate-500 uppercase tracking-wider">Ready to upload</h3>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-[#e5e7eb] dark:border-slate-700 rounded-xl group transition-shadow hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-700 text-slate-500`}>
                        <span className="material-symbols-outlined !text-[22px] icon-filled">
                          {getFileIcon(file.name)}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-semibold text-[#111827] dark:text-white truncate">{file.name}</span>
                        <span className="text-[12px] text-[#6b7280]">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-[#9ca3af] hover:text-[#ef4444] transition-colors p-1">
                      <span className="material-symbols-outlined !text-[20px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-5 border-t border-[#f3f4f6] dark:border-slate-800 flex items-center justify-between bg-[#fafafa] dark:bg-slate-900/50">
          <span className="text-[14px] font-medium text-[#4b5563] dark:text-slate-400">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="text-[14px] font-bold text-[#111827] dark:text-white hover:text-slate-600 transition-colors">Cancel</button>
            <button 
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
              className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#3b82f6] hover:bg-[#2563eb] transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              <span className="material-symbols-outlined !text-[20px]">upload</span>
              Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
