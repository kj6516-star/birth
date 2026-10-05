import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../back/supabaseClient'; // 💡 본인 프로젝트의 supabaseClient.js 경로에 맞게 수정해주세요!
import ActorDetail2 from './ActorDetail2';

export default function Entertainer() {
  const [actors, setActors] = useState([]); // DB에서 가져온 아티스트 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [selectedActor, setSelectedActor] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // 컴포넌트가 처음 마운트될 때 Supabase 'Actors' 테이블에서 데이터 가져오기
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const { data, error } = await supabase
          .from('Actors') // 👈 대소문자 정확히 일치하는 테이블명
          .select('*');

        if (error) {
          throw error;
        }

        setActors(data || []);
      } catch (error) {
        console.error('아티스트 데이터를 불러오는 중 오류가 발생했습니다:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, []);

  return (
    <div className="w-full bg-white text-neutral-900 min-h-screen flex flex-col justify-between selection:bg-black selection:text-white">
      
      {/* 1. 상단 타이틀 섹션 (인쇄 시 숨김) */}
      <section className="w-full pt-32 pb-16 px-6 text-center border-b border-neutral-100 print:hidden">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-semibold tracking-[0.4em] text-neutral-400 uppercase">
            TK MANAGEMENT ARTISTS
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
            ARTIST
          </h1>
        </div>
      </section>

      {/* 2. 2열 그리드 갤러리 섹션 (인쇄 시 숨김) */}
      <section className="max-w-6xl mx-auto px-6 py-20 w-full flex-1 print:hidden">
        {loading ? (
          <div className="text-center py-20 text-neutral-400">데이터를 불러오는 중입니다...</div>
        ) : actors.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">등록된 아티스트가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-20">
            {actors.map((actor) => {
              const isDimmed = hoveredId !== null && hoveredId !== actor.id;

              return (
                <div 
                  key={actor.id} 
                  onMouseEnter={() => setHoveredId(actor.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedActor(actor)}
                  className={`cursor-pointer group flex flex-col transition-all duration-500 ease-in-out ${
                    isDimmed ? 'opacity-60' : 'opacity-100'
                  }`}
                >
                  <div className="w-full aspect-[3/4] overflow-hidden bg-neutral-100 shadow-sm relative">
                    <motion.img 
                      layoutId={`actor-img-${actor.id}`}
                      src={actor.image} 
                      alt={actor.name} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-1000 ease-out"
                    />
                  </div>

                  <div className="pt-4 flex justify-between items-baseline px-1">
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight group-hover:text-black transition">
                      {actor.name}
                    </h3>
                    <p className="text-xs text-neutral-400 tracking-widest uppercase font-medium">
                      {actor.englishName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. 푸터 (인쇄 시 숨김) */}
      <footer className="w-full py-16 border-t border-neutral-100 text-center text-xs text-neutral-400 tracking-widest print:hidden">
        <p>© TK MANAGEMENT. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* 4. 애니메이션이 적용된 새 상세 모달 컴포넌트 연결 */}
      <AnimatePresence>
        {selectedActor && (
          <ActorDetail2 
            actor={selectedActor} 
            onClose={() => setSelectedActor(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}