
import React, { useState } from 'react';
<<<<<<< HEAD
import { 
  ViewType, 
  ReservationData, 
  BulletinRecord, 
  Sermon, 
  SmallGroup, 
  PraiseTeam, 
  PraiseBand, 
  Department 
=======
import {
  ViewType,
  ReservationData,
  BulletinRecord,
  Sermon,
  SmallGroup,
  PraiseTeam,
  PraiseBand,
  Department
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
} from '../types';

interface AdminDashboardScreenProps {
  setView: (view: ViewType) => void;
  sermons: Sermon[]; setSermons: React.Dispatch<React.SetStateAction<Sermon[]>>;
  bulletins: BulletinRecord[]; setBulletins: React.Dispatch<React.SetStateAction<BulletinRecord[]>>;
  smallGroups: SmallGroup[]; setSmallGroups: React.Dispatch<React.SetStateAction<SmallGroup[]>>;
  praiseTeams: PraiseTeam[]; setPraiseTeams: React.Dispatch<React.SetStateAction<PraiseTeam[]>>;
  praiseBands: PraiseBand[]; setPraiseBands: React.Dispatch<React.SetStateAction<PraiseBand[]>>;
  departments: Department[]; setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  reservations: ReservationData[]; setReservations: React.Dispatch<React.SetStateAction<ReservationData[]>>;
<<<<<<< HEAD
=======
  onLogout: () => void;
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
}

type AdminTab = 'RESERVATION' | 'MEDIA' | 'BULLETIN' | 'ORGANIZATION' | 'SMALLGROUP' | 'SYSTEM';

<<<<<<< HEAD
export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ 
  setView, 
  sermons, setSermons, 
=======
export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  setView,
  sermons, setSermons,
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
  bulletins, setBulletins,
  smallGroups, setSmallGroups,
  praiseTeams, setPraiseTeams,
  praiseBands, setPraiseBands,
  departments, setDepartments,
<<<<<<< HEAD
  reservations, setReservations
=======
  reservations, setReservations,
  onLogout
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('RESERVATION');
  const [editModal, setEditModal] = useState<{ type: string; item: any } | null>(null);

<<<<<<< HEAD
  // 삭제 루틴
=======
  // [베테랑 삭제 루틴] String() 강제 변환으로 타입 불일치 원천 차단
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
  const handleDelete = (type: string, id: string | number) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    const idStr = String(id);

<<<<<<< HEAD
    switch(type) {
=======
    switch (type) {
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
      case 'RESERVATION': setReservations(prev => prev.filter(r => String(r.id) !== idStr)); break;
      case 'MEDIA': setSermons(prev => prev.filter(s => String(s.id) !== idStr)); break;
      case 'BULLETIN': setBulletins(prev => prev.filter(b => String(b.id) !== idStr)); break;
      case 'SMALLGROUP': setSmallGroups(prev => prev.filter(sg => String(sg.id) !== idStr)); break;
      case 'PRAISE_TEAM': setPraiseTeams(prev => prev.filter(pt => String(pt.id) !== idStr)); break;
      case 'PRAISE_BAND': setPraiseBands(prev => prev.filter(pb => String(pb.id) !== idStr)); break;
    }
  };

  const handleDeleteAll = (type: string) => {
    if (!window.confirm('경고! 해당 섹션의 모든 데이터를 삭제하시겠습니까?')) return;
    if (!window.confirm('한번 더 확인합니다. 정말로 전부 삭제할까요?')) return;

<<<<<<< HEAD
    switch(type) {
=======
    switch (type) {
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
      case 'RESERVATION': setReservations([]); break;
      case 'MEDIA': setSermons([]); break;
      case 'BULLETIN': setBulletins([]); break;
      case 'SMALLGROUP': setSmallGroups([]); break;
<<<<<<< HEAD
      case 'ORGANIZATION': 
        setPraiseTeams([]); 
        setPraiseBands([]); 
=======
      case 'ORGANIZATION':
        setPraiseTeams([]);
        setPraiseBands([]);
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
        break;
    }
  };

  const handleSave = (type: string, data: any) => {
    const isNew = !data.id;
    const finalData = isNew ? { ...data, id: String(Date.now()) } : data;

<<<<<<< HEAD
    switch(type) {
=======
    switch (type) {
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
      case 'MEDIA': setSermons(prev => isNew ? [finalData, ...prev] : prev.map(s => String(s.id) === String(finalData.id) ? finalData : s)); break;
      case 'BULLETIN': setBulletins(prev => isNew ? [finalData, ...prev] : prev.map(b => String(b.id) === String(finalData.id) ? finalData : b)); break;
      case 'SMALLGROUP': setSmallGroups(prev => isNew ? [finalData, ...prev] : prev.map(sg => String(sg.id) === String(finalData.id) ? finalData : sg)); break;
      case 'PRAISE_TEAM': setPraiseTeams(prev => isNew ? [...prev, finalData] : prev.map(pt => String(pt.id) === String(finalData.id) ? finalData : pt)); break;
      case 'PRAISE_BAND': setPraiseBands(prev => isNew ? [...prev, finalData] : prev.map(pb => String(pb.id) === String(finalData.id) ? finalData : pb)); break;
<<<<<<< HEAD
=======
      case 'RESERVATION': setReservations(prev => isNew ? [finalData, ...prev] : prev.map(r => String(r.id) === String(finalData.id) ? finalData : r)); break;
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
    }
    setEditModal(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'RESERVATION':
        return (
          <div className="flex flex-col gap-4 animate-in fade-in">
<<<<<<< HEAD
            <SectionHeader title="예약 신청 관리" count={reservations.length} onDeleteAll={() => handleDeleteAll('RESERVATION')} />
            {reservations.length > 0 ? reservations.map(res => (
              <AdminCard key={res.id} title={`${res.applicantName} (${res.roomName})`} info={`${res.date} / ${res.startTime}~${res.endTime}`} onDelete={() => handleDelete('RESERVATION', res.id)} />
=======
            <SectionHeader
              title="예약 신청 관리"
              count={reservations.length}
              onAdd={() => setEditModal({
                type: 'RESERVATION',
                item: {
                  applicantName: '',
                  roomName: '비전홀',
                  date: '2026-01-01',
                  startTime: '10:00',
                  endTime: '12:00',
                  purpose: '',
                  status: 'APPROVED',
                  headcount: 10,
                  roomId: '1',
                  createdAt: new Date().toISOString()
                }
              })}
              onDeleteAll={() => handleDeleteAll('RESERVATION')}
            />
            {reservations.length > 0 ? reservations.map(res => (
              <AdminCard
                key={res.id}
                title={`${res.applicantName} (${res.roomName})`}
                info={`${res.date} / ${res.startTime}~${res.endTime}`}
                onEdit={() => setEditModal({ type: 'RESERVATION', item: res })}
                onDelete={() => handleDelete('RESERVATION', res.id)}
              />
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
            )) : <EmptyState icon="event_busy" message="예약 정보가 비어있습니다." />}
          </div>
        );
      case 'MEDIA':
        return (
          <div className="flex flex-col gap-4 animate-in fade-in">
<<<<<<< HEAD
            <SectionHeader title="설교 미디어 관리" count={sermons.length} onAdd={() => setEditModal({ type: 'MEDIA', item: { title: '', preacher: '이현용 목사', date: '2026.01.01', thumbnail: 'https://picsum.photos/400/225', category: '주일예배' }})} onDeleteAll={() => handleDeleteAll('MEDIA')} />
=======
            <SectionHeader title="설교 미디어 관리" count={sermons.length} onAdd={() => setEditModal({ type: 'MEDIA', item: { title: '', preacher: '이현용 목사', date: '2026.01.01', thumbnail: 'https://picsum.photos/400/225', category: '주일예배' } })} onDeleteAll={() => handleDeleteAll('MEDIA')} />
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
            {sermons.map(s => (
              <AdminCard key={s.id} title={s.title} info={s.date} img={s.thumbnail} onEdit={() => setEditModal({ type: 'MEDIA', item: s })} onDelete={() => handleDelete('MEDIA', s.id)} />
            ))}
          </div>
        );
      case 'BULLETIN':
        return (
          <div className="flex flex-col gap-4 animate-in fade-in">
<<<<<<< HEAD
            <SectionHeader title="온라인 주보 관리" count={bulletins.length} onAdd={() => setEditModal({ type: 'BULLETIN', item: { date: '2026.01.01', volume: '1', title: '주일예배' }})} onDeleteAll={() => handleDeleteAll('BULLETIN')} />
=======
            <SectionHeader title="온라인 주보 관리" count={bulletins.length} onAdd={() => setEditModal({ type: 'BULLETIN', item: { date: '2026.01.01', volume: '1', title: '주일예배' } })} onDeleteAll={() => handleDeleteAll('BULLETIN')} />
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
            {bulletins.map(b => (
              <AdminCard key={b.id} title={`${b.date} 주보`} info={`제 ${b.volume}호`} onEdit={() => setEditModal({ type: 'BULLETIN', item: b })} onDelete={() => handleDelete('BULLETIN', b.id)} />
            ))}
          </div>
        );
<<<<<<< HEAD
=======
      case 'SMALLGROUP':
        return (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <SectionHeader
              title="소그룹 관리"
              count={smallGroups.length}
              onAdd={() => setEditModal({
                type: 'SMALLGROUP',
                item: {
                  name: '',
                  leader: '',
                  category: '청년부',
                  time: '주일 오후 2시',
                  location: '비전센터',
                  description: '',
                  tags: []
                }
              })}
              onDeleteAll={() => handleDeleteAll('SMALLGROUP')}
            />
            {smallGroups.map(sg => (
              <AdminCard
                key={sg.id}
                title={sg.name}
                info={`리더: ${sg.leader} / ${sg.time}`}
                onEdit={() => setEditModal({ type: 'SMALLGROUP', item: sg })}
                onDelete={() => handleDelete('SMALLGROUP', sg.id)}
              />
            ))}
            {smallGroups.length === 0 && <EmptyState icon="groups" message="등록된 소그룹이 없습니다." />}
          </div>
        );
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
      case 'ORGANIZATION':
        return (
          <div className="flex flex-col gap-10 animate-in fade-in">
            <div className="flex flex-col gap-4">
<<<<<<< HEAD
              <SectionHeader title="찬양대 관리" count={praiseTeams.length} onAdd={() => setEditModal({ type: 'PRAISE_TEAM', item: { name: '', conductor: '', accompanist: '' }})} onDeleteAll={() => handleDeleteAll('ORGANIZATION')} />
              {praiseTeams.map(pt => <AdminCard key={pt.id} title={pt.name} info={`지휘: ${pt.conductor}`} onEdit={() => setEditModal({ type: 'PRAISE_TEAM', item: pt })} onDelete={() => handleDelete('PRAISE_TEAM', pt.id)} />)}
            </div>
            <div className="flex flex-col gap-4">
              <SectionHeader title="찬양단 관리" count={praiseBands.length} onAdd={() => setEditModal({ type: 'PRAISE_BAND', item: { name: '', leader: '' }})} />
=======
              <SectionHeader title="찬양대 관리" count={praiseTeams.length} onAdd={() => setEditModal({ type: 'PRAISE_TEAM', item: { name: '', conductor: '', accompanist: '' } })} onDeleteAll={() => handleDeleteAll('ORGANIZATION')} />
              {praiseTeams.map(pt => <AdminCard key={pt.id} title={pt.name} info={`지휘: ${pt.conductor}`} onEdit={() => setEditModal({ type: 'PRAISE_TEAM', item: pt })} onDelete={() => handleDelete('PRAISE_TEAM', pt.id)} />)}
            </div>
            <div className="flex flex-col gap-4">
              <SectionHeader title="찬양단 관리" count={praiseBands.length} onAdd={() => setEditModal({ type: 'PRAISE_BAND', item: { name: '', leader: '' } })} />
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
              {praiseBands.map(pb => <AdminCard key={pb.id} title={pb.name} info={`팀장: ${pb.leader}`} onEdit={() => setEditModal({ type: 'PRAISE_BAND', item: pb })} onDelete={() => handleDelete('PRAISE_BAND', pb.id)} />)}
            </div>
          </div>
        );
      case 'SYSTEM':
        return (
          <div className="flex flex-col gap-6 animate-in fade-in">
<<<<<<< HEAD
             <div className="bg-white dark:bg-navy-accent p-8 rounded-[3rem] border-2 border-red-500/20 text-center shadow-2xl">
                <span className="material-symbols-outlined text-red-500 text-6xl mb-4 filled">warning</span>
                <h4 className="text-xl font-black text-red-500 mb-2">마스터 데이터 공장 초기화</h4>
                <p className="text-xs text-gray-500 font-bold mb-8">모든 데이터를 삭제하고 앱을 초기 설치 상태로 포맷합니다.</p>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all">스토리지 완전 포맷</button>
             </div>
=======
            <div className="bg-white dark:bg-navy-accent p-8 rounded-[3rem] border-2 border-red-500/20 text-center shadow-2xl">
              <span className="material-symbols-outlined text-red-500 text-6xl mb-4 filled">warning</span>
              <h4 className="text-xl font-black text-red-500 mb-2">마스터 데이터 공장 초기화</h4>
              <p className="text-xs text-gray-500 font-bold mb-8">모든 데이터를 삭제하고 앱을 초기 설치 상태로 포맷합니다.</p>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all mb-8">스토리지 완전 포맷</button>

              <hr className="border-gray-100 dark:border-white/10 mb-8" />

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-gray-400 mb-2">관리자 세션</h4>
                <button onClick={onLogout} className="w-full bg-gray-100 dark:bg-white/10 text-navy-dark dark:text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all border border-gray-200 dark:border-white/5">관리자 로그아웃</button>
              </div>
            </div>
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-navy-light dark:bg-navy-dark">
      <div className="flex bg-white dark:bg-navy-accent border-b border-gray-100 dark:border-white/5 sticky top-0 z-[100] overflow-x-auto no-scrollbar shadow-sm">
        <TabButton active={activeTab === 'RESERVATION'} onClick={() => setActiveTab('RESERVATION')} label="예약신청" />
        <TabButton active={activeTab === 'MEDIA'} onClick={() => setActiveTab('MEDIA')} label="미디어" />
        <TabButton active={activeTab === 'BULLETIN'} onClick={() => setActiveTab('BULLETIN')} label="주보관리" />
        <TabButton active={activeTab === 'ORGANIZATION'} onClick={() => setActiveTab('ORGANIZATION')} label="찬양/조직" />
        <TabButton active={activeTab === 'SMALLGROUP'} onClick={() => setActiveTab('SMALLGROUP')} label="소그룹" />
        <TabButton active={activeTab === 'SYSTEM'} onClick={() => setActiveTab('SYSTEM')} label="설정" />
      </div>

      <div className="p-4 pb-32">{renderTabContent()}</div>

      {editModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditModal(null)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-navy-accent p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="text-xl font-black mb-6 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              상세 정보 수정
            </h4>
            <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
              {Object.keys(editModal.item).map(key => key !== 'id' && (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{key}</label>
<<<<<<< HEAD
                  {key === 'date' ? (
                    <input 
                      type="date" 
                      value={editModal.item[key]?.replace(/\./g, '-') || ''} 
                      onChange={e => {
                        const val = e.target.value.replace(/-/g, '.');
                        setEditModal({...editModal, item: {...editModal.item, [key]: val}});
                      }} 
                      className="w-full bg-gray-50 dark:bg-navy-dark border-2 border-primary/20 rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-inner" 
                    />
                  ) : (
                    <input 
                      type="text" 
                      value={editModal.item[key]} 
                      onChange={e => setEditModal({...editModal, item: {...editModal.item, [key]: e.target.value}})} 
                      className="w-full bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-inner" 
                    />
                  )}
=======
                  <input type="text" value={editModal.item[key]} onChange={e => setEditModal({ ...editModal, item: { ...editModal.item, [key]: e.target.value } })} className="w-full bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-inner" />
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button onClick={() => setEditModal(null)} className="py-3 bg-gray-100 dark:bg-white/5 rounded-xl font-black text-xs text-gray-500">취소</button>
              <button onClick={() => handleSave(editModal.type, editModal.item)} className="py-3 bg-primary text-navy-dark rounded-xl font-black text-xs shadow-lg">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; count: number; onAdd?: () => void; onDeleteAll?: () => void }> = ({ title, count, onAdd, onDeleteAll }) => (
  <div className="flex items-center justify-between px-1 mb-2">
    <div className="flex items-center gap-2">
      <h3 className="text-navy-dark dark:text-white font-black text-lg">{title}</h3>
      <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">{count}</span>
    </div>
    <div className="flex gap-2">
      {onDeleteAll && <button onClick={onDeleteAll} className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-500/20 active:scale-95 transition-all">전체삭제</button>}
      {onAdd && <button onClick={onAdd} className="bg-primary text-navy-dark px-4 py-1.5 rounded-full text-[10px] font-black shadow-md active:scale-95 transition-all">추가</button>}
    </div>
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`px-5 py-4 text-[13px] font-black border-b-2 transition-all shrink-0 ${active ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>{label}</button>
);

const AdminCard: React.FC<{ title: string; info: string; img?: string; onEdit?: () => void; onDelete: () => void }> = ({ title, info, img, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-navy-accent p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-white/5 group hover:border-primary/20 transition-all">
    {img ? <img src={img} className="size-12 rounded-xl object-cover shrink-0" alt="" /> : <div className="size-12 rounded-xl bg-gray-50 dark:bg-navy-dark flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-lg">description</span></div>}
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-xs text-navy-dark dark:text-white truncate">{title}</h4>
      <p className="text-[9px] text-gray-400 font-bold mt-0.5">{info}</p>
    </div>
    <div className="flex gap-1.5">
      {onEdit && <button onClick={onEdit} className="size-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100"><span className="material-symbols-outlined text-base">edit</span></button>}
      <button onClick={onDelete} className="size-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100"><span className="material-symbols-outlined text-base">delete</span></button>
    </div>
  </div>
);

const EmptyState: React.FC<{ icon: string; message: string }> = ({ icon, message }) => (
  <div className="py-20 text-center flex flex-col items-center gap-3 bg-white/50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10 shadow-inner">
    <span className="material-symbols-outlined text-4xl text-gray-300">{icon}</span>
    <p className="text-gray-400 font-bold text-xs">{message}</p>
  </div>
);
