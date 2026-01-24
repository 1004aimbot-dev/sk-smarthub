
import React, { useState, useMemo, useEffect } from 'react';
import { SmallGroup, SmallGroupCategory } from '../types';
import { DEFAULT_SMALL_GROUPS, DEFAULT_SMALL_GROUP_CATEGORIES } from '../constants';

export const SmallGroupScreen: React.FC = () => {
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [categories, setCategories] = useState<SmallGroupCategory[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<SmallGroup | null>(null);

  // 참여 문의 폼 상태
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 소그룹 로드
    const savedGroups = localStorage.getItem('shinkwang_small_groups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    } else {
      setGroups(DEFAULT_SMALL_GROUPS);
      localStorage.setItem('shinkwang_small_groups', JSON.stringify(DEFAULT_SMALL_GROUPS));
    }

    // 카테고리 로드
    const savedCategories = localStorage.getItem('shinkwang_small_group_categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(DEFAULT_SMALL_GROUP_CATEGORIES);
      localStorage.setItem('shinkwang_small_group_categories', JSON.stringify(DEFAULT_SMALL_GROUP_CATEGORIES));
    }

    // 기존 사용자 정보 로드
    const savedInfo = localStorage.getItem('shinkwang_user_info');
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo);
      setApplicantName(parsed.name || '');
    }
  }, []);

  useEffect(() => {
    if (!selectedGroup) {
      setApplicantPhone('');
      setIsSubmitting(false);
    }
  }, [selectedGroup]);

  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesFilter = activeFilter === '전체' || group.category === activeFilter;
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            group.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            group.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [groups, activeFilter, searchQuery]);

  const formatPhoneNumber = (val: string) => {
    const numbers = val.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setApplicantPhone(formatted);
  };

  const handleInquiry = () => {
    if (!applicantName.trim() || applicantPhone.length < 12) {
      alert('성함과 유효한 연락처를 모두 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      alert(`[문의 완료]\n\n${selectedGroup?.name} 모임에 대한 참여 문의가 정상적으로 접수되었습니다.\n\n신청자: ${applicantName}\n연락처: ${applicantPhone}\n\n담당 리더(${selectedGroup?.leader})가 빠른 시일 내에 연락드리겠습니다.`);
      setSelectedGroup(null);
    }, 1000);
  };

  const isFormValid = applicantName.trim().length >= 2 && applicantPhone.length >= 12;

  // 필터 목록 구성 (전체 + 관리자가 등록한 카테고리들)
  const filterList = ['전체', ...categories.map(c => c.name)];

  return (
    <div className="flex flex-col gap-6 p-5 bg-[#F8FAFC] dark:bg-navy-dark min-h-full pb-24">
      
      {/* 검색 및 필터 바 */}
      <div className="flex flex-col gap-4 sticky top-0 z-20 bg-[#F8FAFC]/90 dark:bg-navy-dark/90 backdrop-blur-md py-2 -mx-5 px-5">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            placeholder="모임명, 리더, 지역 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-navy-accent border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/30 dark:text-white transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filterList.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-black transition-all shadow-sm border ${
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

      {/* 모임 리스트 */}
      <div className="flex flex-col gap-5">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <div 
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className="bg-white dark:bg-navy-accent p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98] group flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className={`w-fit text-[9px] font-black px-2 py-0.5 rounded shadow-sm bg-primary text-navy-dark`}>
                    {group.category}
                  </span>
                  <h4 className="text-navy-dark dark:text-white font-black text-lg group-hover:text-primary transition-colors">
                    {group.name}
                  </h4>
                </div>
                <div className="size-10 rounded-2xl bg-gray-50 dark:bg-navy-dark flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined filled text-xl">groups</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined text-sm">person</span>
                  리더: {group.leader}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  시간: {group.time}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  장소: {group.location}
                </div>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed font-medium line-clamp-2">
                {group.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {group.tags?.map(tag => (
                  <span key={tag} className="text-[9px] font-black text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center flex flex-col items-center gap-4 bg-white dark:bg-navy-accent rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10 shadow-inner">
            <span className="material-symbols-outlined text-5xl text-gray-200 dark:text-white/10">search_off</span>
            <p className="text-gray-400 font-bold text-sm">해당하는 소그룹 모임이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 모임 상세 모달 (기존 코드 유지) */}
      {selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedGroup(null)}></div>
          <div className="relative transform overflow-hidden rounded-[3rem] bg-white dark:bg-navy-dark text-left shadow-2xl transition-all w-full max-w-sm animate-in slide-in-from-bottom-10 duration-300 border border-gray-100 dark:border-white/10">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedGroup.category} 공동체</span>
                  <h4 className="text-2xl font-black text-navy-dark dark:text-white leading-tight">
                    {selectedGroup.name}
                  </h4>
                </div>
                <button 
                  onClick={() => setSelectedGroup(null)} 
                  className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-transform shrink-0"
                >
                  <span className="material-symbols-outlined text-gray-400">close</span>
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-navy-accent/50 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-white dark:bg-navy-dark flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined text-lg filled">stars</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Leader</span>
                        <span className="text-sm font-bold text-navy-dark dark:text-white">{selectedGroup.leader}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-white dark:bg-navy-dark flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined text-lg">history</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Schedule</span>
                        <span className="text-sm font-bold text-navy-dark dark:text-white">{selectedGroup.time}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-white dark:bg-navy-dark flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined text-lg">home_pin</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Place</span>
                        <span className="text-sm font-bold text-navy-dark dark:text-white">{selectedGroup.location}</span>
                    </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 px-1 mb-6">
                <h5 className="text-[10px] font-black text-navy-dark dark:text-white uppercase tracking-widest">About this group</h5>
                <p className="text-gray-600 dark:text-gray-400 text-[13px] leading-relaxed font-medium">
                  {selectedGroup.description}
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-8 bg-primary/5 p-5 rounded-[2rem] border border-primary/10">
                <h5 className="text-[10px] font-black text-primary uppercase tracking-widest text-center">참여 문의 정보</h5>
                <div className="flex flex-col gap-1.5">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary uppercase">이름</span>
                    <input 
                      type="text" 
                      placeholder="성함을 입력하세요"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full bg-white dark:bg-navy-dark border-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary uppercase">연락처</span>
                    <input 
                      type="tel" 
                      placeholder="010-0000-0000"
                      value={applicantPhone}
                      onChange={handlePhoneChange}
                      maxLength={13}
                      className="w-full bg-white dark:bg-navy-dark border-none rounded-xl pl-12 pr-4 py-2.5 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleInquiry}
                  disabled={!isFormValid || isSubmitting}
                  className={`flex-1 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${
                    isFormValid 
                      ? 'bg-navy-dark dark:bg-primary text-primary dark:text-navy-dark' 
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg filled">send</span>
                      모임 참여 문의하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
