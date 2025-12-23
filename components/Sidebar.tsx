
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: () => void;
  onNavigateSettings: () => void;
  onNavigateFavorites: () => void;
  onNavigateRecent: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate, 
  onNavigateSettings, 
  onNavigateFavorites, 
  onNavigateRecent 
}) => {
  const navItemClass = (view: ViewState) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${
      currentView === view ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2632] hidden md:flex flex-col justify-between p-4 z-20">
      <div className="flex flex-col gap-8">
        <div className="px-2 flex items-center gap-2 mt-2 cursor-pointer" onClick={onNavigate}>
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none tracking-tight">EduVault</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Student Portal</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          <button onClick={onNavigate} className={navItemClass('dashboard')}>
            <span className={`material-symbols-outlined ${currentView === 'dashboard' ? 'icon-filled' : ''}`}>grid_view</span>
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          
          <button onClick={onNavigateRecent} className={navItemClass('recent')}>
            <span className={`material-symbols-outlined ${currentView === 'recent' ? 'icon-filled' : ''}`}>schedule</span>
            <span className="text-sm font-medium">Recent Files</span>
          </button>
          
          <button onClick={onNavigateFavorites} className={navItemClass('favorites')}>
            <span className={`material-symbols-outlined ${currentView === 'favorites' ? 'icon-filled' : ''}`}>star</span>
            <span className="text-sm font-medium">Favorites</span>
          </button>
          
          <button onClick={onNavigateSettings} className={navItemClass('settings')}>
            <span className={`material-symbols-outlined ${currentView === 'settings' ? 'icon-filled' : ''}`}>settings</span>
            <span className="text-sm font-medium">Settings</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Local Session</p>
        <p className="text-xs text-slate-500">Data persists in your browser.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
