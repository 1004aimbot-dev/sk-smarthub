
import React, { useState, useEffect } from 'react';
import { ViewType, Sermon, BulletinRecord, SmallGroup, PraiseTeam, PraiseBand, Department, ReservationData } from './types';
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
import {
  INITIAL_BULLETIN_RECORDS,
  MOCK_SERMONS,
  DEFAULT_SMALL_GROUPS,
  DEFAULT_PRAISE_TEAMS,
  DEFAULT_PRAISE_BANDS,
  DEFAULT_DEPARTMENTS
} from './constants';

// [베테랑 비책] 빈 배열([])도 엄연한 데이터입니다. null일 때만 초기값을 로드합니다.
const getInitialData = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(`Error parsing ${key}`, e);
      return defaultValue;
    }
  }
  return defaultValue;
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.HOME);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

  // 전역 상태 관리 (로컬스토리지 우선)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem('shinkwang_is_admin') === 'true');
  const [sermons, setSermons] = useState<Sermon[]>(() => getInitialData('shinkwang_sermons', MOCK_SERMONS));
  const [bulletins, setBulletins] = useState<BulletinRecord[]>(() => getInitialData('shinkwang_bulletins', INITIAL_BULLETIN_RECORDS));
  const [smallGroups, setSmallGroups] = useState<SmallGroup[]>(() => getInitialData('shinkwang_small_groups', DEFAULT_SMALL_GROUPS));
  const [praiseTeams, setPraiseTeams] = useState<PraiseTeam[]>(() => getInitialData('shinkwang_praise_teams', DEFAULT_PRAISE_TEAMS));
  const [praiseBands, setPraiseBands] = useState<PraiseBand[]>(() => getInitialData('shinkwang_praise_bands', DEFAULT_PRAISE_BANDS));
  const [departments, setDepartments] = useState<Department[]>(() => getInitialData('shinkwang_departments', DEFAULT_DEPARTMENTS));
  const [reservations, setReservations] = useState<ReservationData[]>(() => getInitialData('shinkwang_reservations', []));

  // 상태 변화 감지 즉시 로컬스토리지 저장 (Race Condition 방지)
  useEffect(() => { localStorage.setItem('shinkwang_sermons', JSON.stringify(sermons)); }, [sermons]);
  useEffect(() => { localStorage.setItem('shinkwang_bulletins', JSON.stringify(bulletins)); }, [bulletins]);
  useEffect(() => { localStorage.setItem('shinkwang_small_groups', JSON.stringify(smallGroups)); }, [smallGroups]);
  useEffect(() => { localStorage.setItem('shinkwang_praise_teams', JSON.stringify(praiseTeams)); }, [praiseTeams]);
  useEffect(() => { localStorage.setItem('shinkwang_praise_bands', JSON.stringify(praiseBands)); }, [praiseBands]);
  useEffect(() => { localStorage.setItem('shinkwang_departments', JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem('shinkwang_reservations', JSON.stringify(reservations)); }, [reservations]);

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
      case ViewType.HOME: return <HomeScreen setView={setView} />;
      case ViewType.BULLETIN: return <BulletinScreen bulletins={bulletins} />;
      case ViewType.MEDIA: return <MediaScreen sermons={sermons} onSermonSelect={handleSermonSelect} />;
      case ViewType.MAP: return <MapScreen />;
      case ViewType.MORE: return <MoreScreen onSermonSelect={handleSermonSelect} setView={setView} />;
      case ViewType.RESERVATION: return <ReservationScreen />;
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
            onLogout={handleAdminLogout}
          />
        );
      case ViewType.DETAIL:
        return selectedSermon ? (
          <SermonDetailScreen sermon={selectedSermon} onSermonSelect={handleSermonSelect} />
        ) : <MediaScreen sermons={sermons} onSermonSelect={handleSermonSelect} />;
      default: return <HomeScreen setView={setView} />;
    }
  };

  const getViewTitle = () => {
    switch (view) {
      case ViewType.HOME: return "성남신광교회";
      case ViewType.BULLETIN: return "온라인 주보";
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
