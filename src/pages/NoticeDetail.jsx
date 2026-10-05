import React from 'react';

export default function NoticeDetail({ post, onBack }) {
  // 만약 post 데이터가 전달되지 않았을 경우를 대비한 기본값 처리
  if (!post) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-neutral-500 mb-4">선택된 게시글이 없습니다.</p>
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
      <section className="w-full pt-32 pb-16 px-6 text-center bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto space-y-3">
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            {post.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-neutral-900 max-w-4xl mx-auto leading-snug">
            {post.title}
          </h1>
        </div>
      </section>

      {/* 2. 메인 상세 내용 영역 */}
      <section className="max-w-4xl mx-auto px-6 py-16 w-full flex-1">
        
        {/* 게시글 메타 정보 (작성자, 날짜, 번호) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-t-2 border-b-2 border-neutral-900 py-4 text-sm text-neutral-600 mb-12">
          <div className="flex items-center space-x-6">
            <span><strong className="text-neutral-900 font-medium">글번호:</strong> {post.id}</span>
            <span><strong className="text-neutral-900 font-medium">작성자:</strong> {post.author || 'TKM MANAGEMENT'}</span>
          </div>
          <div className="mt-2 md:mt-0">
            <span><strong className="text-neutral-900 font-medium">작성일:</strong> {formattedDate}</span>
          </div>
        </div>

        {/* 본문 콘텐츠 영역 */}
        <div className="min-h-[250px] text-base md:text-lg text-neutral-800 leading-relaxed whitespace-pre-wrap pb-16 border-b border-neutral-200 space-y-8">
          
          {/* 💡 1. 이미지가 존재할 경우 텍스트보다 먼저(위쪽에) 렌더링 */}
          {post.image_url && (
            <div className="w-full flex justify-center bg-neutral-50 border border-neutral-200 overflow-hidden mb-8">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="max-h-[500px] w-auto object-contain"
              />
            </div>
          )}

          {/* 2. 텍스트 내용 */}
          <div>
            {post.content || "등록된 상세 내용이 없습니다."}
          </div>
        </div>

        {/* 하단 목록으로 버튼 */}
        <div className="mt-12 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="border border-neutral-300 px-8 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
          >
            목록
          </button>
        </div>

      </section>

      {/* 하단 여백 공간 */}
      <div className="py-6"></div>

    </div>
  );
}