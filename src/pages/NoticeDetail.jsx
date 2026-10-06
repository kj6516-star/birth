// src/components/NoticeDetail.jsx
import React from 'react';

export default function NoticeDetail({ post, onBack }) {
  // 만약 post 데이터가 전달되지 않았을 경우를 대비한 기본값 처리
  if (!post) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center bg-white p-6">
        <p className="text-neutral-500 mb-4 text-sm md:text-base">선택된 게시글이 없습니다.</p>
        <button 
          onClick={onBack}
          className="bg-neutral-900 text-white px-6 py-3 text-sm font-medium hover:bg-black transition"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 날짜 형식 포맷팅 (created_at 값이 있으면 YYYY.MM.DD 형태로 추출)
  const formattedDate = post.created_at 
    ? post.created_at.split('T')[0].replace(/-/g, '.') 
    : (post.date || '');

  return (
    <div className="w-full bg-white text-neutral-900 select-none min-h-screen flex flex-col justify-between">
      
      {/* 1. 상단 타이틀 섹션 */}
      <section className="w-full pt-16 md:pt-28 pb-10 md:pb-16 px-4 md:px-6 text-center bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto space-y-2 md:space-y-3">
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            {post.category}
          </span>
          <h1 className="text-xl md:text-4xl font-bold tracking-tight text-neutral-900 max-w-4xl mx-auto leading-snug">
            {post.title}
          </h1>
        </div>
      </section>

      {/* 2. 메인 상세 내용 영역 */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16 w-full flex-1">
        
        {/* 게시글 메타 정보 (작성자 제거 및 모바일 정렬 최적화) */}
        <div className="flex flex-row items-center justify-between border-t-2 border-b-2 border-neutral-900 py-3.5 md:py-4 text-xs md:text-sm text-neutral-600 mb-8 md:mb-12">
          <div>
            <span><strong className="text-neutral-900 font-medium">글번호:</strong> {post.id}</span>
          </div>
          <div>
            <span><strong className="text-neutral-900 font-medium">작성일:</strong> {formattedDate}</span>
          </div>
        </div>

        {/* 본문 콘텐츠 영역 */}
        <div className="min-h-[200px] text-sm md:text-lg text-neutral-800 leading-relaxed pb-12 md:pb-16 border-b border-neutral-200 space-y-6 md:space-y-8">
          
          {/* 이미지가 존재할 경우 텍스트 위쪽에 렌더링 (모바일 화면 맞춤형) */}
          {post.image_url && (
            <div className="w-full flex justify-center bg-neutral-50 border border-neutral-200 overflow-hidden mb-6 md:mb-8">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="max-h-[350px] md:max-h-[500px] w-full md:w-auto object-contain"
              />
            </div>
          )}

          {/* 텍스트 내용 */}
          <div className="whitespace-pre-wrap break-words">
            {post.content || "등록된 상세 내용이 없습니다."}
          </div>
        </div>

        {/* 하단 목록으로 버튼 */}
        <div className="mt-8 md:mt-12 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="border border-neutral-300 px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
          >
            목록
          </button>
        </div>

      </section>

      {/* 하단 여백 공간 */}
      <div className="py-4 md:py-6"></div>

    </div>
  );
}