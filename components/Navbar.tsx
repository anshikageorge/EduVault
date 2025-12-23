
import React, { useState, useRef, useEffect } from 'react';
import { USER_IMAGE, MOTIVATIONAL_QUOTES } from '../constants';
import { AppNotification } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: AppNotification[];
  onClearNotifications: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange, notifications, onClearNotifications }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dailyQuote, setDailyQuote] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate quote based on day of year to keep it constant per day
    const day = new Date().getDate();
    setDailyQuote(MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#1a2632]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between gap-4">
      <button className="md:hidden p-2 text-slate-600 dark:text-slate-400">
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined">search</span>
          <input 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-[#101922] border-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/40 transition-all outline-none" 
            placeholder="Search subjects, chapters or files..." 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-2 rounded-full transition-all relative ${
              isNotificationsOpen ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2632]"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-[15px]">Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={onClearNotifications} className="text-xs text-primary hover:underline font-bold">Clear all</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl opacity-20">notifications_off</span>
                    <p className="text-xs font-medium">No notifications yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex gap-3">
                          <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notif.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                            notif.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                          }`}>
                            <span className="material-symbols-outlined text-[18px]">
                              {notif.type === 'success' ? 'check_circle' : notif.type === 'error' ? 'error' : 'info'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-slate-800 dark:text-slate-200 leading-tight font-medium">{notif.text}</p>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-2"></div>
        
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm bg-cover bg-center hover:border-primary transition-all focus:outline-none" 
            style={{ backgroundImage: `url('${USER_IMAGE}')` }}
          />

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-5">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 bg-cover bg-center border-2 border-primary/20" style={{ backgroundImage: `url('${USER_IMAGE}')` }} />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Alex Johnson</h4>
                  <p className="text-xs text-slate-500">Student ID: #SV-2024-9182</p>
                </div>
                <div className="w-full bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10">
                  <p className="text-[10px] text-primary uppercase font-bold tracking-widest mb-2">Quote of the Day</p>
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                    "{dailyQuote}"
                  </p>
                </div>
                <button className="w-full py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
