
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDestructive = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1a2632] rounded-[24px] shadow-2xl p-8 animate-in zoom-in-95 duration-200 text-center">
        <div className={`size-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
          isDestructive ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
        }`}>
          <span className="material-symbols-outlined text-3xl">
            {isDestructive ? 'warning' : 'info'}
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
          {message}
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 text-sm ${
              isDestructive 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                : 'bg-primary hover:bg-blue-600 shadow-primary/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
