import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ActorDetail2({ actor, onClose }) {
  if (!actor) return null;

  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const handleCastingInquiry = () => {
    onClose();
    navigate('/contact', { state: { actorName: actor.name } });
  };

  // 💡 우선순위 정렬용 배열 (데이터베이스에 있는 키들을 이 순서대로 정렬하며, 없는 키도 누락 없이 뒤에 자동 추가됩니다)
  const preferredOrder = ['movie', 'drama', 'theater', 'performance', 'musical', 'broadcast', 'cf', 'commercial', 'etc'];

  // actor.filmography에 실제로 존재하는 키들을 가져와서 우선순위에 맞게 정렬
  const getSortedFilmKeys = () => {
    if (!actor.filmography) return [];
    const keys = Object.keys(actor.filmography);
    
    return keys.sort((a, b) => {
      const indexA = preferredOrder.indexOf(a.toLowerCase());
      const indexB = preferredOrder.indexOf(b.toLowerCase());
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  };

  const getCategoryTitle = (key) => {
    switch (key.toLowerCase()) {
      case 'movie': return '• MOVIE (영화)';
      case 'drama': return '• DRAMA (드라마)';
      case 'theater': 
      case 'performance': return '• THEATER / PERFORMANCE (연극/공연)';
      case 'musical': return '• MUSICAL (뮤지컬)';
      case 'broadcast': return '• BROADCAST (방송)';
      case 'cf': 
      case 'commercial': return '• CF / AD (광고)';
      case 'etc': return '• ETC (기타)';
      default: return `• ${key.toUpperCase()}`;
    }
  };

  const sortedFilmKeys = getSortedFilmKeys();

  return (
    <>
      {/* ==========================================
          1. 웹 화면용 모달 (인쇄 시 숨김)
          ========================================== */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-10 print:hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-white text-neutral-900 shadow-2xl rounded-2xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        >
          {/* 닫기 버튼 */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-20 text-neutral-400 hover:text-black transition text-sm tracking-widest font-semibold uppercase bg-white/80 backdrop-blur px-2 py-1 rounded"
          >
            [ CLOSE ]
          </button>

          {/* 좌측: 배우 사진 */}
          <div className="w-full md:w-1/2 bg-neutral-100 p-8 md:p-12 flex items-center justify-center shrink-0">
            <motion.div 
              layoutId={`actor-img-${actor.id}`}
              className="w-full max-w-sm aspect-[3/4] shadow-md overflow-hidden bg-neutral-200"
            >
              <img src={actor.image} alt={actor.name} className="w-full h-full object-cover object-top" />
            </motion.div>
          </div>

          {/* 우측: 상세 정보 및 WORKS */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-8 pb-8">
              
              {/* 이름 및 SNS 아이콘 영역 */}
              <div className="flex flex-col space-y-4 border-b border-neutral-100 pb-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{actor.name}</h2>
                  <p className="text-xs text-neutral-400 tracking-widest uppercase mt-1">{actor.englishName}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center shadow-sm" title="Instagram Icon">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center shadow-sm" title="YouTube Icon">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-xs md:text-sm space-y-2 text-neutral-600 border-b border-neutral-100 pb-6">
                {actor.birth && <div className="flex"><span className="w-20 font-semibold text-neutral-400 uppercase">생년월일</span><span>{actor.birth}</span></div>}
                {actor.height && <div className="flex"><span className="w-20 font-semibold text-neutral-400 uppercase">키</span><span>{actor.height}</span></div>}
                {actor.education && <div className="flex"><span className="w-20 font-semibold text-neutral-400 uppercase">학력</span><span>{actor.education}</span></div>}
              </div>

              {/* WORKS */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold tracking-[0.2em] text-neutral-900 uppercase">WORKS</h3>
                
                {sortedFilmKeys.map((key) => {
                  const list = actor.filmography[key];
                  if (!list || list.length === 0) return null;
                  return (
                    <div key={key} className="text-sm space-y-1">
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                        {getCategoryTitle(key)}
                      </span>
                      <div className="space-y-1 text-neutral-700 text-xs md:text-sm">
                        {list.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="font-semibold text-neutral-500 w-10 shrink-0">{item.year}</span>
                            <span className="flex-1">{Array.isArray(item.works) ? item.works.join(', ') : item.works}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 하단 액션 버튼 */}
            <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center gap-4 bg-white shrink-0 mt-auto">
              <button
                onClick={handlePrint}
                className="w-full sm:flex-1 h-14 px-6 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs md:text-sm flex items-center justify-center gap-3 transition shadow-sm shrink-0"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>DOWNLOAD PROFILE</span>
              </button>

              <button
                onClick={handleCastingInquiry}
                className="w-full sm:flex-1 h-14 px-6 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-xs md:text-sm flex items-center justify-center gap-3 transition shadow-sm shrink-0"
              >
                <svg className="w-4 h-4 text-neutral-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>배우 캐스팅 문의</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ==========================================
          2. 인쇄 전용 이력서 템플릿
          ========================================== */}
      <div className="hidden print:block bg-white text-black p-8 font-sans w-[210mm] min-h-[297mm] mx-auto box-border">
        
        {/* 문서 상단 헤더 */}
        <div className="flex justify-between items-end border-b-2 border-black pb-3 mb-6">
          <div>
            <h1 className="text-xl font-black tracking-wider">TK MANAGEMENT</h1>
            <p className="text-[9px] text-neutral-500 tracking-widest">TK Company Actors Division</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold tracking-widest">OFFICIAL ACTOR PROFILE</p>
            <p className="text-[8px] text-neutral-400">CONFIDENTIAL / CASTING PURPOSES ONLY</p>
          </div>
        </div>

        {/* 프로필 핵심 정보 (사진 + 스펙) */}
        <div className="flex gap-6 mb-6">
          <div className="w-[150px] shrink-0">
            <div className="aspect-[3/4] bg-neutral-200 border border-neutral-300 overflow-hidden mb-1">
              <img src={actor.image} alt={actor.name} className="w-full h-full object-cover object-top" />
            </div>
            <p className="text-[10px] text-center text-neutral-600 font-medium">{actor.name} ({actor.englishName})</p>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className="text-[9px] text-neutral-400 uppercase tracking-widest">ACTOR PROFILE</p>
              <h2 className="text-2xl font-bold">{actor.name}</h2>
              <p className="text-[11px] text-neutral-500">{actor.englishName}</p>
            </div>

            <div className="grid grid-cols-3 border-t border-b border-neutral-300 py-2.5 text-xs">
              <div>
                <span className="block text-[9px] text-neutral-400 uppercase">생년월일</span>
                <span className="font-medium">{actor.birth || '-'}</span>
              </div>
              <div>
                <span className="block text-[9px] text-neutral-400 uppercase">신장</span>
                <span className="font-medium">{actor.height || '-'}</span>
              </div>
              <div>
                <span className="block text-[9px] text-neutral-400 uppercase">학력</span>
                <span className="font-medium">{actor.education || '-'}</span>
              </div>
            </div>

            {actor.introduction && (
              <p className="text-[11px] text-neutral-700 italic border-l-2 border-neutral-400 pl-3 py-0.5">
                "{actor.introduction}"
              </p>
            )}
          </div>
        </div>

        {/* 필모그래피 영역 */}
        <div className="space-y-4">
          <div className="border-b border-black pb-1.5">
            <h3 className="text-[11px] font-black tracking-widest uppercase">FILMOGRAPHY / 주요 활동 경력</h3>
          </div>

          {sortedFilmKeys.map((key) => {
            const list = actor.filmography[key];
            if (!list || list.length === 0) return null;
            return (
              <div key={key} className="space-y-1">
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase">{getCategoryTitle(key)}</h4>
                <div className="border-t border-neutral-200 text-[11px]">
                  {list.map((item, idx) => (
                    <div key={idx} className="flex py-1 border-b border-neutral-100 gap-4">
                      <span className="w-12 font-semibold text-neutral-500 shrink-0">{item.year}</span>
                      <span className="flex-1 font-medium">
                        {Array.isArray(item.works) ? item.works.join(', ') : item.works}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}