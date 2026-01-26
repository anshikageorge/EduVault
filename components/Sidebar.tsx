
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
  onNavigateSettings: () => void;
  onNavigateFavorites: () => void;
  onNavigateRecent: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  isOpen,
  onClose,
  onNavigate, 
  onNavigateSettings, 
  onNavigateFavorites, 
  onNavigateRecent
}) => {
  const navItemClass = (view: ViewState) => 
    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all w-full text-left ${
      currentView === view ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const sidebarBaseClass = "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#1a2632] border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`${sidebarBaseClass} ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex flex-col gap-8 flex-1">
            <div className="px-2 flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigate}>
                <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-xl">school</span>
                </div>
                <div>
                  <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none tracking-tight">EduVault5</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Student Portal</p>
                </div>
              </div>
              <button onClick={onClose} className="md:hidden text-slate-400 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              <button onClick={onNavigate} className={navItemClass('dashboard')}>
                <span className={`material-symbols-outlined ${currentView === 'dashboard' ? 'icon-filled' : ''}`}>grid_view</span>
                <span className="text-sm font-semibold">Dashboard</span>
              </button>
              
              <button onClick={onNavigateRecent} className={navItemClass('recent')}>
                <span className={`material-symbols-outlined ${currentView === 'recent' ? 'icon-filled' : ''}`}>schedule</span>
                <span className="text-sm font-semibold">Recent Files</span>
              </button>
              
              <button onClick={onNavigateFavorites} className={navItemClass('favorites')}>
                <span className={`material-symbols-outlined ${currentView === 'favorites' ? 'icon-filled' : ''}`}>star</span>
                <span className="text-sm font-semibold">Favorites</span>
              </button>

              <div className="my-4 border-t border-slate-100 dark:border-slate-800" />
              
              <button onClick={onNavigateSettings} className={navItemClass('settings')}>
                <span className={`material-symbols-outlined ${currentView === 'settings' ? 'icon-filled' : ''}`}>settings</span>
                <span className="text-sm font-semibold">Settings</span>
              </button>
            </nav>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-[#101922] rounded-2xl border border-slate-100 dark:border-slate-800 mt-auto">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Local Storage
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Data persists in this browser on this device.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
