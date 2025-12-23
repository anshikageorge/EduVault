
import React, { useState, useRef } from 'react';
import { FileItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  chapterName: string;
  chapterId: string;
  onUpload: (file: FileItem) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, subjectName, chapterName, chapterId, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    selectedFiles.forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let type: 'pdf' | 'pptx' | 'png' | 'docx' = 'pdf';
      if (ext === 'pptx') type = 'pptx';
      else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') type = 'png';
      else if (ext === 'docx') type = 'docx';

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

    setSelectedFiles([]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[640px] bg-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-[20px] font-bold text-[#111827]">Upload Materials</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined !text-[24px]">close</span>
          </button>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-6">
          {/* Breadcrumb Info */}
          <div className="flex items-center gap-2 text-[14px] bg-[#eff6ff] text-[#1e40af] px-4 py-2.5 rounded-xl w-fit font-medium">
            <span className="material-symbols-outlined !text-[18px] icon-filled">folder</span>
            <span>Uploading to: <strong className="font-bold text-[#1e3a8a]">{subjectName}</strong> <span className="mx-1 text-[#93c5fd]">/</span> <strong className="font-bold text-[#1e3a8a]">{chapterName}</strong></span>
          </div>

          {/* Drop Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex flex-col items-center justify-center w-full py-12 border-2 border-dashed border-[#d1d5db] rounded-[20px] hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="relative h-16 w-24 mb-6">
                {/* PDF Icon (Left) */}
                <div className="absolute left-0 bottom-0 size-10 bg-white border border-slate-100 rounded-lg shadow-sm flex items-center justify-center text-[#ef4444] transform -rotate-[15deg] z-10 translate-x-1">
                  <span className="material-symbols-outlined !text-[24px] icon-filled">picture_as_pdf</span>
                </div>
                {/* Main Upload Icon (Center) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 size-12 bg-[#2563eb] rounded-xl shadow-lg flex items-center justify-center text-white z-20">
                  <span className="material-symbols-outlined !text-[28px]">cloud_upload</span>
                </div>
                {/* PPT/Play Icon (Right) */}
                <div className="absolute right-0 bottom-0 size-10 bg-white border border-slate-100 rounded-lg shadow-sm flex items-center justify-center text-[#f97316] transform rotate-[15deg] z-10 -translate-x-1">
                  <span className="material-symbols-outlined !text-[24px] icon-filled">slideshow</span>
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-[18px] font-bold text-[#111827]">
                  Drag & drop files here
                </p>
                <p className="text-[14px] text-slate-500">
                  or <span className="text-[#2563eb] font-semibold hover:underline">browse your computer</span>
                </p>
              </div>
              <p className="text-[12px] text-[#9ca3af] mt-5">
                Supports PDF, PPTX, JPG up to 25MB
              </p>
            </div>
            <input 
              className="hidden" 
              multiple 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* Ready to Upload Section */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Ready to upload</h3>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white border border-[#e5e7eb] rounded-xl group transition-shadow hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-[#fef2f2] text-[#ef4444] rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined !text-[22px] icon-filled">picture_as_pdf</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#111827]">{file.name}</span>
                        <span className="text-[12px] text-[#6b7280]">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="text-[#9ca3af] hover:text-[#ef4444] transition-colors p-1"
                    >
                      <span className="material-symbols-outlined !text-[20px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#f3f4f6] flex items-center justify-between bg-[#fafafa]">
          <span className="text-[14px] font-medium text-[#4b5563]">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-6">
            <button 
              onClick={onClose}
              className="text-[14px] font-bold text-[#111827] hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
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
