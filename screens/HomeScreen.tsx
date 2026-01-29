
import React, { useState, useEffect } from 'react';
import { ViewType, PastorProfile, FloorData } from '../types';
import { DEFAULT_PASTOR_PROFILE, DEFAULT_FLOOR_DATA } from '../constants';

interface HomeScreenProps {
  setView: (view: ViewType) => void;
  pastorProfile: PastorProfile;
  floorData: FloorData[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ setView, pastorProfile, floorData }) => {
  const [selectedFloor, setSelectedFloor] = useState<FloorData | null>(null);
  const [isPastorModalOpen, setIsPastorModalOpen] = useState(false);
  // floorData state removed, receiving via props now

  // useEffect for loadData removed as data is now managed in App.tsx

  const handleLiveStream = () => alert('유튜브 실시간 예배 스트리밍 채널로 연결합니다.');

  return (
    <div className="flex flex-col gap-6 p-4 bg-[#F8FAFC] dark:bg-navy-dark min-h-full">
      {/* 히어로 섹션 */}
      <div
        className="relative h-64 rounded-3xl overflow-hidden bg-cover bg-center flex flex-col justify-end p-6 shadow-xl"
        style={{ backgroundImage: 'linear-gradient(to top, rgba(14,22,36,0.9), transparent), url(https://lh3.googleusercontent.com/aida-public/AB6AXuAtCrPYVF_ain851PfDjTj8WOZJkdhU6tXx2DPKTsntmeJ3jbkI4QO_qxp_B7bYLcMK8fGhr4T4Vzauhzw78VWBxZeNlQAcYVE_KmDCzaiv67Iqg0ZF7xgIdYMBJIi_MhJvZ0nh-LZXhafvNaEPd6z9-GpuLP0jsa3QeOmdGpzD5wKXAlHuw2PErCGvuu9Aaub7QFHeBqn2U5CeL_j8o5H3ukiGHMuThnfKu77VQLKshC5bT-JWyYelh-9gMp8XxXip0vgJ8r4oIJg)' }}
      >
        <div className="absolute top-5 right-5 bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-navy-dark animate-pulse shadow-lg">
          LIVE
        </div>
        <div className="z-10 flex flex-col gap-2">
          <h2 className="text-white text-2xl font-black leading-tight tracking-tight">하나님을 기쁘시게<br />사람을 행복하게</h2>
          <p className="text-gray-300 text-sm font-medium">성남신광교회 온라인 성전에 오신 여러분을 환영합니다.</p>
          <button
            onClick={handleLiveStream}
            className="mt-3 w-full bg-primary text-navy-dark font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined filled">play_circle</span>
            실시간 예배 참여하기
          </button>
        </div>
      </div>

      {/* 담임목사 인사말 섹션 */}
      <div
        onClick={() => setIsPastorModalOpen(true)}
        className="bg-white dark:bg-navy-accent rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-white/5 flex gap-5 items-center cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
      >
        <div className="size-20 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 shadow-lg bg-gray-50">
          <img src={pastorProfile.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="담임목사" />
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">GREETING</span>
            <div className="size-1 rounded-full bg-gray-200"></div>
            <span className="text-gray-400 text-[11px] font-bold">{pastorProfile.name}</span>
          </div>
          <h3 className="text-navy-dark dark:text-white font-black text-lg leading-tight truncate">담임목사 인사말</h3>
          <p className="text-gray-500 text-[11px] font-medium leading-relaxed line-clamp-2 italic">
            "{pastorProfile.quote}"
          </p>
        </div>
        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
      </div>

      {/* 비전센터 시설 안내 리스트 */}
      <div className="flex flex-col gap-3">
        <h3 className="text-navy-dark dark:text-white font-black text-lg px-1">비전센터 시설 안내</h3>
        <div className="flex flex-col gap-3">
          {floorData.map((data, idx) => (
            <FloorItem
              key={idx}
              floor={data.floor}
              title={data.title}
              desc={data.summary}
              icon={data.icon}
              onClick={() => setSelectedFloor(data)}
            />
          ))}
        </div>
      </div>

      {/* AI 성경 길잡이 봇 */}
      <div
        onClick={() => setView(ViewType.AI_CHAT)}
        className="relative overflow-hidden bg-gradient-to-br from-navy-dark to-navy-accent dark:from-navy-accent dark:to-navy-dark rounded-3xl p-6 shadow-lg border border-primary/20 cursor-pointer group transition-all active:scale-[0.98]"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
          <span className="material-symbols-outlined text-8xl text-primary">auto_awesome</span>
        </div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="size-16 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 text-primary shadow-inner">
            <span className="material-symbols-outlined text-4xl filled">menu_book</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-black text-xl">AI 성경 길잡이</h3>
              <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">BETA</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">말씀에 대한 궁금증, AI에게 물어보세요.</p>
          </div>
          <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
        </div>
      </div>

      {/* 공간 예약 카드 */}
      <div
        onClick={() => setView(ViewType.RESERVATION)}
        className="bg-white dark:bg-navy-accent rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-5 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all active:scale-[0.98] group"
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="text-navy-dark dark:text-white font-black text-xl group-hover:text-primary transition-colors">비전센터 공간예약</h3>
            <p className="text-gray-500 text-sm font-medium">소그룹 모임과 쉼을 위한 공간입니다.</p>
          </div>
          <div className="size-12 bg-[#FFF9E6] dark:bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl filled">calendar_month</span>
          </div>
        </div>
        <button
          className="w-full bg-navy-dark dark:bg-primary py-4 rounded-2xl text-white dark:text-navy-dark font-black text-sm shadow-xl active:scale-[0.97] transition-all hover:brightness-110"
        >
          예약 신청하기
        </button>
      </div>

      {/* Pastor Greeting Modal */}
      {isPastorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setIsPastorModalOpen(false)}></div>
          <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-navy-accent text-left shadow-2xl transition-all w-full max-w-sm animate-in slide-in-from-bottom-10 duration-300">
            <div className="relative h-64 w-full">
              <img src={pastorProfile.image} className="w-full h-full object-cover object-top" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-navy-accent via-transparent to-transparent"></div>
              <button
                onClick={() => setIsPastorModalOpen(false)}
                className="absolute top-4 right-4 size-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-8 pb-10 -mt-6 relative">
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-primary font-black text-[11px] uppercase tracking-[0.3em]">Welcome Message</span>
                <h4 className="text-2xl font-black text-navy-dark dark:text-white">{pastorProfile.name}</h4>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-2xl mb-6 italic">
                <p className="text-navy-dark dark:text-gray-200 text-sm font-bold leading-relaxed">
                  "{pastorProfile.quote}"
                </p>
              </div>
              <div className="max-h-60 overflow-y-auto no-scrollbar pr-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {pastorProfile.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floor Detail Modal */}
      {selectedFloor && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedFloor(null)}></div>
          <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-navy-accent text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm animate-in slide-in-from-bottom-10 duration-300 max-h-[85vh] flex flex-col">
            <div className="p-6 pb-2 border-b border-gray-100 dark:border-white/5 shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-primary font-black text-2xl">{selectedFloor.floor}</span>
                  <div className="flex flex-col">
                    <h4 className="text-lg font-black text-navy-dark dark:text-white leading-tight">{selectedFloor.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">시설을 터치하여 상세 내용을 확인하세요.</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFloor(null)} className="size-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400">close</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-4">
              <div className="flex flex-col gap-4">
                {selectedFloor.rooms.map((room, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-navy-dark/40 rounded-3xl p-5 border border-transparent hover:border-primary/20 transition-all flex flex-col gap-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-black text-sm">{room.no}</span>
                        <h5 className="text-navy-dark dark:text-white font-black text-base">{room.name}</h5>
                      </div>
                      <span className="material-symbols-outlined text-gray-300 group-hover:text-primary text-sm">info</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed font-medium">
                      {room.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {room.features.map((feature, fIdx) => (
                        <span key={fIdx} className="text-[9px] font-black text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-navy-dark/60 border-t border-gray-100 dark:border-white/5 shrink-0">
              <button
                onClick={() => {
                  setSelectedFloor(null);
                  setView(ViewType.RESERVATION);
                }}
                className="w-full bg-primary text-navy-dark font-black py-4 rounded-[1.5rem] shadow-lg active:scale-95 transition-all text-sm"
              >
                시설 및 대관 문의하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FloorItem: React.FC<{ floor: string; title: string; desc: string; icon: string; onClick: () => void }> = ({ floor, title, desc, icon, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 bg-white dark:bg-navy-accent p-4 rounded-2xl shadow-sm hover:shadow-md border border-gray-50 dark:border-white/5 transition-all cursor-pointer active:scale-[0.98]"
  >
    <div className="size-14 rounded-2xl bg-gray-50 dark:bg-navy-dark flex items-center justify-center text-navy-dark dark:text-primary shrink-0 border border-gray-100 dark:border-white/5 shadow-inner">
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="font-black text-base text-navy-dark dark:text-white">{floor} {title}</p>
        <span className="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
      </div>
      <p className="text-xs font-medium text-gray-400 truncate mt-0.5">{desc}</p>
    </div>
  </div>
);
