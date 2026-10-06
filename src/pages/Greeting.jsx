// src/components/Greeting.jsx
import React from 'react';

export default function Greeting() {
  return (
    <div className="w-full bg-[#121214] text-neutral-900 select-none min-h-screen flex flex-col justify-between">
      
      {/* 1. 상단 비주얼 / 타이틀 섹션 */}
      <section className="w-full pt-20 md:pt-28 pb-10 md:pb-16 px-5 md:px-6 text-center bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto space-y-2 md:space-y-3">
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            GREETING
          </span>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-neutral-900">
            대표 인사말
          </h1>
        </div>
      </section>

      {/* 2. 메인 인사말 내용 섹션 */}
      <section className="relative w-full bg-[#18181b] py-12 md:py-20 px-4 md:px-12 text-neutral-200 flex-grow flex items-center justify-center">
        
        {/* 중앙 카드 영역 */}
        <div className="relative z-10 max-w-3xl w-full bg-[#222226] border border-neutral-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-5 md:p-14">
          
          {/* 상단 골드 포인트 바 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700" />

          {/* 대표 타이틀 정보 */}
          <div className="mb-6 md:mb-8 border-b border-neutral-700/60 pb-5 md:pb-6 flex justify-between items-end">
            <div>
              <span className="text-[10px] md:text-xs tracking-widest text-amber-400 uppercase block mb-1 font-medium">Chief Executive Officer</span>
              <h2 className="text-xl md:text-3xl font-bold tracking-wider text-white">
                조 태 경
              </h2>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs tracking-[0.2em] text-amber-500 font-semibold uppercase">TK MANAGEMENT</span>
            </div>
          </div>

          {/* 인사말 본문 내용 (모바일 폰트 크기 및 PC 대응 최적화) */}
          <div className="space-y-6 md:space-y-8 text-base md:text-xl font-light leading-relaxed text-neutral-300 tracking-tight text-left">
            <p className="font-normal text-white text-lg md:text-2xl border-l-2 border-amber-500 pl-3 md:pl-4 py-1">
              ㈜TK MANAGEMENT는 항상 진화합니다.
            </p>
            
            <p className="leading-loose text-neutral-300 text-sm md:text-xl">
              TK MANAGEMENT는 창의적인 마인드와 끊임없는 열정을 바탕으로 엔터테인먼트 사업의 선진화와 가치 확보를 위해 노력하고 있습니다. 현실에 안주하지 않고 끊임없이 전진하는 전문가 아티스트가 TKM을 더욱 더 빛나게 하는 요소가 된다고 생각합니다.
            </p>

            <p className="leading-loose text-neutral-300 text-sm md:text-xl">
              콘텐츠가 가지는 본질적인 가치와 감동, 아티스트 발굴 및 육성, 매니지먼트 등 다양한 비즈니스 모델로 엔터테인먼트의 미래를 선도해 나가겠습니다.
            </p>
          </div>

          {/* 하단 서명 */}
          <div className="mt-10 md:mt-12 pt-5 md:pt-6 border-t border-neutral-700/60 text-right">
            <p className="text-sm md:text-xl tracking-widest text-neutral-400 font-light">
              임직원 및 대표 <span className="text-white font-semibold ml-2">조 태 경</span>
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}