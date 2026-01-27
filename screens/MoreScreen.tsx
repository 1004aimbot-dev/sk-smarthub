
import React, { useState, useEffect } from 'react';
import { Sermon, ViewType } from '../types';
import { MOCK_SERMONS } from '../constants';

interface MoreScreenProps {
  onSermonSelect?: (sermon: Sermon) => void;
  setView?: (view: ViewType) => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({ onSermonSelect, setView }) => {
  const [activeTheme, setActiveTheme] = useState('light');
  const [bookmarks, setBookmarks] = useState<Sermon[]>([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('shinkwang_bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  const handleMenuClick = (label: string) => {
    if (label === '교회 정보') setView?.(ViewType.SITEMAP);
<<<<<<< HEAD
    else if (label === '온라인 주보') setView?.(ViewType.BULLETIN);
=======
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
    else if (label === '소그룹 모임') setView?.(ViewType.SMALL_GROUP);
    else if (label === '공지사항') setView?.(ViewType.NOTICE);
    else if (label === '교회앨범') setView?.(ViewType.ALBUM);
    else alert(`${label} 준비 중입니다.`);
  };

  const handleThemeChange = (theme: string) => {
    setActiveTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-10 bg-[#F8FAFC] dark:bg-navy-dark min-h-full">
      {/* 관리자 모드 섹션 */}
      <div className="flex flex-col gap-3 px-1">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">관리 전용</h3>
        <button 
          onClick={() => setView?.(ViewType.ADMIN_LOGIN)}
          className="bg-white dark:bg-navy-accent rounded-3xl p-5 flex items-center justify-between shadow-sm border border-primary/20 group hover:border-primary active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined filled text-2xl">admin_panel_settings</span>
            </div>
            <span className="text-base font-black text-navy-dark dark:text-white">관리자 모드</span>
          </div>
          <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
        </button>
      </div>

      <div className="bg-navy-dark rounded-2xl p-6 flex items-center gap-4 shadow-lg border border-primary/10">
        <div className="size-16 rounded-full overflow-hidden border-2 border-primary/20 bg-gray-800">
          <img src="https://picsum.photos/seed/user/100/100" alt="프로필" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="text-white text-lg font-bold">김신광 성도님</h2>
          <p className="text-gray-400 text-sm italic font-medium">환영합니다! 오늘도 은혜 가득한 하루 되세요.</p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">나의 보관함</h3>
        <div className="bg-white dark:bg-navy-accent rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-white/5">
          {bookmarks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {bookmarks.map(s => (
                <div key={s.id} onClick={() => onSermonSelect?.(s)} className="flex items-center gap-3 cursor-pointer group">
                  <div className="size-12 rounded-xl bg-gray-100 border dark:border-white/10 overflow-hidden shrink-0"><img src={s.thumbnail} className="w-full h-full object-cover" alt="" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-dark dark:text-white truncate group-hover:text-primary transition-colors">{s.title}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{s.preacher} · {s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-xs text-gray-400 font-bold">보관된 말씀이 없습니다.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">교회 커뮤니티</h3>
        <div className="bg-white dark:bg-navy-accent rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 divide-y divide-gray-50 dark:divide-white/5">
          <MoreMenuItem icon="church" label="교회 정보" color="text-primary" onClick={() => handleMenuClick('교회 정보')} />
<<<<<<< HEAD
          <MoreMenuItem icon="article" label="온라인 주보" color="text-primary" onClick={() => handleMenuClick('온라인 주보')} />
=======
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
          <MoreMenuItem icon="groups" label="소그룹 모임" color="text-primary" onClick={() => handleMenuClick('소그룹 모임')} />
          <MoreMenuItem icon="photo_library" label="교회앨범" color="text-primary" onClick={() => handleMenuClick('교회앨범')} />
          <MoreMenuItem icon="campaign" label="공지사항" color="text-primary" onClick={() => handleMenuClick('공지사항')} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">앱 설정</h3>
        <div className="bg-white dark:bg-navy-accent rounded-[2rem] p-4 shadow-sm border border-gray-100 dark:border-white/5">
          <ThemeOption icon="light_mode" label="라이트 모드" active={activeTheme === 'light'} onClick={() => handleThemeChange('light')} />
          <ThemeOption icon="dark_mode" label="다크 모드" active={activeTheme === 'dark'} onClick={() => handleThemeChange('dark')} />
        </div>
      </section>

<<<<<<< HEAD
      {/* 푸터 영역 */}
=======
      {/* 푸터 영역: 클릭 시 관리자 페이지로 이동 가능하도록 수정 */}
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
      <div className="text-center py-6 text-[10px] text-gray-400 font-medium leading-relaxed">
        <span 
          onClick={() => setView?.(ViewType.ADMIN_LOGIN)}
          className="cursor-pointer hover:text-primary transition-colors active:opacity-50"
        >
          © 2026 성남신광교회. 모든 권리 보유.
        </span>
        <br/>버전 1.5.0
      </div>
    </div>
  );
};

const MoreMenuItem: React.FC<{ icon: string; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 bg-[#FFF9E6] dark:bg-primary/10 ${color}`}>
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <span className="flex-1 text-left font-bold text-[16px] text-navy-dark dark:text-white">{label}</span>
    <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-all">chevron_right</span>
  </button>
);

const ThemeOption: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group">
    <div className="flex items-center gap-4">
      <div className={`size-10 rounded-full flex items-center justify-center ${active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span className={`text-sm font-bold ${active ? 'text-primary' : 'text-gray-700'}`}>{label}</span>
    </div>
    {active && <span className="material-symbols-outlined text-primary font-black">check</span>}
  </button>
);
