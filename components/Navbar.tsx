
import React, { useState, useRef, useEffect } from 'react';
import { USER_IMAGE, MOTIVATIONAL_QUOTES, BOY_AVATAR, GIRL_AVATAR } from '../constants';
import { AppNotification } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: AppNotification[];
  onClearNotifications: () => void;
  onToggleSidebar: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  searchQuery, 
  onSearchChange, 
  notifications, 
  onClearNotifications, 
  onToggleSidebar,
  onGoBack,
  onGoForward,
  canGoBack,
  canGoForward
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // Profile State
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('ev_student_name') || 'Alex Johnson';
  });
  
  const [studentAvatar, setStudentAvatar] = useState(() => {
    return localStorage.getItem('ev_student_avatar') || USER_IMAGE;
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(studentName);
  const [tempAvatar, setTempAvatar] = useState(studentAvatar);
  
  const [dailyQuote, setDailyQuote] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    setDailyQuote(MOTIVATIONAL_QUOTES[dateSeed % MOTIVATIONAL_QUOTES.length]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsEditingName(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleSaveProfile = () => {
    const trimmed = editNameValue.trim();
    if (trimmed) {
      setStudentName(trimmed);
      localStorage.setItem('ev_student_name', trimmed);
    }
    setStudentAvatar(tempAvatar);
    localStorage.setItem('ev_student_avatar', tempAvatar);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditNameValue(studentName);
    setTempAvatar(studentAvatar);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#1a2632]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between gap-4 h-[64px]">
      {isMobileSearchOpen ? (
        <div className="absolute inset-0 z-50 bg-white dark:bg-[#1a2632] flex items-center px-4 gap-2 animate-in slide-in-from-top-2 duration-200">
          <button 
            onClick={() => { setIsMobileSearchOpen(false); onSearchChange(''); }}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
            <input 
              ref={mobileInputRef}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-[#101922] border-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/40 outline-none" 
              placeholder="Search dashboard..." 
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="p-2 text-slate-400">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1 md:gap-4">
            <button 
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mr-1"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-1">
              <button 
                onClick={onGoBack}
                disabled={!canGoBack}
                className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                  canGoBack ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">chevron_left</span>
              </button>
              <button 
                onClick={onGoForward}
                disabled={!canGoForward}
                className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                  canGoForward ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">chevron_right</span>
              </button>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
               <div className="size-7 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
                 <span className="material-symbols-outlined text-lg">school</span>
               </div>
            </div>
          </div>

          <div className="flex-1 max-w-lg hidden sm:block">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">search</span>
              <input 
                className="w-full pl-11 pr-4 py-2 bg-slate-100 dark:bg-[#101922] border-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/40 transition-all outline-none" 
                placeholder="Search dashboard..." 
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 relative">
            <button onClick={() => setIsMobileSearchOpen(true)} className="sm:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
               <span className="material-symbols-outlined">search</span>
            </button>

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
                <div className="absolute right-0 mt-3 w-[calc(100vw-32px)] sm:w-80 bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 className="font-bold text-[15px]">Notifications</h3>
                    {notifications.length > 0 && <button onClick={onClearNotifications} className="text-xs text-primary hover:underline font-bold">Clear all</button>}
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
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
                              <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'success' ? 'bg-emerald-50 text-emerald-500' : notif.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                <span className="material-symbols-outlined text-[18px]">{notif.type === 'success' ? 'check_circle' : notif.type === 'error' ? 'error' : 'info'}</span>
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
            
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>
            
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm bg-cover bg-center hover:border-primary transition-all focus:outline-none" 
                style={{ backgroundImage: `url('${studentAvatar}')` }}
              />

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-5">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 bg-cover bg-center border-2 border-primary/20 shadow-inner" style={{ backgroundImage: `url('${isEditingName ? tempAvatar : studentAvatar}')` }} />
                    
                    <div className="w-full">
                      {isEditingName ? (
                        <div className="flex flex-col gap-4">
                          <div className="text-left">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Student Name</label>
                            <input 
                              className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-white focus:border-primary outline-none transition-colors"
                              value={editNameValue}
                              onChange={(e) => setEditNameValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveProfile()}
                              autoFocus
                            />
                          </div>

                          <div className="text-left">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Choose Avatar</label>
                            <div className="flex gap-3 justify-center">
                              <button 
                                onClick={() => setTempAvatar(BOY_AVATAR)}
                                className={`flex flex-col items-center gap-1 group`}
                              >
                                <div className={`size-12 rounded-full bg-slate-50 dark:bg-slate-800 border-2 transition-all p-1 ${tempAvatar === BOY_AVATAR ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                  <img src={BOY_AVATAR} className="w-full h-full" alt="Boy Avatar" />
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${tempAvatar === BOY_AVATAR ? 'text-primary' : 'text-slate-400'}`}>Boy</span>
                              </button>
                              <button 
                                onClick={() => setTempAvatar(GIRL_AVATAR)}
                                className={`flex flex-col items-center gap-1 group`}
                              >
                                <div className={`size-12 rounded-full bg-slate-50 dark:bg-slate-800 border-2 transition-all p-1 ${tempAvatar === GIRL_AVATAR ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                  <img src={GIRL_AVATAR} className="w-full h-full" alt="Girl Avatar" />
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${tempAvatar === GIRL_AVATAR ? 'text-primary' : 'text-slate-400'}`}>Girl</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={handleSaveProfile}
                              className="flex-1 py-2 text-[11px] font-bold bg-primary text-white rounded-lg shadow-lg shadow-primary/20"
                            >
                              Save Changes
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className="flex-1 py-2 text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-none">{studentName}</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">ID: SV-2024-9182</p>
                        </div>
                      )}
                    </div>

                    {!isEditingName && (
                      <>
                        <div className="w-full bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10 text-left">
                          <p className="text-[10px] text-primary uppercase font-black tracking-widest mb-2 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">format_quote</span>
                            Quote of the Day
                          </p>
                          <p className="text-[13px] text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                            "{dailyQuote}"
                          </p>
                        </div>

                        <button 
                          onClick={() => setIsEditingName(true)}
                          className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700"
                        >
                          <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                          Edit Profile
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
