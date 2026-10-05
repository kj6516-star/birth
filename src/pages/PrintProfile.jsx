import React from 'react';

export default function PrintProfile({ actor, onBack }) {
  // 실제 인쇄 동작 핸들러
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#111] text-neutral-900 flex flex-col items-center">
      
      {/* 1. 상단 블랙 툴바 (레퍼런스 이미지의 상단 바) */}
      <div className="w-full max-w-[1000px] py-4 px-6 flex items-center justify-between text-white text-sm">
        <div className="flex items-center gap-2 font-medium text-neutral-400">
          <span>TK MANAGEMENT</span> / <span>CASTING BIO-SHEET</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 인쇄 버튼 */}
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-bold hover:bg-neutral-200 transition"
          >
            🖨️ PRINT (인쇄)
          </button>
          
          {/* PDF 다운로드 버튼 (인쇄 창에서 PDF로 저장 유도) */}
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-neutral-700 text-white px-4 py-2 rounded font-bold hover:bg-neutral-800 transition"
          >
            📥 DOWNLOAD PDF
          </button>

          {/* 닫기 버튼 */}
          <button 
            onClick={onBack}
            className="text-neutral-400 hover:text-white text-lg px-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. A4 용지 비율의 문서 본체 영역 */}
      <div className="w-full max-w-[900px] bg-white shadow-2xl my-6 p-12 print:shadow-none print:m-0 print:w-full">
        
        {/* 문서 상단 회사 로고 및 타이틀 */}
        <div className="flex justify-between items-end border-b-2 border-black pb-6 mb-10">
          <div>
            <h1 className="text-2xl font-black tracking-wider">TK MANAGEMENT</h1>
            <p className="text-xs text-neutral-500 mt-1">TK Company Actors Division</p>
          </div>
          <div className="text-right text-xs text-neutral-400">
            <p>OFFICIAL ACTOR PROFILE</p>
            <p className="text-neutral-500 font-semibold">CONFIDENTIAL / CASTING PURPOSES ONLY</p>
          </div>
        </div>

        {/* 배우 프로필 메인 (사진 + 기본 정보) */}
        <div className="grid grid-cols-2 gap-8 items-start mb-12">
          <div className="aspect-[3/4] bg-neutral-100 overflow-hidden border border-neutral-200">
            <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <span className="text-xs text-orange-600 font-bold tracking-widest">ACTOR PROFILE</span>
              <h2 className="text-4xl font-black mt-1">{actor.name}</h2>
              <p className="text-sm text-neutral-400">{actor.englishName}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 border-y border-neutral-200 py-4 text-sm">
              <div>
                <span className="block text-xs text-neutral-400">생년월일</span>
                <span className="font-semibold">{actor.birth}</span>
              </div>
              <div>
                <span className="block text-xs text-neutral-400">신장</span>
                <span className="font-semibold">{actor.height}</span>
              </div>
              <div>
                <span className="block text-xs text-neutral-400">성별</span>
                <span className="font-semibold">{actor.gender}</span>
              </div>
            </div>

            <div>
              <span className="block text-xs text-neutral-400 mb-1">학력</span>
              <p className="text-sm font-semibold">{actor.education}</p>
            </div>
          </div>
        </div>

        {/* 필모그래피 영역 생략 (표 형태로 출력) */}
        {/* ... */}

      </div>
    </div>
  );
}