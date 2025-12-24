
import React from 'react';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClearData: () => void;
  totalFiles: number;
}

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, onToggleDarkMode, onClearData, totalFiles }) => {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500">Configure your workspace and manage storage.</p>
      </div>

      <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">Appearance</h2>
          <p className="text-sm text-slate-500">Customize how EduVault5 looks for you.</p>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-slate-500">Switch between light and dark themes.</p>
            </div>
          </div>
          <button 
            onClick={onToggleDarkMode}
            className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-slate-300'}`}
            aria-label="Toggle dark mode"
          >
            <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">Storage & Data</h2>
          <p className="text-sm text-slate-500">Monitor your data usage and manage local files.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Library Stats</p>
              <p className="text-sm text-slate-500">Currently storing {totalFiles} files locally.</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400">
              Active
            </span>
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-red-500">Reset Workspace</p>
              <p className="text-sm text-slate-500">Permanently delete all subjects, chapters, and favorites from EduVault5.</p>
            </div>
            <button 
              onClick={onClearData}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg text-sm font-bold transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400">EduVault5 v1.0.6 • Local Storage Build</p>
      </div>
    </div>
  );
};

export default SettingsView;
