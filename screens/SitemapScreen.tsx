
import React, { useState } from 'react';
import { ViewType } from '../types';

interface SitemapScreenProps {
  setView: (view: ViewType) => void;
}

type SectionKey = 'GREETING' | 'VISION' | 'PROGRAM' | 'HISTORY' | 'WORSHIP' | 'PEOPLE_PASTOR' | 'PEOPLE_ELDER' | null;

export const SitemapScreen: React.FC<SitemapScreenProps> = ({ setView }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>(null);
  const [isServingPeopleOpen, setIsServingPeopleOpen] = useState(false);

  const menuItems = [
    { label: '인사말', action: () => setActiveSection('GREETING') },
    { label: '비전·핵심가치', action: () => setActiveSection('VISION') },
    { label: '양육프로그램', action: () => setActiveSection('PROGRAM') },
    { label: '연혁', action: () => setActiveSection('HISTORY') },
    { 
      label: '섬기는사람들', 
      isExpandable: true,
      isOpen: isServingPeopleOpen,
      action: () => setIsServingPeopleOpen(!isServingPeopleOpen),
      subItems: [
        { label: '교역자', action: () => setActiveSection('PEOPLE_PASTOR') },
        { label: '장로', action: () => setActiveSection('PEOPLE_ELDER') }
      ]
    },
    { label: '예배안내', action: () => setActiveSection('WORSHIP') },
    { label: '오시는길', action: () => setView(ViewType.MAP) },
    { label: '관리자 페이지', isSpecial: true, action: () => setView(ViewType.ADMIN_LOGIN) },
  ];

  if (activeSection) {
    return (
      <div className="p-6 bg-white dark:bg-navy-dark min-h-full">
        <button 
          onClick={() => setActiveSection(null)}
          className="flex items-center gap-2 text-primary font-black mb-8 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          뒤로가기
        </button>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionContent type={activeSection} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-50 dark:bg-navy-dark min-h-full">
      <div className="mb-6 border-b-2 border-navy-dark dark:border-primary pb-2">
        <h3 className="text-navy-dark dark:text-white font-black text-xl tracking-tight">교회소개</h3>
      </div>
      <div className="bg-white dark:bg-navy-accent rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100 dark:border-white/5">
        {menuItems.map((item, idx) => (
          <div key={idx} className="border-b border-gray-50 dark:border-white/5 last:border-none">
            <button 
              onClick={item.action}
              className={`w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group ${item.isSpecial ? 'bg-primary/5' : ''}`}
            >
              <span className={`text-[17px] font-black group-hover:text-primary transition-colors ${item.isSpecial ? 'text-primary' : 'text-navy-dark dark:text-white'}`}>
                {item.label}
              </span>
              {!item.isExpandable && (
                <span className={`material-symbols-outlined transition-transform ${item.isSpecial ? 'text-primary' : 'text-gray-300'}`}>
                  {item.isSpecial ? 'admin_panel_settings' : 'chevron_right'}
                </span>
              )}
            </button>
            {item.isExpandable && item.isOpen && (
              <div className="bg-gray-50/50 dark:bg-black/10 py-2">
                {item.subItems?.map((sub, sIdx) => (
                  <button 
                    key={sIdx}
                    onClick={sub.action}
                    className="w-full text-left py-4 px-12 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary transition-all flex items-center gap-3"
                  >
                    <span className="text-primary/40 font-black text-xl">-</span>
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-10 text-center py-6 border-t border-gray-200 dark:border-white/5">
         <p className="text-[11px] text-gray-400 font-bold">성남신광교회 온라인 성전</p>
      </div>
    </div>
  );
};

const SectionContent: React.FC<{ type: SectionKey }> = ({ type }) => {
  switch (type) {
    case 'GREETING':
      return (
        <div className="space-y-6">
          <img src="https://raw.githubusercontent.com/1004aimbot-dev/images/main/이현용담임목사1.png" className="w-full rounded-3xl shadow-lg" alt="담임목사" />
          <h3 className="text-2xl font-black text-navy-dark">담임목사 인사말</h3>
          <p className="text-gray-600 leading-relaxed font-medium">하나님을 기쁘시게, 사람을 행복하게 하는 복된 공동체로 당신을 초대합니다.<br/><br/>할렐루야! 성남신광교회 홈페이지를 찾아주신 모든 분들을 주님의 이름으로 사랑하고 축복합니다.</p>
        </div>
      );
    case 'VISION':
      return (
        <div className="space-y-6">
          <div className="bg-primary/10 p-8 rounded-3xl text-center border border-primary/20">
            <h3 className="text-xl font-black text-primary mb-2">교회 비전</h3>
            <p className="text-navy-dark font-bold text-lg">"하나님을 기쁘시게, 사람을 행복하게"</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h4 className="font-black text-navy-dark mb-3 flex items-center gap-2">
               <span className="size-2 rounded-full bg-primary"></span> 핵심 가치
             </h4>
             <ul className="space-y-3 text-sm font-medium text-gray-600">
               <li>1. 예배의 감격이 있는 공동체</li>
               <li>2. 말씀과 훈련으로 성장하는 공동체</li>
               <li>3. 다음 세대를 세우는 공동체</li>
               <li>4. 지역 사회를 섬기는 공동체</li>
             </ul>
          </div>
        </div>
      );
    case 'WORSHIP':
      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-navy-dark">예배 안내</h3>
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-navy-dark text-white text-xs">
                <tr>
                  <th className="p-4">예배명</th>
                  <th className="p-4">시간</th>
                  <th className="p-4">장소</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-bold">
                <tr><td className="p-4">주일 1부</td><td className="p-4">09:00</td><td className="p-4">본당</td></tr>
                <tr><td className="p-4">주일 2부</td><td className="p-4">11:00</td><td className="p-4">본당</td></tr>
                <tr><td className="p-4">주일 3부</td><td className="p-4">13:30</td><td className="p-4">본당</td></tr>
                <tr><td className="p-4">수요예배</td><td className="p-4">19:30</td><td className="p-4">본당</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    default:
      return (
        <div className="py-20 text-center text-gray-400 font-bold">
          준비 중인 서비스입니다.
        </div>
      );
  }
};
