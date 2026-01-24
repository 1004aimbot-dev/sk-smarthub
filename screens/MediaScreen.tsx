
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

  const categories = ['주일예배', '수요예배', '금요성령집회', '새벽기도'];

  const filteredAndSortedSermons = useMemo(() => {
    let result = [...sermons];
    if (selectedCategory) result = result.filter(sermon => sermon.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(sermon => 
        sermon.title.toLowerCase().includes(q) || 
        sermon.preacher.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      // "2026.10.29" 형식을 비교 가능한 날짜로 변환
      const dateA = new Date(a.date.replace(/\./g, '-')).getTime();
      const dateB = new Date(b.date.replace(/\./g, '-')).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [sermons, selectedCategory, searchQuery, sortOrder]);

  return (
    <div className="flex flex-col gap-6 p-4 bg-[#F8FAFC] dark:bg-navy-dark min-h-full pb-24">
      {/* 주요 설교 (최신글 하나 노출) */}
      {filteredAndSortedSermons.length > 0 && (
        <div 
          className="relative aspect-video rounded-3xl overflow-hidden shadow-xl cursor-pointer group bg-navy-dark"
          onClick={() => onSermonSelect(filteredAndSortedSermons[0])}
        >
          <img src={filteredAndSortedSermons[0].thumbnail} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white text-left">
            <span className="bg-primary text-navy-dark text-[9px] font-black px-2.5 py-1 rounded-full mb-3 inline-block shadow-lg">LATEST WORD</span>
            <h2 className="text-xl font-black leading-tight tracking-tight line-clamp-2">{filteredAndSortedSermons[0].title}</h2>
            <p className="text-[11px] text-gray-300 mt-1 font-bold">{filteredAndSortedSermons[0].date} | {filteredAndSortedSermons[0].preacher}</p>
          </div>
        </div>
      )}

      {/* 필터 및 검색 바 */}
      <div className="flex flex-col gap-4 sticky top-0 z-20 bg-[#F8FAFC]/95 dark:bg-navy-dark/95 py-2 -mx-4 px-4 backdrop-blur-md">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input 
            type="text" 
            placeholder="설교 제목, 설교자 검색" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-navy-accent border-none rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold shadow-sm focus:ring-1 focus:ring-primary dark:text-white" 
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setSelectedCategory(null)} className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-black border transition-all ${!selectedCategory ? 'bg-navy-dark text-primary border-transparent' : 'bg-white text-gray-400 border-gray-100'}`}>전체</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-black border transition-all ${selectedCategory === cat ? 'bg-navy-dark text-primary border-transparent' : 'bg-white text-gray-400 border-gray-100'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* 목록 */}
      <div className="flex flex-col gap-4">
        {filteredAndSortedSermons.map(sermon => (
          <div 
            key={sermon.id} 
            className="flex gap-4 bg-white dark:bg-navy-accent p-4 rounded-3xl shadow-sm cursor-pointer group hover:border-primary/20 border border-transparent transition-all active:scale-[0.98]"
            onClick={() => onSermonSelect(sermon)}
          >
            <div className="relative w-32 aspect-video rounded-2xl overflow-hidden shrink-0 bg-gray-100">
              <img src={sermon.thumbnail} loading="lazy" className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <span className="material-symbols-outlined text-white text-xl">play_circle</span>
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="font-black text-sm text-navy-dark dark:text-white truncate group-hover:text-primary transition-colors">{sermon.title}</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-1">{sermon.category} · {sermon.preacher} · {sermon.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
