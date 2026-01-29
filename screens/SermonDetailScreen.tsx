
import React, { useState, useEffect } from 'react';
import { Sermon, ArchiveItem } from '../types';
import { MOCK_SERMONS } from '../constants';

interface SermonDetailScreenProps {
  sermon: Sermon;
  onSermonSelect: (sermon: Sermon) => void;
  allSermons?: Sermon[];
}

// 시간 문자열(MM:SS, HH:MM:SS)을 초 단위로 변환
const timeToSeconds = (timeStr?: string): number | undefined => {
  if (!timeStr) return undefined;
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return undefined;
};

// 유튜브 URL에서 Embed URL 생성 (시작/종료 시간 포함)
const getYoutubeEmbedUrl = (url?: string, start?: string, end?: string) => {
  if (!url) return undefined;

  let videoId = '';
  if (url.includes('youtu.be')) {
    videoId = url.split('/').pop()?.split('?')[0] || '';
  } else if (url.includes('youtube.com')) {
    const urlObj = new URL(url);
    videoId = urlObj.searchParams.get('v') || '';
  }

  if (!videoId) return url; // 비디오 ID 추출 실패 시 원본 반환

  let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`; // autoplay, rel=0(관련영상 최소화), modestbranding 추가

  const startSeconds = timeToSeconds(start);
  const endSeconds = timeToSeconds(end);

  if (startSeconds !== undefined) embedUrl += `&start=${startSeconds}`;
  if (endSeconds !== undefined) embedUrl += `&end=${endSeconds}`;

  return embedUrl;
};

export const SermonDetailScreen: React.FC<SermonDetailScreenProps> = ({ sermon, onSermonSelect, allSermons }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MOCK 대신 실제 데이터를 사용, 없으면 MOCK 사용 (하위 호환)
  const sourceSermons = allSermons && allSermons.length > 0 ? allSermons : MOCK_SERMONS;
  const recommendations = sourceSermons.filter(s => s.id !== sermon.id).slice(0, 2);

  useEffect(() => {
    // 보관 상태 로드
    const bookmarks = JSON.parse(localStorage.getItem('shinkwang_bookmarks') || '[]');
    setIsBookmarked(bookmarks.some((b: Sermon) => b.id === sermon.id));

    // 노트 내용 로드
    const notes = JSON.parse(localStorage.getItem('shinkwang_notes') || '{}');
    setNoteContent(notes[sermon.id] || '');
  }, [sermon.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('shinkwang_bookmarks') || '[]');
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((b: Sermon) => b.id !== sermon.id);
      showToast('보관함에서 삭제되었습니다.');
    } else {
      newBookmarks = [...bookmarks, sermon];
      showToast('보관함에 저장되었습니다.');
    }
    localStorage.setItem('shinkwang_bookmarks', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `[성남신광교회] ${sermon.title}`;
    const shareText = `${sermon.preacher}의 말씀: ${sermon.title}\n함께 은혜 나누길 원합니다.`;

    // 1순위: Web Share API (모바일 네이티브 공유)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // 사용자가 취소한 경우는 무시
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // 2순위: 클립보드 복사 (모든 브라우저용 백업)
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n${shareUrl}`);
      showToast('공유 링크가 클립보드에 복사되었습니다.');
    } catch (err) {
      showToast('공유 기능을 사용할 수 없습니다.');
    }
  };

  const saveNote = () => {
    const notes = JSON.parse(localStorage.getItem('shinkwang_notes') || '{}');
    if (noteContent.trim()) {
      notes[sermon.id] = noteContent;
      showToast('묵상 노트가 저장되었습니다.');
    } else {
      delete notes[sermon.id];
      showToast('노트가 삭제되었습니다.');
    }
    localStorage.setItem('shinkwang_notes', JSON.stringify(notes));
    setIsNoteOpen(false);
  };

  const startDownload = (fileName: string) => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);

          const dummyData = new Blob(["오디오 데이터 시뮬레이션"], { type: "audio/mpeg" });
          const url = window.URL.createObjectURL(dummyData);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName}.mp3`;
          link.click();
          window.URL.revokeObjectURL(url);

          setTimeout(() => {
            setIsDownloading(false);
            showToast('음원 저장이 완료되었습니다.');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return 'picture_as_pdf';
      case 'HWP':
      case 'DOCX': return 'description';
      case 'ZIP': return 'folder_zip';
      default: return 'attachment';
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-navy-dark min-h-full relative">
      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-navy-dark/95 text-white px-8 py-4 rounded-full text-xs font-black shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 border border-white/10 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm filled">info</span>
          {toastMessage}
        </div>
      )}

      {/* 영상 플레이어 영역 */}
      <div className="aspect-video bg-black w-full relative">
        {sermon.videoUrl ? (
          <iframe
            src={getYoutubeEmbedUrl(sermon.videoUrl, sermon.startTime, sermon.endTime)}
            className="w-full h-full"
            title={sermon.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white gap-2">
            <span className="material-symbols-outlined text-4xl">video_library</span>
            <p className="text-sm font-medium">영상을 불러올 수 없습니다.</p>
          </div>
        )}
      </div>

      {/* 본문 정보 영역 */}
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black text-navy-dark dark:text-white leading-tight">
            {sermon.title}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="size-9 rounded-full bg-gray-100 dark:bg-navy-accent flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/5">
              <span className="material-symbols-outlined text-gray-400">person</span>
            </div>
            <span className="text-sm font-bold text-navy-dark dark:text-white">{sermon.preacher}</span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2 py-4 justify-between">
          <ActionButton
            icon="share"
            label="공유하기"
            onClick={handleShare}
          />
          <ActionButton
            icon="bookmark"
            label={isBookmarked ? "보관됨" : "보관하기"}
            active={isBookmarked}
            onClick={toggleBookmark}
          />
          <ActionButton
            icon="edit_note"
            label="말씀노트"
            active={!!noteContent}
            onClick={() => setIsNoteOpen(true)}
          />
          <ActionButton
            icon={isDownloading ? "sync" : "download"}
            label={isDownloading ? `${downloadProgress}%` : "음원저장"}
            onClick={() => startDownload(sermon.title)}
            loading={isDownloading}
          />
        </div>

        <div className="h-px bg-gray-100 dark:bg-white/5 w-full"></div>

        {/* 말씀 요약 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="font-bold text-navy-dark dark:text-white text-base">말씀 요약</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {sermon.description || "등록된 말씀 요약 정보가 없습니다."}
          </p>
        </div>

        {/* 첨부 파일 섹션 */}
        {sermon.attachments && sermon.attachments.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              <h3 className="font-bold text-navy-dark dark:text-white text-base">첨부 파일</h3>
            </div>
            <div className="flex flex-col gap-2">
              {sermon.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-navy-accent/50 rounded-2xl border border-gray-100 dark:border-white/5 group transition-all"
                >
                  <div className="size-10 rounded-xl bg-white dark:bg-navy-dark flex items-center justify-center text-primary shadow-sm border border-gray-100 dark:border-white/10 shrink-0">
                    <span className="material-symbols-outlined text-xl">{getFileIcon(file.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-dark dark:text-gray-200 truncate">{file.title}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{file.type} · {file.size}</p>
                  </div>
                  <button
                    onClick={() => startDownload(file.title)}
                    className="size-10 rounded-full bg-white dark:bg-navy-dark flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 border border-gray-100 dark:border-white/5 active:scale-90 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-px bg-gray-100 dark:bg-white/5 w-full mt-2"></div>

        {/* 관련 추천 말씀 */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-navy-dark dark:text-white text-base">추천 말씀</h3>
          <div className="flex flex-col gap-3">
            {recommendations.map(item => (
              <div
                key={item.id}
                onClick={() => onSermonSelect(item)}
                className="flex gap-4 bg-gray-50 dark:bg-navy-accent/50 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-accent transition-colors border border-transparent hover:border-primary/10 active:scale-[0.98]"
              >
                <div className="w-24 h-14 rounded-lg bg-cover bg-center overflow-hidden shrink-0" style={{ backgroundImage: `url(${item.thumbnail})` }}>
                  <div className="w-full h-full bg-black/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">play_circle</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="text-xs font-bold text-navy-dark dark:text-white truncate">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-1">{item.date} · {item.preacher}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 말씀노트 모달 */}
      {isNoteOpen && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center px-4 pb-10 sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsNoteOpen(false)}></div>
          <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-navy-dark text-left shadow-2xl transition-all w-full max-w-sm animate-in slide-in-from-bottom-10 duration-300 border border-gray-100 dark:border-white/10">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                  <h4 className="text-xl font-black text-navy-dark dark:text-white">말씀 묵상 노트</h4>
                  <p className="text-[10px] text-primary font-bold">{sermon.title}</p>
                </div>
                <button onClick={() => setIsNoteOpen(false)} className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400">close</span>
                </button>
              </div>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="말씀을 통해 받은 은혜와 결단을 기록해보세요..."
                className="w-full h-48 bg-gray-50 dark:bg-navy-accent border-none rounded-2xl p-4 text-sm font-medium dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-inner resize-none"
              ></textarea>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => setIsNoteOpen(false)}
                  className="py-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 font-black text-sm active:scale-95 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={saveNote}
                  className="py-4 rounded-2xl bg-primary text-navy-dark font-black text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  노트 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionButton: React.FC<{ icon: string; label: string; onClick: () => void; active?: boolean; loading?: boolean }> = ({ icon, label, onClick, active, loading }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 flex-1 group active:scale-90 transition-transform"
  >
    <div className={`size-14 rounded-full flex items-center justify-center transition-all border border-transparent ${active
      ? 'bg-primary/20 text-primary border-primary/30'
      : 'bg-[#F8FAFC] dark:bg-navy-accent text-gray-500 group-hover:bg-primary/5 group-hover:text-primary border-gray-100 dark:border-white/5 shadow-sm'
      }`}>
      <span className={`material-symbols-outlined text-[24px] ${active ? 'filled' : ''} ${loading ? 'animate-spin' : ''}`}>
        {icon}
      </span>
    </div>
    <span className={`text-[11px] font-bold transition-colors ${active ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>{label}</span>
  </button>
);
