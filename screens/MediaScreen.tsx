
import React, { useState, useMemo } from 'react';
import { Sermon } from '../types';

interface MediaScreenProps {
  sermons: Sermon[];
  onSermonSelect: (sermon: Sermon) => void;
}

export const MediaScreen: React.FC<MediaScreenProps> = ({ sermons, onSermonSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  
  // 날짜 필터 관련 상태
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const categories = ['주일예배', '수요예배', '금요성령집회', '새벽기도'];

  const filteredAndSortedSermons = useMemo(() => {
    let result = [...sermons];

    // 1. 카테고리 필터
    if (selectedCategory) result = result.filter(sermon => sermon.category === selectedCategory);
    
    // 2. 검색어 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(sermon => 
        sermon.title.toLowerCase().includes(q) || 
        sermon.preacher.toLowerCase().includes(q)
      );
    }

    // 3. 날짜 범위 필터
    if (startDate || endDate) {
      result = result.filter(sermon => {
        const sermonDateStr = sermon.date.replace(/\./g, '-');
        const sermonTime = new Date(sermonDateStr).getTime();
        
        let isMatch = true;
        if (startDate) {
          const start = new Date(startDate).getTime();
          if (sermonTime < start) isMatch = false;
        }
        if (endDate) {
          const end = new Date(endDate).getTime();
          // 종료일은 해당 일의 마지막 시간까지 포함하도록 처리
          const endOfDay = end + (24 * 60 * 60 * 1000 - 1);
          if (sermonTime > endOfDay) isMatch = false;
        }
        return isMatch;
      });
    }

    // 4. 정렬
    result.sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, '-')).getTime();
      const dateB = new Date(b.date.replace(/\./g, '-')).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [sermons, selectedCategory, searchQuery, sortOrder, startDate, endDate]);

  const resetDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setShowDateFilter(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-[#F8FAFC] dark:bg-navy-dark min-h-full pb-24">
      {/* 주요 설교 (최신글 하나 노출) - 필터가 적용되지 않았을 때만 강조 */}
      {filteredAndSortedSermons.length > 0 && !searchQuery && !selectedCategory && !startDate && !endDate && (
        <div 
          className="relative aspect-video rounded-3xl overflow-hidden shadow-xl cursor-pointer group bg-navy-dark"
          onClick={() => onSermonSelect(filteredAndSortedSermons[0])}
        >
          <img src={filteredAndSortedSermons[0].thumbnail} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white text-left">
            <span className="bg-primary text-navy-dark text-[9px] font-black px-2.5 py-1 rounded-full mb-3 inline-block shadow-lg uppercase tracking-tighter">최근 말씀</span>
            <h2 className="text-xl font-black leading-tight tracking-tight line-clamp-2">{filteredAndSortedSermons[0].title}</h2>
            <p className="text-[11px] text-gray-300 mt-1 font-bold">{filteredAndSortedSermons[0].date} | {filteredAndSortedSermons[0].preacher}</p>
          </div>
        </div>
      )}

      {/* 필터 및 검색 바 */}
      <div className="flex flex-col gap-4 sticky top-0 z-20 bg-[#F8FAFC]/95 dark:bg-navy-dark/95 py-2 -mx-4 px-4 backdrop-blur-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="설교 제목, 설교자 검색" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-navy-accent border-none rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold shadow-sm focus:ring-1 focus:ring-primary dark:text-white" 
            />
          </div>
          <button 
            onClick={() => setShowDateFilter(!showDateFilter)}
            className={`size-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border ${showDateFilter || startDate || endDate ? 'bg-primary text-navy-dark border-transparent' : 'bg-white dark:bg-navy-accent text-gray-400 border-gray-100 dark:border-white/5'}`}
          >
            <span className="material-symbols-outlined">calendar_today</span>
          </button>
        </div>

        {/* 확장 날짜 필터 영역 */}
        {showDateFilter && (
          <div className="bg-white dark:bg-navy-accent p-5 rounded-3xl shadow-lg border border-primary/10 animate-in slide-in-from-top-2 duration-300 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
               <h4 className="text-[11px] font-black text-navy-dark dark:text-white uppercase tracking-widest">날짜 범위 선택</h4>
               {(startDate || endDate) && (
                 <button onClick={resetDateFilter} className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                   <span className="material-symbols-outlined text-sm">refresh</span> 초기화
                 </button>
               )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-gray-400 ml-1">시작일</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-3 text-[11px] font-bold dark:text-white focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-gray-400 ml-1">종료일</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-3 text-[11px] font-bold dark:text-white focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setSelectedCategory(null)} className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-black border transition-all ${!selectedCategory ? 'bg-navy-dark text-primary border-transparent shadow-md' : 'bg-white text-gray-400 border-gray-100'}`}>전체</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-black border transition-all ${selectedCategory === cat ? 'bg-navy-dark text-primary border-transparent shadow-md' : 'bg-white text-gray-400 border-gray-100'}`}>{cat}</button>
          ))}
        </div>

        {/* 필터 요약 표시 */}
        {(startDate || endDate) && !showDateFilter && (
           <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-2 flex items-center justify-between">
              <p className="text-[10px] font-bold text-primary truncate">
                기간: {startDate || '...'} ~ {endDate || '오늘'}
              </p>
              <button onClick={resetDateFilter} className="material-symbols-outlined text-primary text-sm">cancel</button>
           </div>
        )}
      </div>

      {/* 목록 */}
      <div className="flex flex-col gap-4">
        {filteredAndSortedSermons.length > 0 ? (
          filteredAndSortedSermons.map(sermon => (
            <div 
              key={sermon.id} 
              className="flex gap-4 bg-white dark:bg-navy-accent p-4 rounded-3xl shadow-sm cursor-pointer group hover:border-primary/20 border border-transparent transition-all active:scale-[0.98]"
              onClick={() => onSermonSelect(sermon)}
            >
              <div className="relative w-32 aspect-video rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                <img src={sermon.thumbnail} loading="lazy" className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <span className="material-symbols-outlined text-white text-xl filled">play_circle</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-black text-sm text-navy-dark dark:text-white truncate group-hover:text-primary transition-colors">{sermon.title}</h4>
                <p className="text-[10px] text-gray-400 font-bold mt-1">{sermon.category} · {sermon.preacher}</p>
                <div className="flex items-center gap-1 mt-1">
                   <span className="material-symbols-outlined text-[10px] text-primary">event</span>
                   <span className="text-[10px] text-gray-400 font-medium">{sermon.date}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center flex flex-col items-center gap-4 bg-white dark:bg-navy-accent rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10 shadow-inner">
            <span className="material-symbols-outlined text-5xl text-gray-200 dark:text-white/10">history_toggle_off</span>
            <p className="text-gray-400 font-bold text-sm">해당 기간의 설교 말씀이 없습니다.</p>
            <button onClick={resetDateFilter} className="text-primary text-xs font-black underline">필터 초기화</button>
          </div>
        )}
      </div>
    </div>
  );
};
