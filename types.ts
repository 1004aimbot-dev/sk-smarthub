
export enum ViewType {
  HOME = 'HOME',
  BULLETIN = 'BULLETIN',
  MEDIA = 'MEDIA',
  MAP = 'MAP',
  MORE = 'MORE',
  RESERVATION = 'RESERVATION',
  DETAIL = 'DETAIL',
  SITEMAP = 'SITEMAP',
  AI_CHAT = 'AI_CHAT',
  NOTICE = 'NOTICE',
  SMALL_GROUP = 'SMALL_GROUP',
  ALBUM = 'ALBUM',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface BulletinRecord {
  id: string;
  date: string;
  displayDate: string;
  title: string;
  preacher: string;
  description: string;
  volume: string;
  isSpecial?: boolean;
}

export interface AlbumImage {
  id: string;
  url: string;
  caption?: string;
}

export interface Album {
  id: string;
  title: string;
  date: string;
  category: '예배' | '행사' | '모임' | '다음세대';
  thumbnail: string;
  images: AlbumImage[];
  description?: string;
}

export interface PraiseTeam {
  id: string;
  name: string;
  leader: string;
  manager: string;
  treasurer: string;
  secretary: string;
  conductor: string;
  accompanist: string;
  description: string;
}

export interface PraiseBand {
  id: string;
  name: string;
  leader: string;
  vocal: string;
  instrument: string;
  worshipTime: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  pastor: string;
  worshipTime: string;
  location: string;
  head: string;
  deputyHead: string;
  description: string;
}

export interface PastorProfile {
  name: string;
  quote: string;
  content: string;
  image: string;
}

export interface RoomDetail {
  id: string;
  no: string;
  name: string;
  desc: string;
  features: string[];
}

export interface FloorData {
  floor: string;
  title: string;
  summary: string;
  icon: string;
  rooms: RoomDetail[];
}

export interface ArchiveItem {
  id: string;
  title: string;
  date: string;
  size: string;
  type: string;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  category: string;
  thumbnail: string;
  description?: string;
  videoUrl?: string;
  attachments?: ArchiveItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  images?: string[]; 
}

export interface ReservationData {
  id: string;
  roomId: string;
  roomName: string;
  applicantName: string; 
  date: string;
  startTime: string;
  endTime: string;
  headcount: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface Notice {
  id: number;
  tag: '필독' | '행사' | '일반' | '모임';
  title: string;
  date: string;
  content: string;
}

export interface SmallGroup {
  id: string;
  category: string; 
  name: string;
  leader: string;
  time: string;
  location: string;
  description: string;
  tags: string[];
}

export interface SmallGroupCategory {
  id: string;
  name: string;
}
