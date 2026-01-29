
import React, { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import { ViewType, Sermon, BulletinRecord, SmallGroup, PraiseTeam, PraiseBand, Department, ReservationData, ProgramBatch, PastorProfile, FloorData } from './types';
import { Layout } from './components/Layout';
import { HomeScreen } from './screens/HomeScreen';
import { BulletinScreen } from './screens/BulletinScreen';
import { MediaScreen } from './screens/MediaScreen';
import { MapScreen } from './screens/MapScreen';
import { MoreScreen } from './screens/MoreScreen';
import { ReservationScreen } from './screens/ReservationScreen';
import { SermonDetailScreen } from './screens/SermonDetailScreen';
import { SitemapScreen } from './screens/SitemapScreen';
import { AIChatScreen } from './screens/AIChatScreen';
import { NoticeScreen } from './screens/NoticeScreen';
import { SmallGroupScreen } from './screens/SmallGroupScreen';
import { AlbumScreen } from './screens/AlbumScreen';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { ProgramScreen } from './screens/ProgramScreen';
import {
  INITIAL_BULLETIN_RECORDS,
  MOCK_SERMONS,
  DEFAULT_SMALL_GROUPS,
  DEFAULT_PRAISE_TEAMS,
  DEFAULT_PRAISE_BANDS,
  DEFAULT_DEPARTMENTS,
  INITIAL_PROGRAM_BATCHES,
  DEFAULT_PASTOR_PROFILE,
  DEFAULT_FLOOR_DATA
} from './constants';

// Assuming supabase client is imported here, e.g.:
// import { supabase } from './supabaseClient';


const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.HOME);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

  // 전역 상태 관리 (로컬스토리지 우선)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem('shinkwang_is_admin') === 'true');
  // States initialized with empty arrays/defaults
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [bulletins, setBulletins] = useState<BulletinRecord[]>([]);
  const [smallGroups, setSmallGroups] = useState<SmallGroup[]>([]);
  const [praiseTeams, setPraiseTeams] = useState<PraiseTeam[]>([]);
  const [praiseBands, setPraiseBands] = useState<PraiseBand[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [programBatches, setProgramBatches] = useState<ProgramBatch[]>([]);
  // Use defaults for single objects to avoid null checks initially
  const [pastorProfile, setPastorProfile] = useState<PastorProfile>(DEFAULT_PASTOR_PROFILE);
  const [floorData, setFloorData] = useState<FloorData[]>(DEFAULT_FLOOR_DATA);

  // Fetch Data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sermonData } = await supabase.from('sermons').select('*').order('date', { ascending: false });
        if (sermonData) setSermons(sermonData);

        const { data: bulletinData } = await supabase.from('bulletins').select('*').order('date', { ascending: false });
        if (bulletinData) setBulletins(bulletinData);

        const { data: groupData } = await supabase.from('small_groups').select('*');
        if (groupData && groupData.length > 0) { setSmallGroups(groupData); }
        else {
          // Init Small Groups
          await supabase.from('small_groups').insert(DEFAULT_SMALL_GROUPS.map(d => ({ ...d, id: String(Date.now() + Math.random()) })));
          const { data: refetched } = await supabase.from('small_groups').select('*');
          if (refetched) setSmallGroups(refetched);
        }

        const { data: teamData } = await supabase.from('praise_teams').select('*');
        if (teamData && teamData.length > 0) { setPraiseTeams(teamData); }
        else {
          // Init Praise Teams
          await supabase.from('praise_teams').insert(DEFAULT_PRAISE_TEAMS.map(d => ({ ...d, id: String(Date.now() + Math.random()) })));
          const { data: refetched } = await supabase.from('praise_teams').select('*');
          if (refetched) setPraiseTeams(refetched);
        }

        const { data: bandData } = await supabase.from('praise_bands').select('*');
        if (bandData && bandData.length > 0) { setPraiseBands(bandData); }
        else {
          // Init Praise Bands
          await supabase.from('praise_bands').insert(DEFAULT_PRAISE_BANDS.map(d => ({ ...d, id: String(Date.now() + Math.random()) })));
          const { data: refetched } = await supabase.from('praise_bands').select('*');
          if (refetched) setPraiseBands(refetched);
        }

        const { data: deptData } = await supabase.from('departments').select('*');
        if (deptData && deptData.length > 0) { setDepartments(deptData); }
        else {
          // Init Departments
          await supabase.from('departments').insert(DEFAULT_DEPARTMENTS.map(d => ({ ...d, id: String(Date.now() + Math.random()) })));
          const { data: refetched } = await supabase.from('departments').select('*');
          if (refetched) setDepartments(refetched);
        }

        const { data: resData } = await supabase.from('reservations').select('*').order('date', { ascending: false });
        if (resData) setReservations(resData);

        const { data: progData } = await supabase.from('program_batches').select('*');
        if (progData) setProgramBatches(progData);

        const { data: pastorData } = await supabase.from('pastor_profile').select('*').single();
        if (pastorData) setPastorProfile(pastorData);

        const { data: floorData } = await supabase.from('floor_data').select('*').order('id', { ascending: true });
        if (floorData && floorData.length > 0) {
          setFloorData(floorData);
        } else {
          // 초기 데이터가 없으면 DEFAULT_FLOOR_DATA를 삽입
          console.log('Inserting default floor data...');
          const { error: insertError } = await supabase.from('floor_data').insert(
            DEFAULT_FLOOR_DATA.map(f => {
              // DB 스키마에 맞춰 id 제외하고 삽입
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { id, ...rest } = f;
              return rest;
            })
          );

          if (!insertError) {
            const { data: refetched } = await supabase.from('floor_data').select('*').order('id', { ascending: true });
            if (refetched) setFloorData(refetched);
          } else {
            console.error('Failed to insert default floor data:', insertError);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Removed localStorage useEffects


  const handleSermonSelect = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setView(ViewType.DETAIL);
    window.scrollTo(0, 0);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('shinkwang_is_admin', 'true');
    setView(ViewType.ADMIN_DASHBOARD);
  };

  const handleAdminLogout = () => {
    if (window.confirm('관리자 모드에서 로그아웃 하시겠습니까?')) {
      setIsAdmin(false);
      localStorage.removeItem('shinkwang_is_admin');
      setView(ViewType.ADMIN_LOGIN);
    }
  };

  const renderView = () => {
    switch (view) {
      case ViewType.HOME: return <HomeScreen setView={setView} pastorProfile={pastorProfile} floorData={floorData} />;
      case ViewType.BULLETIN: return <BulletinScreen bulletins={bulletins} />;
      case ViewType.PROGRAM: return <ProgramScreen batches={programBatches} setBatches={setProgramBatches} />;
      case ViewType.MEDIA: return <MediaScreen sermons={sermons} onSermonSelect={handleSermonSelect} />;
      case ViewType.MAP: return <MapScreen />;
      case ViewType.MORE: return <MoreScreen onSermonSelect={handleSermonSelect} setView={setView} />;
      case ViewType.RESERVATION: return <ReservationScreen reservations={reservations} setReservations={setReservations} setView={setView} />;
      case ViewType.AI_CHAT: return <AIChatScreen />;
      case ViewType.SITEMAP: return <SitemapScreen setView={setView} />;
      case ViewType.NOTICE: return <NoticeScreen />;
      case ViewType.SMALL_GROUP: return <SmallGroupScreen />;
      case ViewType.ALBUM: return <AlbumScreen />;
      case ViewType.ADMIN_LOGIN:
        if (isAdmin) {
          // 이미 로그인된 상태라면 바로 대시보드로 이동
          return (
            <AdminDashboardScreen
              setView={setView}
              sermons={sermons} setSermons={setSermons}
              bulletins={bulletins} setBulletins={setBulletins}
              smallGroups={smallGroups} setSmallGroups={setSmallGroups}
              praiseTeams={praiseTeams} setPraiseTeams={setPraiseTeams}
              praiseBands={praiseBands} setPraiseBands={setPraiseBands}
              departments={departments} setDepartments={setDepartments}
              reservations={reservations} setReservations={setReservations}
              pastorProfile={pastorProfile} setPastorProfile={setPastorProfile}
              floorData={floorData} setFloorData={setFloorData}
              onLogout={handleAdminLogout}
            />
          );
        }
        return <AdminLoginScreen setView={setView} onLoginSuccess={handleAdminLoginSuccess} />;
      case ViewType.ADMIN_DASHBOARD:
        if (!isAdmin) {
          // 로그인되지 않은 상태라면 로그인 화면으로 리다이렉트
          return <AdminLoginScreen setView={setView} onLoginSuccess={handleAdminLoginSuccess} />;
        }
        return (
          <AdminDashboardScreen
            setView={setView}
            sermons={sermons} setSermons={setSermons}
            bulletins={bulletins} setBulletins={setBulletins}
            smallGroups={smallGroups} setSmallGroups={setSmallGroups}
            praiseTeams={praiseTeams} setPraiseTeams={setPraiseTeams}
            praiseBands={praiseBands} setPraiseBands={setPraiseBands}
            departments={departments} setDepartments={setDepartments}
            reservations={reservations} setReservations={setReservations}
            pastorProfile={pastorProfile} setPastorProfile={setPastorProfile}
            floorData={floorData} setFloorData={setFloorData}
            onLogout={handleAdminLogout}
          />
        );
      case ViewType.DETAIL:
        return selectedSermon ? (
          <SermonDetailScreen sermon={selectedSermon} onSermonSelect={handleSermonSelect} allSermons={sermons} />
        ) : <MediaScreen sermons={sermons} onSermonSelect={handleSermonSelect} />;
      default: return <HomeScreen setView={setView} />;
    }
  };

  const getViewTitle = () => {
    switch (view) {
      case ViewType.HOME: return "성남신광교회";
      case ViewType.BULLETIN: return "온라인 주보";
      case ViewType.PROGRAM: return "양육 프로그램";
      case ViewType.MEDIA: return "설교 미디어";
      case ViewType.MAP: return "오시는 길";
      case ViewType.MORE: return "더보기";
      case ViewType.RESERVATION: return "공간 예약 신청";
      case ViewType.AI_CHAT: return "AI 성경 길잡이";
      case ViewType.DETAIL: return "말씀 상세";
      case ViewType.SITEMAP: return "사이트맵";
      case ViewType.NOTICE: return "공지사항";
      case ViewType.SMALL_GROUP: return "소그룹 공동체";
      case ViewType.ALBUM: return "교회앨범";
      case ViewType.ADMIN_LOGIN: return "관리자 로그인";
      case ViewType.ADMIN_DASHBOARD: return "관리자 대시보드";
      default: return "성남신광교회";
    }
  };

  return (
    <div className="min-h-screen bg-navy-light dark:bg-navy-dark font-sans selection:bg-primary/30">
      <Layout
        currentView={view === ViewType.DETAIL ? ViewType.MEDIA : (view === ViewType.ADMIN_DASHBOARD || view === ViewType.ADMIN_LOGIN ? ViewType.MORE : view)}
        setView={setView}
        title={getViewTitle()}
        showBack={view !== ViewType.HOME}
      >
        {renderView()}
      </Layout>
    </div>
  );
};

export default App;
