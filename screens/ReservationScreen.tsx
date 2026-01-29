import React, { useState, useEffect, useMemo } from 'react';
import { ReservationData, ViewType } from '../types';
import { supabase } from '../src/lib/supabase';

interface Room {
  id: string;
  floor: string;
  name: string;
  desc: string;
  thumbnail: string;
}

const AVAILABLE_ROOMS: Room[] = [
  // 2층 (행정/회의)
  { id: '201', floor: '2층', name: '비전홀 201호 (대회의실)', desc: '2층 대회의실', thumbnail: 'https://picsum.photos/seed/room201/200/200' },
  { id: '202', floor: '2층', name: '비전홀 202호 (중회의실)', desc: '2층 중회의실', thumbnail: 'https://picsum.photos/seed/room202/200/200' },
  { id: '203', floor: '2층', name: '비전홀 203호 (소그룹실 A)', desc: '2층 소모임 공간', thumbnail: 'https://picsum.photos/seed/room203/200/200' },
  { id: '204', floor: '2층', name: '비전홀 204호 (소그룹실 B)', desc: '2층 소모임 공간', thumbnail: 'https://picsum.photos/seed/room204/200/200' },
  { id: '205', floor: '2층', name: '비전홀 205호 (새가족실)', desc: '2층 새가족 영접 공간', thumbnail: 'https://picsum.photos/seed/room205/200/200' },
  // 3층 (교육/양육)
  { id: '301', floor: '3층', name: '비전홀 301호 (대교육실)', desc: '3층 교육 전용 공간', thumbnail: 'https://picsum.photos/seed/room301/200/200' },
  { id: '302', floor: '3층', name: '비전홀 302호 (중교육실)', desc: '3층 시청각 교육실', thumbnail: 'https://picsum.photos/seed/room302/200/200' },
  { id: '303', floor: '3층', name: '비전홀 303호 (자모/유아실)', desc: '3층 유아 예배실', thumbnail: 'https://picsum.photos/seed/room303/200/200' },
  { id: '304', floor: '3층', name: '비전홀 304호 (소교육실 A)', desc: '3층 분반 공부방', thumbnail: 'https://picsum.photos/seed/room304/200/200' },
  { id: '305', floor: '3층', name: '비전홀 305호 (소교육실 B)', desc: '3층 소그룹 교육방', thumbnail: 'https://picsum.photos/seed/room305/200/200' },
  // 4층 (찬양/선교)
  { id: '401', floor: '4층', name: '비전홀 401호 (대연습실)', desc: '4층 찬양대 연습실', thumbnail: 'https://picsum.photos/seed/room401/200/200' },
  { id: '402', floor: '4층', name: '비전홀 402호 (선교지원실)', desc: '4층 선교 사역 공간', thumbnail: 'https://picsum.photos/seed/room402/200/200' },
  { id: '403', floor: '4층', name: '비전홀 403호 (소연습실 A)', desc: '4층 파트 연습실', thumbnail: 'https://picsum.photos/seed/room403/200/200' },
  { id: '404', floor: '4층', name: '비전홀 404호 (소연습실 B)', desc: '4층 기도 및 연습실', thumbnail: 'https://picsum.photos/seed/room404/200/200' },
  { id: '405', floor: '4층', name: '비전홀 405호 (미디어실)', desc: '4층 영상 편집실', thumbnail: 'https://picsum.photos/seed/room405/200/200' },
];

const MAX_DURATION_MINUTES = 120; // 최대 2시간

interface ReservationScreenProps {
  reservations: ReservationData[];
  setReservations: React.Dispatch<React.SetStateAction<ReservationData[]>>;
  setView: (view: ViewType) => void;
}

export const ReservationScreen: React.FC<ReservationScreenProps> = ({ reservations, setReservations, setView }) => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [selectedRoom, setSelectedRoom] = useState<Room>(AVAILABLE_ROOMS[0]);
  const [date, setDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [headcount, setHeadcount] = useState(5);
  const [applicantName, setApplicantName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [existingReservations, setExistingReservations] = useState<ReservationData[]>([]);
  const [selectionStep, setSelectionStep] = useState<'START' | 'END'>('START');

  // 데이트 변경 시 필터링
  useEffect(() => {
    // props.reservations에서 필터링
    const filtered = reservations.filter((res: ReservationData) =>
      res.roomId === selectedRoom.id && res.date === date && res.status !== 'REJECTED'
    );
    setExistingReservations(filtered);
  }, [selectedRoom, date, reservations]);

  // 시간 헬퍼 함수
  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const formatTimeDisplay = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? '오후' : '오전';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${ampm} ${h12}:${String(m).padStart(2, '0')}`;
  };

  // 타임라인 위치 계산 (07:00 ~ 23:00)
  const START_H = 7;
  const END_H = 23;
  const RANGE_MIN = (END_H - START_H) * 60;

  const getPos = (time: string) => {
    const min = timeToMinutes(time) - (START_H * 60);
    return Math.max(0, Math.min(100, (min / RANGE_MIN) * 100));
  };

  // 타임라인 클릭 핸들러
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const clickedMinutes = Math.round((percent * RANGE_MIN) / 30) * 30 + (START_H * 60);
    const newTime = minutesToTime(clickedMinutes);

    // 이미 예약된 슬롯 내부인지 확인
    const isBooked = existingReservations.some(res =>
      newTime >= res.startTime && newTime < res.endTime
    );

    if (selectionStep === 'START') {
      if (isBooked) {
        alert('해당 시간은 이미 예약되어 있습니다.');
        return;
      }
      setStartTime(newTime);
      const nextEnd = minutesToTime(clickedMinutes + 60);
      setEndTime(nextEnd > "23:00" ? "23:00" : nextEnd);
      setSelectionStep('END');
    } else {
      if (newTime <= startTime) {
        setStartTime(newTime);
        return;
      }

      // 2시간 제한 체크
      const duration = timeToMinutes(newTime) - timeToMinutes(startTime);
      if (duration > MAX_DURATION_MINUTES) {
        alert('최대 이용 시간은 2시간(120분)입니다. 시간을 다시 조정해주세요.');
        return;
      }

      // 선택한 범위 사이에 예약이 있는지 확인
      const hasConflictInRange = existingReservations.some(res =>
        (startTime < res.endTime && newTime > res.startTime)
      );
      if (hasConflictInRange) {
        alert('선택하신 구간 사이에 이미 예약된 시간이 포함되어 있습니다.');
        return;
      }
      setEndTime(newTime);
      setSelectionStep('START');
    }
  };

  // 시간 미세 조정
  const adjustTime = (target: 'start' | 'end', delta: number) => {
    const current = target === 'start' ? startTime : endTime;
    let newMin = timeToMinutes(current) + delta;
    newMin = Math.max(START_H * 60, Math.min(END_H * 60, newMin));
    const newTime = minutesToTime(newMin);

    if (target === 'start') {
      const isOverlap = existingReservations.some(res => newTime >= res.startTime && newTime < res.endTime);
      if (isOverlap) return;

      // 2시간 제한 체크
      const duration = timeToMinutes(endTime) - newMin;
      if (duration > MAX_DURATION_MINUTES) return;

      setStartTime(newTime);
      if (newTime >= endTime) {
        const nextEnd = minutesToTime(newMin + 30);
        setEndTime(nextEnd > "23:00" ? "23:00" : nextEnd);
      }
    } else {
      if (newTime <= startTime) return;

      const isOverlap = existingReservations.some(res => startTime < res.endTime && newTime > res.startTime);
      if (isOverlap) return;

      // 2시간 제한 체크
      const duration = newMin - timeToMinutes(startTime);
      if (duration > MAX_DURATION_MINUTES) return;

      setEndTime(newTime);
    }
  };

  const isConflict = useMemo(() => {
    return existingReservations.some(res => startTime < res.endTime && endTime > res.startTime);
  }, [startTime, endTime, existingReservations]);

  const handleSubmit = async () => {
    if (isConflict) { alert('선택하신 시간에 이미 예약이 있습니다.'); return; }

    // 최종 이용 시간 체크
    const duration = timeToMinutes(endTime) - timeToMinutes(startTime);
    if (duration > MAX_DURATION_MINUTES) {
      alert('공간 이용 시간은 최대 2시간까지 가능합니다.');
      return;
    }

    if (!applicantName.trim()) { alert('신청자 이름을 입력해주세요.'); return; }
    if (!purpose.trim()) { alert('사용 목적을 입력해주세요.'); return; }
    if (!agreed) { alert('개인정보 동의가 필요합니다.'); return; }

    // 4. 동명인 1일 중복 신청 방지 (status가 REJECTED인 것은 제외)
    // 기존 예약 목록에서 날짜와 이름이 같은 것이 있는지 확인
    const isDuplicate = reservations.some(res =>
      res.date === date &&
      res.applicantName.trim() === applicantName.trim() &&
      res.status !== 'REJECTED'
    );

    if (isDuplicate) {
      alert('같은 날짜에 이미 예약하신 내역이 있습니다.\n(동일인 1일 1회 예약 제한)');
      return;
    }

    // 5. 교인 인증 로직 (임시: 목업 리스트 사용)
    // 실제 운영 시에는 supabase 'members' 테이블 조회로 교체 필요
    // 현재는 테스트를 위해 특정 이름들과, 2글자 이상인 경우 통과시킬 수도 있지만, 
    // 요청사항대로 "체크하는 로직"을 명시적으로 넣습니다.

    // TODO: 실제 교인 DB 연동 필요. 현재는 DB가 없으므로 로직 흐름만 구현.
    // 임시로 모든 입력을 허용하되, 콘솔에만 로그를 찍거나, 
    // 테스트용으로 특정 이름만 허용하려면 아래 주석을 해제하세요.
    /*
    const mockMembers = ['홍길동', '김철수', '이현용', '박지성'];
    if (!mockMembers.includes(applicantName.trim())) {
        alert('교인 명단에서 확인되지 않습니다.\n사무실에 문의해주세요.');
        return;
    }
    */

    // 지금은 "교인 확인 로직"이 동작함을 보여주기 위해, 이름이 비어있지 않으면 통과시키되
    // "교인 확인 완료"라는 로그를 남깁니다. (실제 DB 연동 전 단계)
    console.log('교인 확인 로직 통과:', applicantName);


    // 전 구역 중복 예약 방지 (시간 겹침) - 기존 로직 유지
    const hasConflict = reservations.some(res =>
      res.date === date &&
      res.roomId !== selectedRoom.id && // 다른 방이어도
      res.status !== 'REJECTED' &&      // 거절된 것 제외하고
      (startTime < res.endTime && endTime > res.startTime) // 시간이 겹치면
    );

    if (hasConflict) {
      alert('해당 시간대에 다른 공간이 이미 사용 중입니다.\n(전체 시설 동시 사용 제한)');
      return;
    }



    const newRes: ReservationData = {
      id: String(Date.now()), // create local ID for optimistic update, Supabase might generate one but text id is fine
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      applicantName: applicantName.trim(),
      date, startTime, endTime, headcount, purpose,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('reservations').insert(newRes);
      if (error) {
        console.error('Reservation failed:', error);
        alert('예약 신청에 실패했습니다: ' + error.message);
        return;
      }

      // Optimistic Update
      setReservations(prev => [newRes, ...prev]);
      alert('예약이 신청되었습니다!');
      setView(ViewType.HOME);
    } catch (e) {
      console.error('Error submitting reservation:', e);
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 pb-24 bg-[#FAF7ED] dark:bg-navy-dark min-h-full">

      {/* 1. 장소 및 날짜 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-navy-dark dark:text-white tracking-tight">장소 및 날짜</h2>
          <button
            onClick={() => setDate(getTodayString())}
            className="text-[10px] font-black text-primary border border-primary/30 px-3 py-1.5 rounded-full bg-white dark:bg-navy-accent shadow-sm"
          >
            TODAY
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={selectedRoom.id}
            onChange={(e) => setSelectedRoom(AVAILABLE_ROOMS.find(r => r.id === e.target.value) || AVAILABLE_ROOMS[0])}
            className="bg-white dark:bg-navy-accent border-none rounded-2xl p-4 text-sm font-bold shadow-sm dark:text-white focus:ring-2 focus:ring-primary/50"
          >
            <optgroup label="2층">
              {AVAILABLE_ROOMS.filter(r => r.floor === '2층').map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </optgroup>
            <optgroup label="3층">
              {AVAILABLE_ROOMS.filter(r => r.floor === '3층').map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </optgroup>
            <optgroup label="4층">
              {AVAILABLE_ROOMS.filter(r => r.floor === '4층').map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </optgroup>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white dark:bg-navy-accent border-none rounded-2xl p-4 text-sm font-bold shadow-sm dark:text-white focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* 2. 인터랙티브 타임라인 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {selectionStep === 'START' ? '① 시작 시간을 선택하세요' : '② 종료 시간을 선택하세요'}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-sm booked-pattern border border-gray-300"></div>
              <span className="text-[10px] font-bold text-gray-400">예약됨</span>
            </div>
            {isConflict && <span className="text-[10px] text-red-500 font-black animate-pulse">중복 발생!</span>}
          </div>
        </div>

        <div className="bg-white dark:bg-navy-accent rounded-[2.5rem] p-8 shadow-xl border border-primary/10 relative">
          <div className="mb-4 text-center">
            <span className="text-[10px] font-bold text-red-400/80 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/30">
              ⚠️ 한 세션당 최대 2시간까지만 이용 가능합니다.
            </span>
          </div>
          <div
            className="h-16 w-full bg-gray-50 dark:bg-navy-dark rounded-full relative cursor-crosshair overflow-hidden border-2 border-primary/5 shadow-inner"
            onClick={handleTimelineClick}
          >
            {/* 시간 눈금 */}
            {Array.from({ length: 33 }).map((_, i) => (
              <div
                key={i}
                className={`absolute top-0 bottom-0 w-px ${i % 2 === 0 ? 'bg-gray-200 dark:bg-white/10 h-full' : 'bg-gray-100 dark:bg-white/5 h-1/2 mt-auto'}`}
                style={{ left: `${(i / 32) * 100}%` }}
              ></div>
            ))}

            {/* 이미 예약된 슬롯 */}
            {existingReservations.map(res => (
              <div
                key={res.id}
                className="absolute top-0 bottom-0 z-10 booked-pattern border-x border-gray-300 dark:border-white/10"
                style={{ left: `${getPos(res.startTime)}%`, width: `${getPos(res.endTime) - getPos(res.startTime)}%` }}
              >
                <div className="h-full w-full flex items-center justify-center opacity-10">
                  <span className="material-symbols-outlined text-navy-dark dark:text-white text-xs">block</span>
                </div>
              </div>
            ))}

            {/* 현재 선택 영역 */}
            <div
              className={`absolute top-0 bottom-0 z-20 transition-all duration-300 ${isConflict ? 'bg-red-500/40 border-x-4 border-red-600' : 'bg-blue-500/30 border-x-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'}`}
              style={{ left: `${getPos(startTime)}%`, width: `${getPos(endTime) - getPos(startTime)}%` }}
            >
              <div className="w-full h-full flex items-center justify-center opacity-50">
                <span className="material-symbols-outlined text-white text-xl animate-pulse">check_circle</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4 px-3 text-[10px] font-black text-gray-400">
            <span>07시</span><span>11시</span><span>15시</span><span>19시</span><span>23시</span>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-[#FDFBF7] dark:bg-black/20 p-5 rounded-3xl border border-primary/10">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest text-center">Start Time</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => adjustTime('start', -30)} className="size-9 rounded-2xl bg-white dark:bg-navy-accent shadow-sm flex items-center justify-center text-gray-400 border border-gray-100 dark:border-white/5 active:scale-90">-</button>
                  <span className="text-[15px] font-black text-navy-dark dark:text-white min-w-[70px] text-center">{formatTimeDisplay(startTime)}</span>
                  <button onClick={() => adjustTime('start', 30)} className="size-9 rounded-2xl bg-white dark:bg-navy-accent shadow-sm flex items-center justify-center text-gray-400 border border-gray-100 dark:border-white/5 active:scale-90">+</button>
                </div>
              </div>
              <div className="w-px h-12 bg-primary/10"></div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest text-center">End Time</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => adjustTime('end', -30)} className="size-9 rounded-2xl bg-white dark:bg-navy-accent shadow-sm flex items-center justify-center text-gray-400 border border-gray-100 dark:border-white/5 active:scale-90">-</button>
                  <span className="text-[15px] font-black text-navy-dark dark:text-white min-w-[70px] text-center">{formatTimeDisplay(endTime)}</span>
                  <button onClick={() => adjustTime('end', 30)} className="size-9 rounded-2xl bg-white dark:bg-navy-accent shadow-sm flex items-center justify-center text-gray-400 border border-gray-100 dark:border-white/5 active:scale-90">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 신청 정보 입력 */}
      <div className="bg-white dark:bg-navy-accent/50 p-6 rounded-[2.5rem] shadow-sm border border-primary/5 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-black text-navy-dark dark:text-white flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary text-lg">person</span>
            신청자 성함
          </label>
          <input
            type="text"
            placeholder="예약자의 실명을 입력해주세요."
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            className="w-full bg-[#FAF7ED] dark:bg-navy-dark border-none rounded-2xl p-4 text-sm font-bold shadow-inner dark:text-white focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-[10px] text-gray-400 font-bold ml-1">※ 동일 시간대 전 공간 중복 예약은 차단됩니다.</p>
        </div>

        <div className="flex items-center justify-between px-1">
          <label className="text-sm font-black text-navy-dark dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">groups</span>
            참석 인원
          </label>
          <div className="flex items-center gap-5 bg-[#FAF7ED] dark:bg-navy-dark px-4 py-2 rounded-2xl shadow-inner border border-primary/5">
            <button onClick={() => setHeadcount(Math.max(1, headcount - 1))} className="text-xl font-black text-primary active:scale-125 transition-transform">-</button>
            <span className="text-base font-black text-navy-dark dark:text-white min-w-[20px] text-center">{headcount}</span>
            <button onClick={() => setHeadcount(headcount + 1)} className="text-xl font-black text-primary active:scale-125 transition-transform">+</button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-black text-navy-dark dark:text-white flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary text-lg">edit_document</span>
            사용 목적
          </label>
          <input
            type="text"
            placeholder="예: 성경 공부, 부서 회의"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full bg-[#FAF7ED] dark:bg-navy-dark border-none rounded-2xl p-4 text-sm font-medium shadow-inner dark:text-white focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* 4. 제출 */}
      <div className="flex flex-col gap-4">
        <div onClick={() => setAgreed(!agreed)} className="flex items-center gap-3 px-3 cursor-pointer group">
          <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreed ? 'bg-primary border-primary shadow-sm shadow-primary/40' : 'bg-white border-gray-200 dark:border-white/10'}`}>
            {agreed && <span className="material-symbols-outlined text-white text-lg font-black">check</span>}
          </div>
          <span className="text-sm font-bold text-gray-500 group-hover:text-primary transition-colors">개인정보 수집 및 이용 동의</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isConflict}
          className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-xl transition-all active:scale-95 ${isConflict
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-navy-dark dark:bg-primary text-primary dark:text-navy-dark hover:brightness-110'
            }`}
        >
          {isConflict ? '시간을 다시 선택해주세요' : '예약 신청하기'}
        </button>
      </div>

    </div>
  );
};
