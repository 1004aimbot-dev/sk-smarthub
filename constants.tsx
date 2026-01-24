
import { Sermon, ArchiveItem, PastorProfile, SmallGroup, SmallGroupCategory, FloorData, PraiseTeam, Department, PraiseBand, Album, BulletinRecord } from './types';

export const INITIAL_BULLETIN_RECORDS: BulletinRecord[] = [
  { id: 'b43', date: '2026.10.25', displayDate: '10월 25일', title: '너희는 세상의 빛이라', preacher: '이현용 담임목사', description: '성령강림후 제21주 (제 43호)', volume: '43' },
  { id: 'b42', date: '2026.10.18', displayDate: '10월 18일', title: '그리스도의 향기', preacher: '이현용 담임목사', description: '성령강림후 제20주 (제 42호)', volume: '42' },
  { id: 'b41', date: '2026.10.11', displayDate: '10월 11일', title: '믿음의 반석 위에', preacher: '이현용 담임목사', description: '성령강림후 제19주 (제 41호)', volume: '41' },
  { id: 'b40', date: '2026.10.04', displayDate: '10월 04일', title: '은혜의 보좌 앞으로', preacher: '이현용 담임목사', description: '성령강림후 제18주 (제 40호)', volume: '40' },
  { id: 'b39', date: '2026.09.27', displayDate: '9월 27일', title: '참된 평안의 길', preacher: '이현용 담임목사', description: '성령강림후 제17주 (제 39호)', volume: '39' },
  { id: 'b22', date: '2026.05.31', displayDate: '5월 31일', title: '성령의 열매를 맺으라', preacher: '이현용 담임목사', description: '성령강림주일 (제 22호)', volume: '22' },
  { id: 'b14', date: '2026.04.05', displayDate: '4월 05일', title: '부활의 소망', preacher: '이현용 담임목사', description: '부활주일 (제 14호)', volume: '14' },
  { id: 'b1', date: '2026.01.04', displayDate: '1월 04일', title: '보라 새 일을 행하리라', preacher: '이현용 담임목사', description: '신년감사예배 (제 1호)', volume: '1' },
];

export const MOCK_ALBUMS: Album[] = [
  {
    id: 'a1',
    title: '2026 전교인 가을 체육대회',
    date: '2026.10.15',
    category: '행사',
    thumbnail: 'https://picsum.photos/seed/church1/600/400',
    description: '온 교우가 하나 되어 기쁨으로 뛰어놀며 주님의 사랑을 나눈 시간이었습니다.',
    images: [
      { id: 'img1', url: 'https://picsum.photos/seed/event1/800/600', caption: '개회 선언과 준비운동' },
      { id: 'img2', url: 'https://picsum.photos/seed/event2/800/600', caption: '열띤 응원전 현장' },
      { id: 'img3', url: 'https://picsum.photos/seed/event3/800/600', caption: '우승팀 시상식' },
      { id: 'img4', url: 'https://picsum.photos/seed/event4/800/600', caption: '전교인 단체사진' }
    ]
  },
  {
    id: 'a2',
    title: '유치부 여름 성경학교',
    date: '2026.08.20',
    category: '다음세대',
    thumbnail: 'https://picsum.photos/seed/church2/600/400',
    description: '예수님의 성품을 닮아가는 우리 아이들의 순수한 웃음이 가득했습니다.',
    images: [
      { id: 'img5', url: 'https://picsum.photos/seed/kid1/800/600', caption: '신나는 찬양 율동 시간' },
      { id: 'img6', url: 'https://picsum.photos/seed/kid2/800/600', caption: '말씀 암송 퀴즈 대회' }
    ]
  }
];

export const DEFAULT_PRAISE_TEAMS: PraiseTeam[] = [
  { id: 'p1', name: '글로리아 찬양대', leader: '김대장 장로', manager: '이총무 집사', treasurer: '박회계 권사', secretary: '최서기 성도', conductor: '정지휘 지휘자', accompanist: '한반주 반주자', description: '주일 1부 예배를 섬기는 장엄한 찬양대입니다.' },
  { id: 'p2', name: '임마누엘 찬양대', leader: '최대장 장로', manager: '박총무 집사', treasurer: '성회계 권사', secretary: '임서기 성도', conductor: '조지휘 지휘자', accompanist: '김반주 반주자', description: '주일 2부 예배를 섬기는 은혜로운 찬양대입니다.' },
  { id: 'p3', name: '갈릴리 찬양대', leader: '이대장 장로', manager: '강총무 집사', treasurer: '윤회계 권사', secretary: '하서기 성도', conductor: '신지휘 지휘자', accompanist: '오반주 반주자', description: '주일 3부 예배를 섬기는 열정적인 찬양대입니다.' }
];

export const DEFAULT_PRAISE_BANDS: PraiseBand[] = [
  { id: 'pb1', name: '샬롬찬양단', leader: '이팀장 집사', vocal: '김싱어', instrument: '최건반, 정드럼', worshipTime: '주일 낮 예배', description: '기쁨의 찬양팀입니다.' },
  { id: 'pb2', name: '쉐마찬양단', leader: '박팀장 집사', vocal: '한싱어', instrument: '유기타, 신드럼', worshipTime: '주일 오후 예배', description: '말씀 찬양팀입니다.' },
  { id: 'pb3', name: '마라나타찬양단', leader: '김팀장 청년', vocal: '임싱어', instrument: '정건반', worshipTime: '청년부 예배', description: '열정 찬양팀입니다.' },
  { id: 'pb4', name: '아멘찬양단', leader: '최팀장 집사', vocal: '강싱어', instrument: '윤건반, 송드럼', worshipTime: '금요성령집회', description: '성령 찬양팀입니다.' },
  { id: 'pb5', name: '수요찬양단', leader: '정팀장 권사', vocal: '고싱어', instrument: '안건반', worshipTime: '수요예배', description: '전통 찬양팀입니다.' }
];

export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'd1', name: '영유아유치부', pastor: '이사랑 전도사', worshipTime: '주일 11:00', location: '303호', head: '김부장', deputyHead: '박차장', description: '어린 아이들의 신앙 기초를 세웁니다.' },
  { id: 'd2', name: '초등부', pastor: '김믿음 목사', worshipTime: '주일 11:00', location: '301호', head: '최부장', deputyHead: '이차장', description: '말씀 안에서 성장하는 어린이 공동체입니다.' },
  { id: 'd3', name: '청소년부', pastor: '박비전 전도사', worshipTime: '주일 09:00', location: '비전홀', head: '정부장', deputyHead: '강차장', description: '꿈과 열정이 있는 청소년 공동체입니다.' },
  { id: 'd4', name: '청년부', pastor: '최청년 목사', worshipTime: '주일 14:00', location: '비전홀', head: '한부장', deputyHead: '오차장', description: '세상의 빛이 되는 청년 공동체입니다.' }
];

export const DEFAULT_PASTOR_PROFILE: PastorProfile = {
  name: "이현용 담임목사",
  quote: "하나님을 기쁘시게, 사람을 행복하게 하는 공동체로 여러분을 초대합니다.",
  content: "할렐루야! 성남신광교회 홈페이지를 찾아주신 모든 분들을 주님의 이름으로 사랑하고 축복합니다.",
  image: "https://raw.githubusercontent.com/1004aimbot-dev/images/main/이현용담임목사1.png" 
};

export const DEFAULT_FLOOR_DATA: FloorData[] = [
  { 
    floor: "1층", 
    title: "로비 및 카페 (쉼과 교제)", 
    summary: "로뎀나무 카페, 사무실", 
    icon: "coffee", 
    rooms: [
      { id: 'r101', no: "101호", name: "로뎀나무 카페", desc: "성도들이 모여 담소를 나누고 차를 마시는 공간입니다.", features: ["커피", "디저트", "무선인터넷"] },
      { id: 'r102', no: "102호", name: "행정사무실", desc: "교회 행정 업무를 처리하는 곳입니다.", features: ["상담", "행정"] },
      { id: 'r103', no: "103호", name: "작은도서관", desc: "신앙 서적과 일반 도서가 비치된 북카페 형식의 도서관입니다.", features: ["도서대여", "독서"] }
    ] 
  },
  { 
    floor: "2층", 
    title: "비전홀 (행정/회의)", 
    summary: "201호 ~ 205호", 
    icon: "meeting_room", 
    rooms: [
      { id: 'r201', no: "201호", name: "대회의실", desc: "당회 및 중요 제직 회의 공간입니다.", features: ["스크린", "음향"] },
      { id: 'r202', no: "202호", name: "중회의실", desc: "각 부서 회의 및 교육 공간입니다.", features: ["냉난방"] },
      { id: 'r205', no: "205호", name: "새가족실", desc: "새가족 영접 및 상담 공간입니다.", features: ["상담", "다과"] }
    ] 
  },
  { 
    floor: "3층", 
    title: "세미나실 (교육/양육)", 
    summary: "301호 ~ 305호", 
    icon: "school", 
    rooms: [
      { id: 'r301', no: "301호", name: "대교육실", desc: "부서 예배 및 성경 공부 공간입니다.", features: ["음향", "피아노"] },
      { id: 'r303', no: "303호", name: "자모실", desc: "영유아와 부모님이 함께 예배드리는 공간입니다.", features: ["수유실", "매트"] },
      { id: 'r305', no: "305호", name: "소그룹실", desc: "제자훈련 및 사역자 교육 공간입니다.", features: ["집중교육"] }
    ] 
  },
  { 
    floor: "4층", 
    title: "찬양대실 (찬양/선교)", 
    summary: "401호 ~ 405호", 
    icon: "music_note", 
    rooms: [
      { id: 'r401', no: "401호", name: "글로리아 찬양대실", desc: "글로리아 찬양대 전용 연습실입니다.", features: ["피아노", "악보장", "방음"] },
      { id: 'r402', no: "402호", name: "임마누엘 찬양대실", desc: "임마누엘 찬양대 전용 연습실입니다.", features: ["피아노", "개인사물함"] },
      { id: 'r403', no: "403호", name: "갈릴리 찬양대실", desc: "갈릴리 찬양대 전용 연습실입니다.", features: ["피아노", "음향기기"] },
      { id: 'r405', no: "405호", name: "미디어 선교실", desc: "영상 및 미디어 사역 준비 공간입니다.", features: ["영상장비"] }
    ] 
  }
];

export const DEFAULT_SMALL_GROUP_CATEGORIES: SmallGroupCategory[] = [
  { id: 'cat_1', name: '교구' },
  { id: 'cat_2', name: '전도회' },
  { id: 'cat_3', name: '양육' },
];

export const DEFAULT_SMALL_GROUPS: SmallGroup[] = [
  { id: '1', category: '교구', name: '하대원 1교구', leader: '김은혜 권사', time: '금요일 11:00', location: '가정 순회', description: '말씀 나눔 공동체입니다.', tags: ['#말씀'] },
];

export const MOCK_SERMONS: Sermon[] = [
  { id: '1', title: '복음의 능력으로 사는 삶', preacher: '이현용 목사', date: '2026.10.29', category: '주일예배', thumbnail: 'https://picsum.photos/seed/sermon1/400/225', description: '복음의 능력에 대한 말씀입니다.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
];

export const MOCK_ARCHIVE: ArchiveItem[] = [
  { id: '1', title: '2026년 주보', date: '2026.11.05', size: '2.4MB', type: 'PDF' },
];
