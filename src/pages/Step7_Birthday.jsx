import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function Step7_Birthday({ formData, onNext }) {
  const [candlesBlown, setCandlesBlown] = useState(false);

  const handleBlowCandles = () => {
    setCandlesBlown(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    /* 최상위 컨테이너: h-[620px] 고정 크기 및 앤틱 일지 스타일 적용 */
    <div className="relative max-w-sm h-[620px] mx-auto my-4 p-3 bg-[#f4e4bc] text-[#3e2723] rounded-lg shadow-2xl border-4 border-[#8c673d] overflow-hidden select-none flex flex-col">
      
      {/* 바깥 노란선(골드 라인) 테두리 (flex-1로 영역 채우기) */}
      <div className="border-2 border-[#b89355] p-4 rounded relative shadow-inner flex-1 flex flex-col">
        
        {/* 모서리 고전 장식 포인트 */}
        <div className="absolute top-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute top-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>

        {/* 내부 콘텐츠 영역 (justify-between으로 상·중·하 레이아웃 고정) */}
        <div className="border border-[#bdae93] p-4 flex-1 flex flex-col justify-between text-center">
          
          {/* 상단 타이틀 영역 */}
          <div className="w-full space-y-1.5 border-b border-dashed border-[#bdae93] pb-2">
            <h2 className="text-base font-bold text-[#2a1a11]">🎂 축하합니다! 생일 파티!</h2>
            <p className="text-xs text-[#5d4037]">
              {formData.name || '탐험가'} ({formData.nickname || '꼬마탐험가'})의 6번째 생일을 진심으로 축하해요!
            </p>
          </div>

          {/* 중앙 가변 영역 (더욱 커진 대형 케이크) */}
          <div className="flex-1 flex flex-col justify-center items-center space-y-3 my-2">
            
            {/* 🌟 기존보다 훨씬 커진 케이크 박스 및 이모지 (text-8xl 적용) */}
            <div className="bg-[#f8f1e1] w-full py-8 rounded border border-[#decfae] flex flex-col items-center justify-center space-y-3 shadow-inner">
              <div className="text-2xl tracking-widest animate-bounce h-8 flex items-center">
                {candlesBlown ? '✨🎂✨' : '🔥🔥🔥🔥🔥🔥'}
              </div>
              <div className="text-8xl filter drop-shadow-lg my-1">
                🎂
              </div>
              <p className="text-xs font-bold text-[#8c673d] pt-1">
                {candlesBlown ? '진심으로 생일을 축하해요! ✨' : '후~ 하고 촛불을 꺼주세요!'}
              </p>
            </div>

            {/* 촛불 끄기 버튼 또는 완료 메시지 */}
            {!candlesBlown ? (
              <button
                type="button"
                onClick={handleBlowCandles}
                className="w-full py-3 bg-gradient-to-r from-[#d84315] to-[#d4af37] text-white font-bold rounded shadow hover:brightness-105 transition text-xs tracking-widest"
              >
                💨 촛불 끄기 (후~ 불기)
              </button>
            ) : (
              <div className="w-full space-y-2 animate-fade-in">
                <p className="text-xs font-bold text-[#2e7d32]">와! 축하해요~ 팡파르 팡팡! 🎉</p>
              </div>
            )}
          </div>

          {/* 하단 고정 영역 (다음 단계 버튼) */}
          <div className="w-full pt-2">
            {candlesBlown && (
              <button
                type="button"
                onClick={onNext}
                className="w-full py-3 bg-[#2a1a11] text-[#f4e4bc] font-bold rounded hover:bg-[#3e2723] transition text-xs shadow-md tracking-widest animate-fade-in"
              >
                공룡 전문가 자격증 받으러 가기 🏆 ➔
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}