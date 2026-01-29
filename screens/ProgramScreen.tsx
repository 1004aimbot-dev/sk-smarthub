
import React, { useState } from 'react';
import { ProgramBatch } from '../types';

interface ProgramScreenProps {
  batches: ProgramBatch[];
  setBatches: React.Dispatch<React.SetStateAction<ProgramBatch[]>>;
}

const PROGRAM_INFO = [
  { cat: "기초단계", title: "새가족 확신반", desc: "기독교 신앙의 핵심과 구원의 확신을 정립하는 5주 과정", icon: "verified_user" },
  { cat: "성장단계", title: "성경성장반", desc: "그리스도인으로서의 삶의 원리와 성경적 가치관 확립", icon: "trending_up" },
  { cat: "훈련단계", title: "제자훈련", desc: "예수 그리스도를 닮아가는 철저한 훈련과 헌신의 과정", icon: "model_training" },
  { cat: "사역단계", title: "사역훈련", desc: "교회의 지체로서 은사를 발견하고 사역자로 세워지는 과정", icon: "volunteer_activism" },
  { cat: "특별과정", title: "마더와이즈 / 부부학교", desc: "가정의 회복과 성경적 부모 교육을 위한 특화 프로그램", icon: "family_restroom" }
];

export const ProgramScreen: React.FC<ProgramScreenProps> = ({ batches, setBatches }) => {
  const [selectedProgram, setSelectedProgram] = useState<typeof PROGRAM_INFO[0] | null>(null);
  const [editModal, setEditModal] = useState<ProgramBatch | null>(null);
  const [newParticipant, setNewParticipant] = useState('');
  const [newParticipantRole, setNewParticipantRole] = useState('');

  const filteredBatches = batches.filter(b => b.programId === selectedProgram?.title);

  const handleDelete = (id: string) => {
    if (!window.confirm('기수 정보를 삭제하시겠습니까?')) return;
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  const handleSave = () => {
    if (!editModal) return;
    if (editModal.id) {
      setBatches(prev => prev.map(b => b.id === editModal.id ? editModal : b));
    } else {
      setBatches(prev => [{ ...editModal, id: String(Date.now()) }, ...prev]);
    }
    setEditModal(null);
  };

  const addParticipant = () => {
    if (!newParticipant.trim() || !editModal) return;
    const formattedName = newParticipantRole.trim()
      ? `${newParticipant.trim()} (${newParticipantRole.trim()})`
      : newParticipant.trim();

    if (editModal.participants.includes(formattedName)) {
      alert('이미 등록된 이름입니다.');
      return;
    }
    setEditModal({
      ...editModal,
      participants: [...editModal.participants, formattedName]
    });
    setNewParticipant('');
    setNewParticipantRole('');
  };

  const removeParticipant = (name: string) => {
    if (!editModal) return;
    setEditModal({
      ...editModal,
      participants: editModal.participants.filter(p => p !== name)
    });
  };

  if (selectedProgram) {
    return (
      <div className="flex flex-col gap-6 p-6 animate-in slide-in-from-right duration-300 pb-24">
        <button onClick={() => setSelectedProgram(null)} className="flex items-center gap-2 text-primary font-black mb-2 self-start active:scale-95 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
          전체 리스트로
        </button>

        <div className="bg-white dark:bg-navy-accent p-8 rounded-[2.5rem] border-2 border-primary/20 shadow-xl">
          <span className="text-primary text-[10px] font-black tracking-widest uppercase">{selectedProgram.cat}</span>
          <h3 className="text-2xl font-black text-navy-dark dark:text-white mt-1">{selectedProgram.title}</h3>
          <p className="text-xs text-gray-500 mt-2 font-medium">{selectedProgram.desc}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-black text-navy-dark dark:text-white">진행 및 완료 기수</h4>
            <button
              onClick={() => setEditModal({ id: '', programId: selectedProgram.title, term: '', instructor: '', manager: '', headcount: 0, startDate: '', endDate: '', participants: [] })}
              className="bg-primary text-navy-dark px-4 py-1.5 rounded-full text-[10px] font-black shadow-md active:scale-95 transition-transform"
            >
              새 기수 추가
            </button>
          </div>

          {filteredBatches.length > 0 ? filteredBatches.map(batch => (
            <div key={batch.id} className="bg-white dark:bg-navy-accent p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-base filled">verified</span>
                  </span>
                  <span className="text-base font-black text-navy-dark dark:text-white">{batch.term}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditModal(batch)} className="size-9 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center active:scale-90 transition-transform shadow-sm"><span className="material-symbols-outlined text-base">edit</span></button>
                  <button onClick={() => handleDelete(batch.id)} className="size-9 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center active:scale-90 transition-transform shadow-sm"><span className="material-symbols-outlined text-base">delete</span></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-5">
                <InfoItem icon="person" label="강사" value={batch.instructor} />
                <InfoItem icon="support_agent" label="간사" value={batch.manager} />
                <InfoItem icon="groups" label="정원" value={`${batch.headcount}명`} />
                <InfoItem icon="event" label="기간" value={`${batch.startDate} ~ ${batch.endDate}`} span />
              </div>

              {/* 수강생 리스트 요약 */}
              <div className="bg-gray-50 dark:bg-navy-dark/40 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">수강생 현황 ({batch.participants.length}/{batch.headcount})</span>
                  <button onClick={() => setEditModal(batch)} className="text-[10px] font-black text-primary underline">명단 관리</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {batch.participants.length > 0 ? batch.participants.map((name, idx) => (
                    <span key={idx} className="bg-white dark:bg-navy-accent px-2.5 py-1 rounded-lg text-[11px] font-bold text-navy-dark dark:text-gray-300 border border-gray-100 dark:border-white/5 shadow-xs">{name}</span>
                  )) : (
                    <span className="text-[10px] text-gray-400 italic">등록된 수강생이 없습니다.</span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10">
              <p className="text-gray-400 text-xs font-bold">등록된 기수 정보가 없습니다.</p>
            </div>
          )}
        </div>

        {editModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditModal(null)}></div>
            <div className="relative w-full max-w-sm bg-white dark:bg-navy-accent p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
              <h4 className="text-xl font-black mb-6 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{editModal.id ? 'edit_note' : 'add_task'}</span>
                {editModal.id ? '기수 정보 수정' : '새 기수 등록'}
              </h4>

              <div className="flex flex-col gap-4">
                <InputWrapper label="기수 (예: 제 1기)" value={editModal.term} onChange={v => setEditModal({ ...editModal, term: v })} />

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="강사" value={editModal.instructor} onChange={v => setEditModal({ ...editModal, instructor: v })} />
                  <InputWrapper label="간사" value={editModal.manager} onChange={v => setEditModal({ ...editModal, manager: v })} />
                </div>

                <InputWrapper label="수강 정원" type="number" value={String(editModal.headcount)} onChange={v => setEditModal({ ...editModal, headcount: Number(v) })} />

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="시작일" type="date" value={editModal.startDate.replace(/\./g, '-')} onChange={v => setEditModal({ ...editModal, startDate: v.replace(/-/g, '.') })} />
                  <InputWrapper label="종료일" type="date" value={editModal.endDate.replace(/\./g, '-')} onChange={v => setEditModal({ ...editModal, endDate: v.replace(/-/g, '.') })} />
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/5 my-2"></div>

                {/* 수강생 명단 관리 (이름 입력) */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">수강생 명단 추가</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="이름 입력"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                      className="flex-1 bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-inner"
                    />
                    <select
                      value={newParticipantRole}
                      onChange={(e) => setNewParticipantRole(e.target.value)}
                      className="w-28 bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-inner"
                    >
                      <option value="">직분 (선택)</option>
                      <option value="성도">성도</option>
                      <option value="집사">집사</option>
                      <option value="안수집사">안수집사</option>
                      <option value="권사">권사</option>
                      <option value="장로">장로</option>
                      <option value="전도사">전도사</option>
                      <option value="목사">목사</option>
                      <option value="간사">간사</option>
                      <option value="청년">청년</option>
                    </select>
                    <button onClick={addParticipant} className="bg-navy-dark dark:bg-primary text-primary dark:text-navy-dark px-4 rounded-xl font-black text-xs active:scale-95 transition-transform">추가</button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2 bg-gray-50 dark:bg-navy-dark/40 p-3 rounded-2xl min-h-[60px] border border-dashed border-gray-200 dark:border-white/10">
                    {editModal.participants.length > 0 ? editModal.participants.map((name, idx) => (
                      <div key={idx} className="bg-white dark:bg-navy-accent px-3 py-1.5 rounded-full text-[11px] font-black text-navy-dark dark:text-white flex items-center gap-1.5 shadow-sm border border-gray-100 dark:border-white/5">
                        {name}
                        <button onClick={() => removeParticipant(name)} className="material-symbols-outlined text-[14px] text-red-400 hover:text-red-600 transition-colors">cancel</button>
                      </div>
                    )) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold italic">참여 명단을 구성해 보세요.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <button onClick={() => setEditModal(null)} className="py-4 bg-gray-100 dark:bg-white/5 rounded-2xl font-black text-sm text-gray-500 active:scale-95 transition-transform">취소</button>
                <button onClick={handleSave} className="py-4 bg-primary text-navy-dark rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-transform">설정 저장하기</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500 pb-24">
      <div className="bg-gradient-to-br from-navy-dark to-navy-accent p-8 rounded-[3rem] text-center border-b-8 border-primary shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-8xl text-white">school</span>
        </div>
        <h3 className="text-primary font-black text-[10px] mb-2 tracking-[0.3em] uppercase relative z-10">Discipleship Roadmap</h3>
        <p className="text-white font-black text-xl relative z-10 leading-tight">말씀으로 성장하고<br />제자로 세워지는 공동체</p>
      </div>

      <div className="flex flex-col gap-4">
        {PROGRAM_INFO.map((p, i) => (
          <div
            key={i}
            onClick={() => setSelectedProgram(p)}
            className="bg-white dark:bg-navy-accent p-6 rounded-[2.2rem] border border-gray-100 dark:border-white/5 flex gap-5 group cursor-pointer hover:border-primary/30 transition-all shadow-sm active:scale-[0.98] relative overflow-hidden"
          >
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-primary/5">
              <span className="material-symbols-outlined text-3xl">{p.icon}</span>
            </div>
            <div className="flex flex-col justify-center gap-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{p.cat}</span>
                <span className="material-symbols-outlined text-gray-200 dark:text-white/5 text-lg group-hover:text-primary transition-colors">arrow_forward_ios</span>
              </div>
              <h4 className="font-black text-navy-dark dark:text-white text-lg">{p.title}</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-6">
        <p className="text-[10px] text-gray-400 font-bold italic leading-relaxed">"성남신광교회 양육 시스템은 평신도를<br />그리스도의 온전한 제자로 세우는 과정입니다."</p>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: string; label: string; value: string; span?: boolean }> = ({ icon, label, value, span }) => (
  <div className={`flex items-center gap-2.5 ${span ? 'col-span-2' : ''}`}>
    <div className="size-8 rounded-lg bg-gray-50 dark:bg-navy-dark flex items-center justify-center text-primary/60 shrink-0 border border-gray-100 dark:border-white/5">
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[9px] font-bold text-gray-400 shrink-0 leading-none mb-1">{label}</span>
      <span className="text-xs font-black text-navy-dark dark:text-gray-200 truncate leading-none">{value}</span>
    </div>
  </div>
);

const InputWrapper: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string }> = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-gray-50 dark:bg-navy-dark border-none rounded-2xl p-4 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary shadow-inner"
    />
  </div>
);
