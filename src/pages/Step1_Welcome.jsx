import React from 'react';
import ch12 from '../images/12.png';

export default function Step1_Welcome({ onNext }) {
  return (
    <div className="relative max-w-sm mx-auto my-4 p-6 bg-[#2a1a11] text-[#e6c894] rounded-lg shadow-2xl border-4 border-[#8c673d] overflow-hidden select-none">
      
      {/* 바깥쪽 앤틱 프레임 테두리 */}
      <div className="border-2 border-[#b89355] p-4 rounded relative bg-[#23150d]/80">
        
        {/* 모서리 고전 장식 포인트 */}
        <div className="absolute top-1 left-1 text-xs text-[#b89355]">✦</div>
        <div className="absolute top-1 right-1 text-xs text-[#b89355]">✦</div>
        <div className="absolute bottom-1 left-1 text-xs text-[#b89355]">✦</div>
        <div className="absolute bottom-1 right-1 text-xs text-[#b89355]">✦</div>

        <div className="border border-[#7a5931] p-5 flex flex-col items-center text-center space-y-6">
          
          {/* 상단 서브 타이틀 */}
          <p className="text-xs tracking-widest text-[#d4af37] opacity-90 font-light">
            
          </p>

          {/* 메인 타이틀 (고급스러운 앤틱 폰트 스타일) */}
          <h1 className="text-3xl font-black tracking-wider text-[#f3e3be] drop-shadow-md leading-tight">
            DINOSAUR<br />
            <span className="text-2xl text-[#d4af37]">EXPLORER</span>
          </h1>

          {/* 중앙 육각형 앤틱 엠블럼 */}
          <div className="relative my-2 w-36 h-40 flex items-center justify-center">
            {/* 육각형 테두리 SVG */}
            <svg
              className="absolute inset-0 w-full h-full text-[#b89355]"
              viewBox="0 0 100 115"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polygon points="50 3, 95 28, 95 85, 50 110, 5 85, 5 28" />
              <polygon points="50 8, 90 31, 90 82, 50 105, 10 82, 10 31" strokeWidth="0.8" strokeDasharray="2 2" />
              {/* 육각형 상하좌우 별 장식 */}
              <circle cx="50" cy="14" r="1.5" fill="currentColor" />
              <circle cx="50" cy="99" r="1.5" fill="currentColor" />
              <circle cx="18" cy="57" r="1.5" fill="currentColor" />
              <circle cx="82" cy="57" r="1.5" fill="currentColor" />
            </svg>

            {/* 중앙 공룡 심볼 */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
              <span className="text-4xl filter drop-shadow"><img src={ch12} /></span>
              
            </div>
          </div>

          {/* 하단 설명 문구 */}
          <div className="space-y-2 text-sm text-[#c9b088] leading-relaxed">
            <p className="font-medium">
              공룡의 세계에 가고 싶은 <br />
              단 하나의 탐험가를 위하여
            </p>
            <div className="w-12 h-[1px] bg-[#8c673d] mx-auto my-2 opacity-60" />
            <p className="text-[12px] text-[#a68a60]">
              6번째 생일 기념 특별 탐험권
            </p>
          </div>

          {/* 앤틱 골드 스타일 버튼 */}
          <button
            onClick={onNext}
            className="w-full py-3.5 mt-2 bg-gradient-to-b from-[#d4af37] to-[#aa822c] text-[#1f110a] font-bold text-[15px] tracking-widest rounded border border-[#f5e5c0] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all duration-150"
          >
            탐험 시작하기
          </button>

        </div>
      </div>
    </div>
  );
}