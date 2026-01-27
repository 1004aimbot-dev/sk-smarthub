
import React from 'react';

export const MapScreen: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#F1F5F9] dark:bg-navy-dark min-h-full">
      {/* 지도 영역 - 인터랙티브 지도와 하단 정보의 조화 */}
      <div className="relative h-[420px] bg-gray-200 overflow-hidden shadow-inner">
        {/* 구글 맵 임베드: 위치 정보를 명확히 하기 위해 q 파라미터가 포함된 형식을 사용합니다. */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3166.4168050965825!2d127.1424!3d37.4325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca9bc27c59573%3A0xe54e6097d6d370b!2z7Iug6rSR6rWQ7ZqM!5e0!3m2!1sko!2skr!4v1715400000000!5m2!1sko!2skr"
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale-[0.1] contrast-[1.1]"
        ></iframe>

        {/* 큰 지도 보기 버튼 (좌측 상단 - 스크린샷 스타일) */}
        <div className="absolute top-4 left-4">
          <button 
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=성남신광교회+성남시+중원구+둔촌대로+148')}
            className="bg-white px-4 py-2.5 rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.3)] text-[13px] font-bold text-[#565656] hover:bg-gray-50 active:scale-95 transition-all border border-gray-200"
          >
            큰 지도 보기
          </button>
        </div>

        {/* 내 위치 버튼 (우측 하단 부근 - 스크린샷 스타일) */}
        <div className="absolute bottom-44 right-4">
          <button 
            onClick={() => alert('현재 위치를 탐색합니다.')}
            className="size-10 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.3)] flex items-center justify-center text-primary active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined filled text-2xl">my_location</span>
          </button>
        </div>

        {/* 하단 다크 인포박스 (스크린샷 디자인 완벽 반영) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="bg-[#0E1624] rounded-2xl p-6 shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-white text-[22px] font-black mb-1.5 tracking-tight flex items-center gap-2">
              성남신광교회
            </h2>
            <p className="text-[#94A3B8] text-[13px] font-medium leading-relaxed mb-6">
              (13385) 경기도 성남시 중원구 둔촌대로 148 (하대원동)
            </p>
            
            <div className="flex gap-3">
              <a 
                href="tel:031-752-2603"
                className="flex-1 bg-white/10 hover:bg-white/15 py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/5"
              >
                <span className="material-symbols-outlined text-white text-xl">call</span>
                <span className="text-white font-bold text-sm">전화문의</span>
              </a>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: '성남신광교회 오시는 길',
                      text: '경기도 성남시 중원구 둔촌대로 148',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText('경기도 성남시 중원구 둔촌대로 148');
                    alert('주소가 복사되었습니다.');
                  }
                }}
                className="flex-1 bg-primary hover:bg-yellow-600 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-navy-dark text-xl filled">share</span>
                <span className="text-navy-dark font-black text-sm">위치공유</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 길찾기 플랫폼 연결부 및 상세 안내 */}
      <div className="p-5 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => window.open('https://map.kakao.com/link/search/성남신광교회')}
            className="bg-[#FAE100] text-[#3C1E1E] py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">map</span> 카카오맵
          </button>
          <button 
            onClick={() => window.open('https://map.naver.com/v5/search/성남신광교회')}
            className="bg-[#03C75A] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">explore</span> 네이버지도
          </button>
        </div>

        {/* 상세 안내 섹션 */}
        <section className="bg-white dark:bg-navy-accent rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined filled">directions_bus</span>
            </div>
            <h3 className="text-navy-dark dark:text-white font-black text-lg">대중교통 안내</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="font-black text-sm mb-2 dark:text-white flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary"></span>
                    지하철 이용 시
                </h4>
                <div className="pl-3.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F5A200] text-white text-[9px] font-black px-1.5 py-0.5 rounded">수인분당</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">모란역 2, 3번 출구 (버스 환승)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-50 dark:bg-white/5 w-full"></div>

            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="font-black text-sm mb-2 dark:text-white flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary"></span>
                    버스 이용 시
                </h4>
                <div className="pl-3.5">
                    <p className="text-xs text-navy-dark dark:text-white font-bold mb-2">하대원현대아파트 정류장 하차</p>
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-navy-dark px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-white/5">
                            <span className="bg-[#33CC99] text-white text-[8px] px-1 py-0.5 rounded font-bold">마을</span>
                            <span className="text-[11px] text-gray-600 dark:text-gray-400 font-black">3-3, 3-5, 3-6</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-navy-dark px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-white/5">
                            <span className="bg-[#3366CC] text-white text-[8px] px-1 py-0.5 rounded font-bold">간선</span>
                            <span className="text-[11px] text-gray-600 dark:text-gray-400 font-black">33, 55, 60, 100</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-navy-accent rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-white/5 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined filled">local_parking</span>
            </div>
            <h3 className="text-navy-dark dark:text-white font-black text-lg">주차 안내</h3>
          </div>
          <div className="bg-gray-50 dark:bg-navy-dark/40 p-4 rounded-2xl">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              교회 내 지상 및 지하 주차장 완비 (총 120대)<br/>
              <span className="text-xs text-primary font-bold mt-1 inline-block">* 주일에는 안내 봉사자의 지시를 따라주세요.</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
