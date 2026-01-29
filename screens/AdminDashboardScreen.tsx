
import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';
import {
  ViewType,
  ReservationData,
  BulletinRecord,
  Sermon,
  SmallGroup,
  PraiseTeam,
  PraiseBand,
  Department,
  PastorProfile,
  FloorData
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
  pastorProfile: PastorProfile; setPastorProfile: React.Dispatch<React.SetStateAction<PastorProfile>>;
  floorData: FloorData[]; setFloorData: React.Dispatch<React.SetStateAction<FloorData[]>>;
  onLogout: () => void;
}

type AdminTab = 'RESERVATION' | 'MEDIA' | 'BULLETIN' | 'ORGANIZATION' | 'SMALLGROUP' | 'MAIN_SCREEN' | 'SYSTEM';

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  setView,
  sermons, setSermons,
  bulletins, setBulletins,
  smallGroups, setSmallGroups,
  praiseTeams, setPraiseTeams,
  praiseBands, setPraiseBands,
  departments, setDepartments,
  reservations, setReservations,
  pastorProfile, setPastorProfile,
  floorData, setFloorData,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('RESERVATION');
  const [editModal, setEditModal] = useState<{ type: string; item: any } | null>(null);

  // [베테랑 삭제 루틴] String() 강제 변환으로 타입 불일치 원천 차단
  const handleDelete = async (type: string, id: string | number) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    const idStr = String(id);

    try {
      let error = null;
      switch (type) {
        case 'RESERVATION':
          const { error: resErr } = await supabase.from('reservations').delete().eq('id', idStr);
          error = resErr;
          if (!error) setReservations(prev => prev.filter(r => String(r.id) !== idStr));
          break;
        case 'MEDIA':
          const { error: mediaErr } = await supabase.from('sermons').delete().eq('id', idStr);
          error = mediaErr;
          if (!error) setSermons(prev => prev.filter(s => String(s.id) !== idStr));
          break;
        case 'BULLETIN':
          const { error: bullErr } = await supabase.from('bulletins').delete().eq('id', idStr);
          error = bullErr;
          if (!error) setBulletins(prev => prev.filter(b => String(b.id) !== idStr));
          break;
        case 'SMALLGROUP':
          const { error: groupErr } = await supabase.from('small_groups').delete().eq('id', idStr);
          error = groupErr;
          if (!error) setSmallGroups(prev => prev.filter(sg => String(sg.id) !== idStr));
          break;
        case 'PRAISE_TEAM':
          const { error: teamErr } = await supabase.from('praise_teams').delete().eq('id', idStr);
          error = teamErr;
          if (!error) setPraiseTeams(prev => prev.filter(pt => String(pt.id) !== idStr));
          break;
        case 'PRAISE_BAND':
          const { error: bandErr } = await supabase.from('praise_bands').delete().eq('id', idStr);
          error = bandErr;
          if (!error) setPraiseBands(prev => prev.filter(pb => String(pb.id) !== idStr));
          break;
      }

      if (error) {
        console.error('Delete failed:', error);
        alert('삭제에 실패했습니다: ' + error.message);
      }
    } catch (e) {
      console.error('Error deleting data:', e);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteAll = async (type: string) => {
    if (!window.confirm('경고! 해당 섹션의 모든 데이터를 삭제하시겠습니까?')) return;
    if (!window.confirm('한번 더 확인합니다. 정말로 전부 삭제할까요?')) return;

    try {
      let error = null;
      switch (type) {
        case 'RESERVATION':
          const { error: resErr } = await supabase.from('reservations').delete().neq('id', 'placeholder'); // Delete all
          error = resErr;
          if (!error) setReservations([]);
          break;
        case 'MEDIA':
          const { error: mediaErr } = await supabase.from('sermons').delete().neq('id', 'placeholder');
          error = mediaErr;
          if (!error) setSermons([]);
          break;
        case 'BULLETIN':
          const { error: bullErr } = await supabase.from('bulletins').delete().neq('id', 'placeholder');
          error = bullErr;
          if (!error) setBulletins([]);
          break;
        case 'SMALLGROUP':
          const { error: groupErr } = await supabase.from('small_groups').delete().neq('id', 'placeholder');
          error = groupErr;
          if (!error) setSmallGroups([]);
          break;
        case 'ORGANIZATION':
          const { error: teamErr } = await supabase.from('praise_teams').delete().neq('id', 'placeholder');
          if (teamErr) error = teamErr;
          else setPraiseTeams([]);

          const { error: bandErr } = await supabase.from('praise_bands').delete().neq('id', 'placeholder');
          if (bandErr) error = bandErr;
          else setPraiseBands([]);
          break;
      }

      if (error) {
        console.error('Delete All failed:', error);
        alert('전체 삭제에 실패했습니다: ' + error.message);
      }
    } catch (e) {
      console.error('Error deleting all data:', e);
      alert('전체 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSave = async (type: string, data: any) => {
    // Basic ID handling for text-based IDs (default for most tables)
    // For integer identity tables (PASTOR_PROFILE, FLOOR_ROOMS), we need special handling.
    const isIdentityTable = type === 'PASTOR_PROFILE' || type === 'FLOOR_ROOMS';

    // For text-ID tables, generate ID if new. For identity tables, keep ID if exists, or undefined if new.
    let finalData = { ...data };
    if (!isIdentityTable) {
      if (!finalData.id) finalData.id = String(Date.now());
    }

    // Optimistic Update Helper
    const updateLocalState = (savedItem: any) => {
      switch (type) {
        case 'MEDIA': setSermons(prev => {
          const exists = prev.some(i => String(i.id) === String(savedItem.id));
          return exists ? prev.map(i => String(i.id) === String(savedItem.id) ? savedItem : i) : [savedItem, ...prev];
        }); break;
        case 'BULLETIN': setBulletins(prev => {
          const exists = prev.some(i => String(i.id) === String(savedItem.id));
          return exists ? prev.map(i => String(i.id) === String(savedItem.id) ? savedItem : i) : [savedItem, ...prev];
        }); break;
        case 'SMALLGROUP': setSmallGroups(prev => {
          const exists = prev.some(i => String(i.id) === String(savedItem.id));
          return exists ? prev.map(i => String(i.id) === String(savedItem.id) ? savedItem : i) : [savedItem, ...prev];
        }); break;
        case 'PRAISE_TEAM': setPraiseTeams(prev => {
          const exists = prev.some(i => String(i.id) === String(savedItem.id));
          return exists ? prev.map(i => String(i.id) === String(savedItem.id) ? savedItem : i) : [...prev, savedItem];
        }); break;
        case 'PRAISE_BAND': setPraiseBands(prev => {
          const exists = prev.some(i => String(i.id) === String(savedItem.id));
          return exists ? prev.map(i => String(i.id) === String(savedItem.id) ? savedItem : i) : [...prev, savedItem];
        }); break;
        case 'RESERVATION': setReservations(prev => {
          const exists = prev.some(i => String(i.id) === String(savedItem.id));
          return exists ? prev.map(i => String(i.id) === String(savedItem.id) ? savedItem : i) : [savedItem, ...prev];
        }); break;
        case 'PASTOR_PROFILE': setPastorProfile(savedItem); break;
        case 'FLOOR_ROOMS': setFloorData(prev => {
          const exists = prev.some(f => f.id === savedItem.id);
          return exists ? prev.map(f => f.id === savedItem.id ? savedItem : f) : [...prev, savedItem];
        }); break;
      }
    };

    try {
      let error = null;
      let resultData = null;

      if (isIdentityTable) {
        // Special handling for Identity Columns (generated always)
        // Do not rely on client-side generated ID (Date.now() exceeds int32).
        // Check existence by business key first.

        let existingRecord = null;

        // Trust the ID coming from the client if it exists (for edits)
        // If no ID, it's a new insertion.
        if (finalData.id) {
          existingRecord = { id: finalData.id };
        } else {
          // Fallback lookup ONLY if ID is missing (e.g. initial seed edge cases?)
          if (type === 'PASTOR_PROFILE') {
            const { data: found } = await supabase.from('pastor_profile').select('id').limit(1).single();
            if (found) existingRecord = found;
          } else if (type === 'FLOOR_ROOMS') {
            const { data: found } = await supabase.from('floor_data').select('id').eq('floor', finalData.floor).limit(1).single();
            if (found) existingRecord = found;
          }
        }

        if (existingRecord) {
          // Update existing using the REAL db id
          // Explicitly construct update payload to be safe
          const { id, ...rest } = finalData;
          const updatePayload = rest;

          const { data: updated, error: updateErr } = await supabase
            .from(type === 'PASTOR_PROFILE' ? 'pastor_profile' : 'floor_data')
            .update(updatePayload) // Now safely excludes ID
            .eq('id', existingRecord.id)
            .select();

          if (updateErr) error = updateErr;
          else if (updated && updated.length > 0) resultData = updated[0];
        } else {
          // Insert new
          const { id, ...rest } = finalData;
          const insertPayload = rest;

          const { data: inserted, error: insertErr } = await supabase
            .from(type === 'PASTOR_PROFILE' ? 'pastor_profile' : 'floor_data')
            .insert(insertPayload) // Now safely excludes ID
            .select();

          if (insertErr) error = insertErr;
          else if (inserted && inserted.length > 0) resultData = inserted[0];
        }


      } else {
        // Normal tables with Text ID (Client Generated)

        if (type === 'SMALLGROUP') {
          if (typeof finalData.tags === 'string') {
            finalData.tags = finalData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
          }
        }

        // [New Logic] Media Thumbnail Auto-Generation
        if (type === 'MEDIA') {
          // Extract Video ID
          // Supports: youtu.be/VIDEO_ID, youtube.com/watch?v=VIDEO_ID, etc.
          const getYoutubeId = (url: string) => {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
          };

          const vid = getYoutubeId(finalData.videoUrl);
          if (vid) {
            finalData.thumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
          } else {
            // Fallback if URL is invalid or empty, keep existing or default?
            // Let's keep existing if valid, or default image.
            if (!finalData.thumbnail) finalData.thumbnail = 'https://picsum.photos/400/225';
          }
        }

        // Use Upsert
        const { data: upserted, error: upsertErr } = await supabase.from(
          type === 'MEDIA' ? 'sermons' :
            type === 'BULLETIN' ? 'bulletins' :
              type === 'SMALLGROUP' ? 'small_groups' :
                type === 'PRAISE_TEAM' ? 'praise_teams' :
                  type === 'PRAISE_BAND' ? 'praise_bands' :
                    type === 'RESERVATION' ? 'reservations' : 'sermons' // fallback
        ).upsert(finalData).select();

        if (upsertErr) error = upsertErr;
        else if (upserted && upserted.length > 0) resultData = upserted[0];
      }

      if (error) {
        console.error('Save failed:', error);
        alert('저장에 실패했습니다: ' + error.message);
        return;
      }

      // Update Local State with DB Result (Sync IDs)
      if (resultData) {
        updateLocalState(resultData);
      } else {
        // Fallback if no data returned (shouldn't happen with select())
        updateLocalState(finalData);
      }

      setEditModal(null);
    } catch (e) {
      console.error('Error saving data:', e);
      alert('오류가 발생했습니다.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'RESERVATION':
        return (
          <div className="flex flex-col gap-4 animate-in fade-in">
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
            )) : <EmptyState icon="event_busy" message="예약 정보가 비어있습니다." />}
          </div>
        );
      case 'MEDIA':
        return (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <SectionHeader title="설교 미디어 관리" count={sermons.length} onAdd={() => setEditModal({ type: 'MEDIA', item: { title: '', preacher: '이현용 목사', date: '2026.01.01', thumbnail: '', category: '주일예배', videoUrl: '', startTime: '', endTime: '', description: '요한복음 3장 16절' } })} onDeleteAll={() => handleDeleteAll('MEDIA')} />
            {sermons.map(s => (
              <AdminCard key={s.id} title={s.title} info={s.date} img={s.thumbnail} onEdit={() => setEditModal({ type: 'MEDIA', item: s })} onDelete={() => handleDelete('MEDIA', s.id)} />
            ))}
          </div>
        );
      case 'BULLETIN':
        return (
          <div className="flex flex-col gap-4 animate-in fade-in">
            <SectionHeader title="온라인 주보 관리" count={bulletins.length} onAdd={() => setEditModal({ type: 'BULLETIN', item: { date: '2026.01.01', volume: '1', title: '주일예배' } })} onDeleteAll={() => handleDeleteAll('BULLETIN')} />
            {bulletins.map(b => (
              <AdminCard key={b.id} title={`${b.date} 주보`} info={`제 ${b.volume}호`} onEdit={() => setEditModal({ type: 'BULLETIN', item: b })} onDelete={() => handleDelete('BULLETIN', b.id)} />
            ))}
          </div>
        );
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
      case 'MAIN_SCREEN':
        return (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <SectionHeader title="메인 화면 관리" count={1} />
            <div className="bg-white dark:bg-navy-accent p-6 rounded-3xl border border-gray-100 dark:border-white/5 flex gap-6 items-center shadow-sm">
              <div className="size-24 rounded-full overflow-hidden shrink-0 border-4 border-gray-50 dark:border-white/10">
                <img src={pastorProfile.image} className="w-full h-full object-cover" alt="프로필" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-black text-navy-dark dark:text-white mb-1">담임목사 환영 인사</h4>
                <p className="text-xs text-gray-500 font-bold mb-3">{pastorProfile.name}</p>
                <p className="text-[11px] text-gray-400 line-clamp-2 max-w-md italic">"{pastorProfile.quote}"</p>
              </div>
              <button
                onClick={() => setEditModal({ type: 'PASTOR_PROFILE', item: pastorProfile })}
                className="px-5 py-3 rounded-2xl bg-primary text-navy-dark font-black text-xs shadow-lg active:scale-95 transition-all"
              >
                수정하기
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <SectionHeader
                title="비전센터 층별 안내"
                count={floorData.length}
                onAdd={() => setEditModal({ type: 'FLOOR_ROOMS', item: { id: Date.now(), floor: '1층', title: '새 층', summary: '설명', icon: 'stairs', rooms: [] } })}
              />
              {floorData.map((floor, idx) => (
                <div key={idx} className="bg-white dark:bg-navy-accent p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-gray-50 dark:bg-navy-dark flex items-center justify-center font-black text-primary text-lg border border-gray-100 dark:border-white/5 shadow-inner">
                      {floor.floor.replace('층', '')}F
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-navy-dark dark:text-white">{floor.floor} {floor.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">{floor.summary} ({floor.rooms.length}개 시설)</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditModal({ type: 'FLOOR_ROOMS', item: floor })}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold text-[10px] hover:bg-primary hover:text-navy-dark transition-all active:scale-95"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('정말 삭제하시겠습니까?')) {
                          setFloorData(prev => prev.filter((_, i) => i !== idx)); // Optimistic update
                          // TODO: 실제 DB 삭제 로직 필요 (현재는 로컬 state만 업데이트됨 - handleSave에서 처리 필요 혹은 별도 handleDelete)
                          handleDelete('FLOOR_ROOMS', floor.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 font-bold text-[10px] hover:bg-red-100 transition-all active:scale-95"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ORGANIZATION':
        return (
          <div className="flex flex-col gap-10 animate-in fade-in">
            <div className="flex flex-col gap-4">
              <SectionHeader title="찬양대 관리" count={praiseTeams.length} onAdd={() => setEditModal({ type: 'PRAISE_TEAM', item: { name: '', conductor: '', accompanist: '' } })} onDeleteAll={() => handleDeleteAll('ORGANIZATION')} />
              {praiseTeams.map(pt => <AdminCard key={pt.id} title={pt.name} info={`지휘: ${pt.conductor}`} onEdit={() => setEditModal({ type: 'PRAISE_TEAM', item: pt })} onDelete={() => handleDelete('PRAISE_TEAM', pt.id)} />)}
            </div>
            <div className="flex flex-col gap-4">
              <SectionHeader title="찬양단 관리" count={praiseBands.length} onAdd={() => setEditModal({ type: 'PRAISE_BAND', item: { name: '', leader: '' } })} />
              {praiseBands.map(pb => <AdminCard key={pb.id} title={pb.name} info={`팀장: ${pb.leader}`} onEdit={() => setEditModal({ type: 'PRAISE_BAND', item: pb })} onDelete={() => handleDelete('PRAISE_BAND', pb.id)} />)}
            </div>
          </div>
        );
      case 'SYSTEM':
        return (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div className="bg-white dark:bg-navy-accent p-8 rounded-[3rem] border border-gray-100 dark:border-white/10 text-center shadow-lg">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-gray-400 mb-2">관리자 세션</h4>
                <button onClick={onLogout} className="w-full bg-gray-100 dark:bg-white/10 text-navy-dark dark:text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all border border-gray-200 dark:border-white/5">관리자 로그아웃</button>
              </div>
            </div>
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
        <TabButton active={activeTab === 'MAIN_SCREEN'} onClick={() => setActiveTab('MAIN_SCREEN')} label="메인화면" />
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
              {Object.keys(editModal.item).map(key => {
                if (key === 'id' || key === 'rooms' || key === 'thumbnail' || key === 'attachments') return null; // Hide internal fields

                let label = key;
                let placeholder = '';
                if (key === 'description' && editModal.type === 'MEDIA') {
                  label = 'BIBLE VERSE (성경 말씀)';
                  placeholder = '예: 요한복음 3장 16절';
                }

                if (editModal.type === 'RESERVATION' && key === 'status') {
                  return (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                      <select
                        value={editModal.item[key]}
                        onChange={e => setEditModal({ ...editModal, item: { ...editModal.item, [key]: e.target.value } })}
                        className="w-full bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-inner"
                      >
                        <option value="PENDING">PENDING (대기)</option>
                        <option value="APPROVED">APPROVED (승인)</option>
                        <option value="REJECTED">REJECTED (거절)</option>
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                    <input
                      type="text"
                      value={editModal.item[key] || ''}
                      onChange={e => setEditModal({ ...editModal, item: { ...editModal.item, [key]: e.target.value } })}
                      className="w-full bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-3 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-inner"
                      placeholder={placeholder}
                    />
                  </div>
                );
              })}
              {editModal.type === 'FLOOR_ROOMS' && (
                <div className="flex flex-col gap-4 mt-2">
                  {/* 층 정보 수정 필드 추가 */}
                  <div className="grid grid-cols-3 gap-3 bg-gray-50 dark:bg-navy-dark/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">층수 (예: 1층)</label>
                      <input
                        value={editModal.item.floor}
                        onChange={e => setEditModal({ ...editModal, item: { ...editModal.item, floor: e.target.value } })}
                        className="bg-white dark:bg-navy-accent border-none rounded-xl p-2 text-xs font-bold shadow-sm"
                      />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">제목 (예: 로비 및 카페)</label>
                      <input
                        value={editModal.item.title}
                        onChange={e => setEditModal({ ...editModal, item: { ...editModal.item, title: e.target.value } })}
                        className="bg-white dark:bg-navy-accent border-none rounded-xl p-2 text-xs font-bold shadow-sm"
                      />
                    </div>
                    <div className="col-span-3 flex flex-col gap-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">요약 설명</label>
                      <input
                        value={editModal.item.summary}
                        onChange={e => setEditModal({ ...editModal, item: { ...editModal.item, summary: e.target.value } })}
                        className="bg-white dark:bg-navy-accent border-none rounded-xl p-2 text-xs font-bold shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-white/5 my-1"></div>

                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-black dark:text-white">시설 목록 ({editModal.item.rooms.length})</h5>
                    <button
                      onClick={() => setEditModal({
                        ...editModal,
                        item: {
                          ...editModal.item,
                          rooms: [...editModal.item.rooms, { id: Date.now(), no: 'NEW', name: '새 시설', desc: '', features: [] }]
                        }
                      })}
                      className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-navy-dark transition-colors"
                    >
                      + 시설 추가
                    </button>
                  </div>
                  {editModal.item.rooms.map((room: any, rIdx: number) => (
                    <div key={rIdx} className="bg-gray-50 dark:bg-navy-dark p-4 rounded-2xl flex flex-col gap-3 border border-gray-100 dark:border-white/5 relative group">
                      <button
                        onClick={() => {
                          if (!window.confirm('삭제하시겠습니까?')) return;
                          const newRooms = editModal.item.rooms.filter((_: any, idx: number) => idx !== rIdx);
                          setEditModal({ ...editModal, item: { ...editModal.item, rooms: newRooms } });
                        }}
                        className="absolute top-2 right-2 size-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                      <div className="flex gap-2">
                        <input
                          className="w-16 bg-white dark:bg-navy-accent p-2 rounded-lg text-[10px] font-black text-center"
                          value={room.no}
                          onChange={(e) => {
                            const newRooms = [...editModal.item.rooms];
                            newRooms[rIdx] = { ...newRooms[rIdx], no: e.target.value };
                            setEditModal({ ...editModal, item: { ...editModal.item, rooms: newRooms } });
                          }}
                          placeholder="호수"
                        />
                        <input
                          className="flex-1 bg-white dark:bg-navy-accent p-2 rounded-lg text-xs font-bold"
                          value={room.name}
                          onChange={(e) => {
                            const newRooms = [...editModal.item.rooms];
                            newRooms[rIdx] = { ...newRooms[rIdx], name: e.target.value };
                            setEditModal({ ...editModal, item: { ...editModal.item, rooms: newRooms } });
                          }}
                          placeholder="시설명"
                        />
                      </div>
                      <textarea
                        className="w-full bg-white dark:bg-navy-accent p-2 rounded-lg text-[11px] resize-none h-16"
                        value={room.desc}
                        onChange={(e) => {
                          const newRooms = [...editModal.item.rooms];
                          newRooms[rIdx] = { ...newRooms[rIdx], desc: e.target.value };
                          setEditModal({ ...editModal, item: { ...editModal.item, rooms: newRooms } });
                        }}
                        placeholder="시설 설명"
                      />
                      <input
                        className="w-full bg-white dark:bg-navy-accent p-2 rounded-lg text-[10px] text-primary"
                        value={room.features.join(', ')}
                        onChange={(e) => {
                          const newRooms = [...editModal.item.rooms];
                          newRooms[rIdx] = { ...newRooms[rIdx], features: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) };
                          setEditModal({ ...editModal, item: { ...editModal.item, rooms: newRooms } });
                        }}
                        placeholder="태그 (쉼표로 구분)"
                      />
                    </div>
                  ))}
                </div>
              )}
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

