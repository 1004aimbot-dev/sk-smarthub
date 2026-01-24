
import React, { useState, useMemo } from 'react';
import { MOCK_ALBUMS } from '../constants';
import { Album, AlbumImage } from '../types';

export const AlbumScreen: React.FC = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('전체');
  const [viewingImage, setViewingImage] = useState<AlbumImage | null>(null);

  const filters = ['전체', '예배', '행사', '모임', '다음세대'];

  const filteredAlbums = useMemo(() => {
    if (activeFilter === '전체') return MOCK_ALBUMS;
    return MOCK_ALBUMS.filter(album => album.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="flex flex-col gap-6 p-5 bg-[#F8FAFC] dark:bg-navy-dark min-h-full pb-24 animate-in fade-in duration-500">
      
      {/* 필터 바 */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-5 px-5 sticky top-0 z-20 bg-[#F8FAFC]/90 dark:bg-navy-dark/90 backdrop-blur-md">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-black transition-all shadow-sm border ${
              activeFilter === filter 
                ? 'bg-navy-dark dark:bg-primary text-primary dark:text-navy-dark border-transparent' 
                : 'bg-white dark:bg-navy-accent text-gray-400 border-gray-100 dark:border-white/5'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 앨범 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredAlbums.map(album => (
          <div 
            key={album.id}
            onClick={() => setSelectedAlbum(album)}
            className="group bg-white dark:bg-navy-accent rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <img 
                src={album.thumbnail} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt={album.title} 
              />
              <div className="absolute top-4 left-4">
                <span className="bg-navy-dark/60 backdrop-blur-md text-primary text-[9px] font-black px-3 py-1 rounded-full border border-primary/20">
                  {album.category}
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="bg-white/90 dark:bg-navy-dark/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                  <span className="material-symbols-outlined text-sm text-primary filled">photo_library</span>
                  <span className="text-[10px] font-black text-navy-dark dark:text-white">{album.images.length}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-black text-navy-dark dark:text-white group-hover:text-primary transition-colors truncate">{album.title}</h4>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-2">
                <span className="material-symbols-outlined text-sm">event</span>
                {album.date}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 앨범 상세 모달 */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 sm:items-center sm:p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedAlbum(null)}></div>
          <div className="relative transform overflow-hidden rounded-[3rem] bg-white dark:bg-navy-dark text-left shadow-2xl transition-all w-full max-w-lg animate-in slide-in-from-bottom-10 duration-500 flex flex-col max-h-[90vh]">
            <div className="p-8 pb-4 shrink-0 flex justify-between items-start border-b border-gray-100 dark:border-white/5">
              <div className="flex flex-col gap-1 pr-12">
                <span className="text-primary text-[10px] font-black uppercase tracking-widest">{selectedAlbum.category}</span>
                <h3 className="text-2xl font-black text-navy-dark dark:text-white tracking-tight leading-tight">{selectedAlbum.title}</h3>
                <p className="text-xs text-gray-400 font-bold mt-1">{selectedAlbum.date} 촬영</p>
              </div>
              <button onClick={() => setSelectedAlbum(null)} className="size-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-gray-400">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 px-2 font-medium">
                {selectedAlbum.description}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedAlbum.images.map(img => (
                  <div 
                    key={img.id}
                    onClick={() => setViewingImage(img)}
                    className="relative aspect-square rounded-2xl overflow-hidden group cursor-zoom-in shadow-md bg-gray-100"
                  >
                    <img src={img.url} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-white">zoom_in</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 확대 뷰어 */}
      {viewingImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 animate-in fade-in duration-300 p-4">
          <div className="relative w-full max-w-4xl flex flex-col gap-4">
            <button 
              onClick={() => setViewingImage(null)}
              className="absolute -top-12 right-0 size-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="rounded-2xl overflow-hidden flex items-center justify-center">
              <img src={viewingImage.url} className="w-full h-auto max-h-[80vh] object-contain shadow-2xl" alt="" />
            </div>
            {viewingImage.caption && (
              <div className="text-center py-4 bg-black/40 backdrop-blur-md rounded-2xl">
                <p className="text-white font-black text-lg">{viewingImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
