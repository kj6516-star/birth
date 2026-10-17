import React from 'react';

export default function Step3_MissionGuide({ formData, onNext }) {
  return (
    /* 최상위 컨테이너: 고정 크기 유지 및 패딩 설정 */
    <div className="relative max-w-sm h-[620px] mx-auto my-4 p-3 bg-[#f4e4bc] text-[#3e2723] rounded-lg shadow-2xl border-4 border-[#8c673d] overflow-hidden select-none flex flex-col">
      
      {/* 바깥 노란선(골드 라인) 테두리 */}
      <div className="border-2 border-[#b89355] p-4 rounded relative shadow-inner flex-1 flex flex-col">
        
        {/* 모서리 고전 장식 포인트 */}
        <div className="absolute top-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute top-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>

        {/* 내부 콘텐츠 영역 */}
        <div className="border border-[#bdae93] p-4 flex-1 flex flex-col justify-between items-center">
          
          {/* 상단 타이틀 영역 (글씨 크기 및 강조 대폭 확대) */}
          <div className="w-full flex flex-col items-center space-y-2.5">
            <div className="text-4xl pt-1">🗺️</div>
            
            <h2 className="text-lg sm:text-xl font-black text-[#2a1a11] text-center border-b border-dashed border-[#bdae93] pb-2 tracking-tight w-full truncate px-1">
              {formData.nickname ? `${formData.nickname} 탐험가님 환영합니다!` : '탐험가님 환영합니다!'}
            </h2>

            <p className="text-sm sm:text-base text-[#5d4037] text-center leading-relaxed font-bold">
              공룡 전문가 자격증을 얻기 위해서는<br />
              총 3가지 탐험 미션을 완수해야 합니다!
            </p>
          </div>

          {/* 중앙 미션 목록 카드 영역 (아이콘과 텍스트 사이즈 대폭 확대) */}
          <div className="w-full space-y-2.5 bg-[#f8f1e1] p-3.5 rounded-xl border border-[#decfae] my-1">
            {[
              { title: '미션 1:', desc: '공룡 맞추기 퀴즈' },
              { title: '미션 2:', desc: '공룡 알 짝 맞추기' },
              { title: '미션 3:', desc: '티라노 먹이 주기' },
            ].map((mission, idx) => (
              <div 
                key={idx} 
                className="flex items-center space-x-4 p-3 bg-[#fcf8ed] rounded-lg border border-[#e4d5b1] shadow-sm"
              >
                
                <div className="text-base sm:text-base text-[#2a1a11] font-bold">
                  <strong className="text-[#8c673d] text-base mr-1">{mission.title}</strong> {mission.desc}
                </div>
              </div>
            ))}
          </div>

          {/* 하단 버튼 영역 (버튼 크기 및 내부 텍스트 확대) */}
          <button
            type="button"
            onClick={onNext}
            className="w-full py-4 bg-[#2a1a11] text-[#f4e4bc] font-black rounded-xl hover:bg-[#3e2723] transition shadow-lg text-base tracking-widest flex items-center justify-center space-x-2"
          >
            <span>미션 출발하기!</span>
            <span>🏃‍♂️</span>
          </button>

        </div>
      </div>
    </div>
  );
}