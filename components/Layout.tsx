
import React from 'react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  title: string;
  showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, title, showBack }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-navy-light dark:bg-navy-dark shadow-xl overflow-hidden relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-navy-light/95 dark:bg-navy-dark/95 backdrop-blur-md border-b-2 border-primary/20 flex items-center justify-between px-4 py-3 shrink-0">
        {showBack ? (
          <button 
            onClick={() => {
              if (title === "말씀 상세") {
                setView(ViewType.MEDIA);
              } else if (title === "사이트맵" || title === "양육 프로그램") {
                setView(ViewType.HOME);
              } else {
                setView(ViewType.HOME);
              }
            }}
            className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <div className="size-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">church</span>
          </div>
        )}
        
        <h1 className="text-lg font-bold text-navy-dark dark:text-white flex-1 text-center truncate px-2">
          {title}
        </h1>

        <button 
          onClick={() => setView(ViewType.SITEMAP)}
          className={`size-10 flex items-center justify-center rounded-full transition-all ${currentView === ViewType.SITEMAP ? 'bg-primary text-navy-dark scale-90' : 'hover:bg-black/5 dark:hover:bg-white/5 text-navy-dark dark:text-white'}`}
        >
          <span className={`material-symbols-outlined ${currentView === ViewType.SITEMAP ? 'filled' : ''}`}>menu</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative pb-20">
        <div className="h-full overflow-y-auto no-scrollbar">
          {children}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-navy-dark border-t border-gray-100 dark:border-white/10 px-6 py-2 flex items-center justify-between z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <NavButton 
          icon="home" 
          label="홈" 
          active={currentView === ViewType.HOME} 
          onClick={() => setView(ViewType.HOME)} 
        />
        <NavButton 
          icon="school" 
          label="양육" 
          active={currentView === ViewType.PROGRAM} 
          onClick={() => setView(ViewType.PROGRAM)} 
        />
        <NavButton 
          icon="smart_display" 
          label="미디어" 
          active={currentView === ViewType.MEDIA} 
          onClick={() => setView(ViewType.MEDIA)} 
        />
        <NavButton 
          icon="map" 
          label="오시는길" 
          active={currentView === ViewType.MAP} 
          onClick={() => setView(ViewType.MAP)} 
        />
        <NavButton 
          icon="more_horiz" 
          label="더보기" 
          active={currentView === ViewType.MORE} 
          onClick={() => setView(ViewType.MORE)} 
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary' : 'text-gray-400'}`}
  >
    <span className={`material-symbols-outlined ${active ? 'filled' : ''}`}>{icon}</span>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);
