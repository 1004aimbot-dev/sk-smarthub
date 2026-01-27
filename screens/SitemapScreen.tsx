
import React, { useState } from 'react';
import { ViewType } from '../types';

interface SitemapScreenProps {
  setView: (view: ViewType) => void;
}

type SectionKey = 'GREETING' | 'VISION' | 'PROGRAM' | 'HISTORY' | 'WORSHIP' | 'PEOPLE_PASTOR' | 'PEOPLE_ELDER' | 'BULLETIN_ARCHIVE' | null;

export const SitemapScreen: React.FC<SitemapScreenProps> = ({ setView }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>(null);
  const [isServingPeopleOpen, setIsServingPeopleOpen] = useState(false);

  const menuItems = [
    { label: '인사말', action: () => setActiveSection('GREETING') },
    { label: '비전·핵심가치', action: () => setActiveSection('VISION') },
    { label: '온라인 주보', action: () => setView(ViewType.BULLETIN) },
    { label: '양육프로그램', action: () => setView(ViewType.PROGRAM) },
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
      <div className="p-6 bg-white dark:bg-navy-dark min-h-full pb-20">
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

export const SectionContent: React.FC<{ type: SectionKey }> = ({ type }) => {
  switch (type) {
    case 'GREETING':
      return (
        <div className="space-y-6">
          <img src="https://raw.githubusercontent.com/1004aimbot-dev/images/main/leehy.png" className="w-full rounded-3xl shadow-lg border-2 border-primary/10" alt="담임목사" />
          <h3 className="text-2xl font-black text-navy-dark dark:text-white">담임목사 인사말</h3>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            <p className="text-navy-dark dark:text-white font-black text-lg">"하나님을 기쁘시게, 사람을 행복하게"</p>
            <p>할렐루야! 성남신광교회 홈페이지를 찾아주신 모든 분들을 주님의 이름으로 사랑하고 축복합니다.</p>
            <p>우리 교회는 복음의 능력으로 세상을 치유하고, 다음 세대를 믿음의 거목으로 키우며, 지역 사회에 그리스도의 사랑을 흘려보내는 거룩한 사명을 감당하고 있습니다.</p>
            <p>이곳이 여러분의 영혼이 쉼을 얻고, 말씀 안에서 새로운 소망을 발견하는 은혜의 통로가 되기를 간절히 소망합니다.</p>
            <p className="text-right font-black mt-8 text-navy-dark dark:text-white">성남신광교회 담임목사 이현용</p>
          </div>
        </div>
      );

    case 'PROGRAM':
      const programs = [
        { cat: "기초단계", title: "새가족 확신반", desc: "기독교 신앙의 핵심과 구원의 확신을 정립하는 5주 과정", icon: "verified_user" },
        { cat: "성장단계", title: "성경성장반", desc: "그리스도인으로서의 삶의 원리와 성경적 가치관 확립", icon: "trending_up" },
        { cat: "훈련단계", title: "제자훈련", desc: "예수 그리스도를 닮아가는 철저한 훈련과 헌신의 과정", icon: "model_training" },
        { cat: "사역단계", title: "사역훈련", desc: "교회의 지체로서 은사를 발견하고 사역자로 세워지는 과정", icon: "volunteer_activism" },
        { cat: "특별과정", title: "마더와이즈 / 부부학교", desc: "가정의 회복과 성경적 부모 교육을 위한 특화 프로그램", icon: "family_restroom" }
      ];
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-navy-dark dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary filled">school</span>
            양육 프로그램
          </h3>
          <div className="flex flex-col gap-4">
            {programs.map((p, i) => (
              <div key={i} className="bg-gray-50 dark:bg-navy-accent p-6 rounded-3xl border border-gray-100 dark:border-white/5 flex gap-4 group">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">{p.icon}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{p.cat}</span>
                  <h4 className="font-black text-navy-dark dark:text-white text-base">{p.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'HISTORY':
      const history = [
        { year: "2020 ~ 현재", items: ["비전센터 스마트 시스템 도입", "이현용 담임목사 부임 (2020.01)", "온라인 성전 강화 및 미디어 사역 확장"] },
        { year: "2010 ~ 2019", items: ["교회 설립 30주년 기념 감사예배", "지역 사회 섬김을 위한 카페 '로뎀나무' 오픈", "해외 선교지(캄보디아, 몽골) 지교회 설립"] },
        { year: "2000 ~ 2009", items: ["신축 성전 비전홀 봉헌식", "전교인 제자훈련 시스템 정착", "사회복지법인 협력 지역 구제 사업 시작"] },
        { year: "1990 ~ 1999", items: ["성남신광교회 창립 및 첫 예배 (1990.05)", "제1대 담임목사 취임", "초대 장로 장립 및 제직회 조직"] }
      ];
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-navy-dark dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary filled">history</span>
            교회 연혁
          </h3>
          <div className="relative pl-6 space-y-12">
            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-white/10"></div>
            {history.map((h, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[29px] top-1.5 size-4 rounded-full bg-primary border-4 border-white dark:border-navy-dark shadow-sm"></div>
                <h4 className="text-lg font-black text-primary mb-4">{h.year}</h4>
                <ul className="space-y-3">
                  {h.items.map((item, idx) => (
                    <li key={idx} className="text-sm font-bold text-navy-dark dark:text-gray-300 flex items-start gap-2">
                      <span className="text-primary font-black mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );

    case 'PEOPLE_PASTOR':
      const pastors = [
        { role: "담임목사", name: "이현용", dept: "교회 총괄", img: "https://raw.githubusercontent.com/1004aimbot-dev/images/main/leehy.png" },
        { role: "부목사", name: "김은혜", dept: "교구 및 행정", img: "https://picsum.photos/seed/pastor1/200/200" },
        { role: "부목사", name: "박사랑", dept: "교육 및 양육", img: "https://picsum.photos/seed/pastor2/200/200" },
        { role: "교육전도사", name: "최믿음", dept: "초등부 및 청소년부", img: "https://picsum.photos/seed/pastor3/200/200" }
      ];
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-navy-dark dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary filled">diversity_3</span>
            섬기는 사람들 - 교역자
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {pastors.map((p, i) => (
              <div key={i} className="bg-white dark:bg-navy-accent rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center text-center group">
                <div className="size-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20 group-hover:border-primary transition-colors">
                  <img src={p.img} className="w-full h-full object-cover" alt={p.name} />
                </div>
                <span className="text-[10px] font-black text-primary mb-1">{p.role}</span>
                <h4 className="text-base font-black text-navy-dark dark:text-white mb-1">{p.name} 목사</h4>
                <p className="text-[10px] text-gray-400 font-bold">{p.dept}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'PEOPLE_ELDER':
      const elders = ["김대장", "이충성", "박온유", "최믿음", "정신실", "윤기도", "강사랑", "한소망"];
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-navy-dark dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary filled">military_tech</span>
            섬기는 사람들 - 장로
          </h3>
          <div className="bg-gray-50 dark:bg-navy-accent p-8 rounded-[3rem] border border-gray-100 dark:border-white/5">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {elders.map((name, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-primary"></div>
                  <span className="text-base font-black text-navy-dark dark:text-white">{name} <span className="text-xs font-bold text-gray-400">장로</span></span>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
              <p className="text-xs text-gray-400 font-bold italic">"오직 주와 복음을 위해 헌신하는 성남신광교회 당회"</p>
            </div>
          </div>
        </div>
      );

    case 'VISION':
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-navy-dark dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary filled">auto_awesome</span>
            비전·핵심가치
          </h3>
          <div className="bg-gradient-to-br from-navy-dark to-navy-accent p-10 rounded-[3rem] text-center border-b-8 border-primary shadow-2xl">
            <h3 className="text-primary font-black text-sm mb-4 uppercase tracking-[0.3em]">Our Vision</h3>
            <p className="text-white font-black text-2xl leading-tight">
              "하나님을 기쁘시게,<br/>사람을 행복하게"
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-6">
            {[
              { title: "예배 중심", desc: "살아있는 예배를 통해 하나님의 임재를 경험합니다." },
              { title: "제자 양육", desc: "말씀 훈련을 통해 예수의 제자로 성장합니다." },
              { title: "사명 감당", desc: "지역 사회와 열방을 향해 복음을 전파합니다." }
            ].map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="font-black text-navy-dark mb-2 flex items-center gap-2 text-base">
                  <span className="size-2 rounded-full bg-primary"></span> {v.title}
                </h4>
                <p className="text-sm font-medium text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'WORSHIP':
      return (
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-navy-dark dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary filled">menu_book</span>
            예배 안내
          </h3>
          <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-xl bg-white">
            <table className="w-full text-left">
              <thead className="bg-navy-dark text-white text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="p-5">예배명</th>
                  <th className="p-5">시간</th>
                  <th className="p-5">장소</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-bold">
                <tr className="hover:bg-gray-50"><td className="p-5">주일 1부</td><td className="p-5 text-primary">09:00</td><td className="p-5">대예배당</td></tr>
                <tr className="hover:bg-gray-50"><td className="p-5">주일 2부</td><td className="p-5 text-primary">11:00</td><td className="p-5">대예배당</td></tr>
                <tr className="hover:bg-gray-50"><td className="p-5">주일 3부</td><td className="p-5 text-primary">13:30</td><td className="p-5">대예배당</td></tr>
                <tr className="hover:bg-gray-50"><td className="p-5">주일 오후</td><td className="p-5 text-primary">15:00</td><td className="p-5">대예배당</td></tr>
                <tr className="hover:bg-gray-50 bg-gray-50/50"><td className="p-5">수요예배</td><td className="p-5 text-primary">19:30</td><td className="p-5">대예배당</td></tr>
                <tr className="hover:bg-gray-50 bg-gray-50/50"><td className="p-5">금요성령</td><td className="p-5 text-primary">20:30</td><td className="p-5">대예배당</td></tr>
                <tr className="hover:bg-gray-50"><td className="p-5">새벽기도</td><td className="p-5 text-primary">05:30</td><td className="p-5">비전홀</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return (
        <div className="py-20 text-center flex flex-col items-center gap-4 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <span className="material-symbols-outlined text-5xl text-gray-300">construction</span>
          <p className="text-gray-400 font-black">현재 상세 내용을 업데이트 중입니다.</p>
        </div>
      );
  }
};
