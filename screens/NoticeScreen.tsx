
import React, { useState, useMemo } from 'react';
import { Notice } from '../types';

const MOCK_NOTICES: Notice[] = [
  { 
    id: 1, 
    tag: '필독', 
    title: '성남신광교회 온라인 성전 앱 정식 런칭 안내', 
    date: '2026.05.10',
    content: '할렐루야! 성남신광교회 성도님들을 위한 스마트 허브 앱이 정식으로 런칭되었습니다. 이제 언제 어디서나 실시간 예배 참여, 온라인 주보 확인, 공간 예약 등 교회의 모든 서비스를 손쉽게 이용하실 수 있습니다.\n\n앱을 통해 성도님들 간의 소통이 원활해지고, 하나님의 말씀을 더 가까이 접할 수 있는 통로가 되길 소망합니다. 주변 성도님들께도 많은 홍보와 설치 안내 부탁드립니다.'
  },
  { 
    id: 2, 
    tag: '행사', 
    title: '2026 하반기 전교인 체육대회 신청 안내', 
    date: '2026.05.08',
    content: '그동안 미루어왔던 전교인 체육대회를 아래와 같이 개최합니다. 온 가족이 함께 어우러져 기쁨을 나누는 축제의 장이 되길 소망합니다.\n\n- 일시: 2026년 6월 15일(토) 오전 9시\n- 장소: 인근 초등학교 운동장\n- 대상: 전교인 및 지역 주민\n- 참가비: 무료 (점심 식사 제공)\n- 신청: 각 교구 및 부서별 신청서 제출\n\n다양한 경품과 즐거운 게임이 준비되어 있으니 성도님들의 많은 참여 바랍니다.'
  },
  { 
    id: 3, 
    tag: '일반', 
    title: '주차장 바닥 도색 공사로 인한 출입 통제 안내', 
    date: '2026.05.05',
    content: '교회 주차 환경 개선을 위해 주차장 바닥 보수 및 도색 공사를 실시합니다. 공사 기간 중에는 차량 진입이 전면 통제되오니 성도님들의 너그러운 양해 부탁드립니다.\n\n- 공사 기간: 5월 20일(월) ~ 5월 22일(수)\n- 협조 사항: 인근 유료 주차장 또는 대중교통 이용 권장\n\n더 쾌적한 교회 환경을 만들기 위해 최선을 다하겠습니다.'
  },
  { 
    id: 4, 
    tag: '모임', 
    title: '어머니 기도회 장소 변경 안내 (비전홀 2관)', 
    date: '2026.05.01',
    content: '자녀와 가정을 위해 눈물로 씨를 뿌리는 어머니 기도회의 장소가 이번 주부터 변경됩니다.\n\n- 기존: 로뎀나무 카페 뒤편 세미나실\n- 변경: 비전홀 2관 (3층)\n- 시간: 매주 화요일 오전 10시\n- 변경 사유: 참석 인원 증가에 따른 공간 확장\n\n어머니들의 뜨거운 기도의 불길이 이어지길 소망합니다.'
  },
  { 
    id: 5, 
    tag: '일반', 
    title: '5월 성경 읽기표 배부 안내', 
    date: '2026.04.28',
    content: '가정의 달 5월을 맞아 온 가족이 함께 성경을 읽을 수 있도록 성경 읽기표를 배부합니다. 예배당 입구 비치함에서 수령해 가시기 바랍니다.'
  }
];

export const NoticeScreen: React.FC = () => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'전체' | '필독' | '행사' | '일반' | '모임'>('전체');

  const filteredNotices = useMemo(() => {
    return MOCK_NOTICES.filter(notice => {
      const matchesFilter = activeFilter === '전체' || notice.tag === activeFilter;
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            notice.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  const getTagStyles = (tag: string) => {
    switch (tag) {
      case '필독': return 'bg-red-500 text-white'; 
      case '행사': return 'bg-primary/20 text-primary';
      case '일반': return 'bg-gray-100 dark:bg-white/10 text-gray-400';
      case '모임': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const handleShare = (notice: Notice) => {
    const textToShare = `${notice.title}\n\n${notice.content}`;
    if (navigator.share) {
      navigator.share({
        title: notice.title,
        text: notice.content,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(textToShare).then(() => {
        alert('공지 내용이 클립보드에 복사되었습니다.');
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 bg-[#F8FAFC] dark:bg-navy-dark min-h-full pb-20">
      
      {/* 검색 및 필터 바 */}
      <div className="flex flex-col gap-4 sticky top-0 z-20 bg-[#F8FAFC]/90 dark:bg-navy-dark/90 backdrop-blur-md py-2 -mx-5 px-5">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            placeholder="공지사항 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-navy-accent border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/30 dark:text-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['전체', '필독', '행사', '일반', '모임'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-black transition-all shadow-sm border ${
                activeFilter === filter 
                  ? 'bg-navy-dark dark:bg-primary text-primary dark:text-navy-dark border-transparent' 
                  : 'bg-white dark:bg-navy-accent text-gray-400 border-gray-100 dark:border-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 공지사항 목록 */}
      <div className="flex flex-col gap-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div 
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="bg-white dark:bg-navy-accent p-6 rounded-[2rem] shadow-sm border border-gray-50 dark:border-white/5 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98] group flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${getTagStyles(notice.tag)}`}>
                    {notice.tag}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold tracking-tight">{notice.date}</span>
                </div>
                {notice.tag === '필독' && (
                  <span className="material-symbols-outlined text-red-500 filled text-lg">push_pin</span>
                )}
              </div>
              <h4 className="text-[#1A1A1A] dark:text-white font-black text-base leading-snug group-hover:text-primary transition-colors">
                {notice.title}
              </h4>
              <p className="text-gray-400 text-xs line-clamp-2 font-medium leading-relaxed">
                {notice.content}
              </p>
            </div>
          ))
        ) : (
          <div className="py-24 text-center flex flex-col items-center gap-4 bg-white dark:bg-navy-accent rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10 shadow-inner">
            <span className="material-symbols-outlined text-5xl text-gray-200 dark:text-white/10">campaign</span>
            <p className="text-gray-400 font-bold text-sm">해당하는 공지사항이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 공지 상세 모달 */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 sm:items-center sm:p-0">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setSelectedNotice(null)}
          ></div>
          <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-navy-dark text-left shadow-2xl transition-all w-full max-w-sm animate-in slide-in-from-bottom-10 duration-300 border border-gray-100 dark:border-white/10">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-fit text-[10px] font-black px-2.5 py-0.5 rounded-lg ${getTagStyles(selectedNotice.tag)}`}>
                      {selectedNotice.tag}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">{selectedNotice.date}</span>
                  </div>
                  <h4 className="text-xl font-black text-navy-dark dark:text-white leading-tight mt-1">
                    {selectedNotice.title}
                  </h4>
                </div>
                <button 
                  onClick={() => setSelectedNotice(null)} 
                  className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-transform shrink-0"
                >
                  <span className="material-symbols-outlined text-gray-400">close</span>
                </button>
              </div>

              <div className="h-px bg-gray-100 dark:bg-white/5 w-full mb-6"></div>
              
              <div className="max-h-64 overflow-y-auto no-scrollbar">
                <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedNotice.content}
                </p>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => handleShare(selectedNotice)}
                  className="flex-1 bg-gray-100 dark:bg-white/5 py-4 rounded-2xl text-navy-dark dark:text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all border border-gray-200 dark:border-white/10"
                >
                  <span className="material-symbols-outlined text-lg">share</span>
                  공유
                </button>
                <button 
                  onClick={() => setSelectedNotice(null)}
                  className="flex-[2] bg-navy-dark dark:bg-primary py-4 rounded-2xl text-primary dark:text-navy-dark font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  확인했습니다
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
