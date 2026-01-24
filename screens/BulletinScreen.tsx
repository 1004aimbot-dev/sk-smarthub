
import React, { useState, useEffect } from 'react';
import { BulletinRecord } from '../types';

interface BulletinScreenProps {
  bulletins: BulletinRecord[];
}

export const BulletinScreen: React.FC<BulletinScreenProps> = ({ bulletins }) => {
  const [activeModal, setActiveModal] = useState<'ORDER' | 'NEWS' | 'PAST_DETAIL' | null>(null);
  const [selectedArchive, setSelectedArchive] = useState<BulletinRecord | null>(null);
  const [currentSunday, setCurrentSunday] = useState('');

  useEffect(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day; 
    const sunday = new Date(today.setDate(diff));
    
    setCurrentSunday(`${sunday.getFullYear()}년 ${sunday.getMonth() + 1}월 ${sunday.getDate()}일`);
  }, []);

  const worshipOrder = [
    { order: "개회찬송", title: "21장 (다 찬양하여라)", person: "다함께" },
    { order: "신앙고백", title: "사도신경", person: "다함께" },
    { order: "말씀선포", title: "너희는 세상의 빛이라", person: "이현용 담임목사" }
  ];

  const handleArchiveClick = (item: BulletinRecord) => {
    setSelectedArchive(item);
    setActiveModal('PAST_DETAIL');
  };

  return (
    <div className="flex flex-col p-5 gap-8 bg-[#F1F5F9] dark:bg-navy-dark min-h-full pb-24">
      <div className="text-center py-2">
        <h2 className="text-2xl font-black text-navy-dark dark:text-white tracking-tight">{currentSunday}</h2>
        <p className="text-gray-400 text-xs mt-1.5 font-bold uppercase tracking-widest">Lord's Day Worship</p>
      </div>

      <div className="bg-[#FAF7ED] dark:bg-navy-accent/50 rounded-[2.5rem] p-8 shadow-xl border border-primary/20 relative overflow-hidden group transition-all text-center">
          <p className="text-primary text-[10px] font-black tracking-widest uppercase mb-4">Weekly Word</p>
          <p className="text-navy-dark dark:text-white text-[1.25rem] font-black italic tracking-tight">
            "너희는 세상의 빛이라 산 위에 있는 동네가 숨겨지지 못할 것이요"
          </p>
          <p className="text-gray-500 text-xs mt-6 font-bold">마태복음 5:14 | 설교: 이현용 담임목사</p>
      </div>

      <div className="flex flex-col gap-5 mt-4">
        <h3 className="font-black text-xl text-navy-dark dark:text-white px-1">지난 주보 아카이브</h3>
        <div className="flex flex-col gap-4">
          {bulletins.map(item => (
            <div 
              key={item.id} 
              onClick={() => handleArchiveClick(item)}
              className="flex items-center gap-5 bg-white dark:bg-navy-accent p-5 rounded-[2.2rem] shadow-sm border border-gray-50 cursor-pointer group active:scale-[0.98] transition-all"
            >
              <div className="size-14 rounded-2xl bg-[#F8FAFC] dark:bg-navy-dark flex items-center justify-center text-primary shrink-0 border border-gray-100">
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-[16px] text-navy-dark dark:text-white">{item.date} 주일예배</p>
                <p className="text-[12px] font-bold text-gray-400 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeModal === 'PAST_DETAIL' && selectedArchive && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setActiveModal(null)}></div>
          <div className="relative transform overflow-hidden rounded-[3rem] bg-white dark:bg-navy-dark p-8 shadow-2xl w-full max-w-sm">
            <h4 className="text-2xl font-black text-navy-dark dark:text-white mb-2">{selectedArchive.date} 주보</h4>
            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 mt-6">
              {worshipOrder.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm py-2">
                  <span className="text-gray-400 font-bold">{item.order}</span>
                  <span className="text-navy-dark dark:text-white font-black">{item.title}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-navy-dark dark:bg-primary py-4 rounded-2xl text-primary dark:text-navy-dark font-black mt-10">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};
