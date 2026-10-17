import React from 'react';

export default function Step8_Certificate({ formData = {}, onRestart }) {
  // 📅 당일 날짜 자동 생성 함수 (YYYY.MM.DD 및 YYYY년 MM월 DD일 형식)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDateDots = `${year}.${month}.${day}`; // 예: 2026.10.17
  const formattedDateKorean = `${year}년 ${Number(month)}월 ${Number(day)}일`; // 예: 2026년 10월 17일

  return (
    /* 최상위 컨테이너: h-[620px] 고정 크기 및 앤틱 일지 프레임 적용 */
    <div className="relative max-w-sm h-[620px] mx-auto my-4 p-3 bg-[#f4e4bc] text-[#3e2723] rounded-lg shadow-2xl border-4 border-[#8c673d] overflow-hidden select-none flex flex-col justify-between">
      
      {/* 바깥 노란선(골드 라인) 테두리 */}
      <div className="border-2 border-[#b89355] p-3 rounded relative shadow-inner flex-1 flex flex-col justify-between min-h-0">
        
        {/* 모서리 고전 장식 포인트 */}
        <div className="absolute top-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute top-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>

        {/* 내부 콘텐츠 영역 (스크롤로 화면 크기별 안전 대응) */}
        <div className="border border-[#bdae93] p-3 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar text-center">
          
          {/* 📜 상장형 세로 프레임 */}
          <div className="flex-1 bg-[#fcf8ed] p-3.5 rounded-xl border-2 border-[#b89355] shadow-sm relative overflow-hidden flex flex-col justify-between text-center my-0.5">
            
            {/* 배경 워터마크 아이콘 */}
            <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-5 select-none pointer-events-none">
              🦖
            </div>

            {/* 1. 상단: 자격증 타이틀 */}
            <div className="space-y-0.5 border-b border-[#e4d5b1] pb-2">
              <span className="text-[10px] font-black text-[#8c673d] tracking-widest block">
                DINOSAUR EXPERT LICENSE
              </span>
              <h1 className="text-lg font-black text-[#2a1a11] tracking-wider">
                공룡 전문가 자격증
              </h1>
            </div>

            {/* 2. 중단: 프로필 사진 + 큼직한 인적사항 박스 */}
            <div className="flex flex-col items-center space-y-2.5 my-auto py-1.5">
              
              {/* 프로필 사진 */}
              <div className="w-24 h-28 bg-[#f8f1e1] rounded-xl overflow-hidden flex items-center justify-center border-2 border-[#8c673d] shadow-md shrink-0">
                {formData.photo ? (
                  <img src={formData.photo} alt="탐험가" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">👦</span>
                )}
              </div>

              {/* 상세 인적사항 박스 */}
              <div className="w-full max-w-[270px] bg-[#f8f1e1]/90 px-3.5 py-2.5 rounded-xl border border-[#decfae] text-xs sm:text-sm space-y-1.5 text-[#3e2723] font-bold text-left shadow-inner">
                <div className="flex justify-between items-center border-b border-dashed border-[#c9bba0] pb-1">
                  <span className="text-[#8c673d] font-black tracking-widest">성 명 :</span>
                  <span className="font-black text-sm text-[#2a1a11]">{formData.name || '안시환'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dashed border-[#c9bba0] pb-1">
                  <span className="text-[#8c673d] font-black tracking-widest">소 속 :</span>
                  <span className="font-bold truncate max-w-[150px]">{formData.kindergarten || '햇살마루 어린이집'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dashed border-[#c9bba0] pb-1">
                  <span className="text-[#8c673d] font-black tracking-widest">코드네임:</span>
                  <span className="font-black text-sm text-[#d84315]">{formData.nickname || '공룡대장'}</span>
                </div>
                {/* 📅 당일 자동 생성 날짜 표시 */}
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-[#8c673d] font-black tracking-widest">발급일 :</span>
                  <span className="text-xs text-[#5d4037] font-extrabold">{formattedDateKorean}</span>
                </div>
              </div>

            </div>

            {/* 3. 하단: 수료 문구 및 직인 */}
            <div className="pt-2 space-y-1.5 border-t border-[#e4d5b1]">
              <p className="text-[10.5px] sm:text-xs text-[#3e2723] font-bold leading-tight px-1">
                위 사람은 공룡 탐험대의 모든 미션을 완수하였으므로 최고 등급의 자격을 부여합니다. 🎖️
              </p>

              <div className="flex justify-between items-center px-1 pt-1">
                {/* 📅 당일 점형 날짜 표시 */}
                <span className="text-xs font-black text-[#8c673d]">{formattedDateDots}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-black text-[#2a1a11]">공룡탐험대장</span>
                  <div className="w-6 h-6 rounded-full border-2 border-[#c62828] bg-[#c62828]/10 flex items-center justify-center text-[#c62828] font-black text-[9px] rotate-[-10deg]">
                    인
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 하단 버튼 영역 */}
          <div className="w-full pt-1.5">
            <button
              type="button"
              onClick={onRestart}
              className="w-full py-3 bg-[#2a1a11] text-[#f4e4bc] font-black rounded-xl active:bg-[#3e2723] transition text-sm sm:text-base shadow-md tracking-widest flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>🔄</span>
              <span>처음부터 다시하기</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}