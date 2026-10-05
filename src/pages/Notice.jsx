import React, { useState } from 'react';
import NoticeDetail from './NoticeDetail'; // NoticeDetail 파일 필요

const dummyPosts = [
  { id: 19809, category: 'news', title: "'내가 떨릴 수 있게' 남지현·김재영, 맞선서 만난 극과 극 남녀 ...", content: "드라마 내가 떨릴 수 있게 관련 소식입니다. 남지현과 김재영이 맞선에서 만나 벌어지는 에피소드...", author: 'TKM MANAGEMENT', date: '2026.09.29' },
  { id: 19808, category: 'interview', title: "유연석·서현진, 눈빛만으로 시선 강탈…'라이어' 티저 포스터 공개 ...", content: "연극 라이어 포스터 공개 인터뷰 내용입니다. 두 배우의 압도적인 연기 호흡이 기대되는 현장...", author: 'TKM MANAGEMENT', date: '2026.09.29' },
 
]
export default function Notice() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchType, setSearchType] = useState('title');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 팝업 뷰어에 띄울 선택된 게시글 상태 (null이면 팝업 닫힘)
  const [selectedPost, setSelectedPost] = useState(null);

  // 필터링 및 페이징 로직
  let filtered = activeTab === 'all' 
    ? dummyPosts 
    : dummyPosts.filter(post => post.category === activeTab);

  if (searchTerm.trim() !== '') {
    filtered = filtered.filter(post => {
      if (searchType === 'title') {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === 'content') {
        return post.content.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return (
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    });
  }

  const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filtered.slice(indexOfFirstPost, indexOfLastPost);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-white text-neutral-900 select-none min-h-screen flex flex-col justify-between relative">
      
      {/* 1. 상단 타이틀 섹션 */}
      <section className="w-full pt-32 pb-16 px-6 text-center bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto space-y-3">
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            News & Notice
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
            공지사항
          </h1>
        </div>
      </section>

      {/* 2. 메인 게시판 영역 */}
      <section className="max-w-6xl mx-auto px-6 py-12 w-full flex-1">
        
        {/* 카테고리 탭 */}
        <div className="flex items-center space-x-6 text-base md:text-lg font-medium text-neutral-400 mb-10 border-b border-neutral-200 pb-5">
          {['all', 'news', 'interview', 'notice'].map((tab) => (
            <React.Fragment key={tab}>
              <button 
                onClick={() => handleTabChange(tab)}
                className={`uppercase transition ${activeTab === tab ? 'text-black font-bold underline underline-offset-8' : 'hover:text-neutral-600'}`}
              >
                {tab}
              </button>
              {tab !== 'notice' && <span>|</span>}
            </React.Fragment>
          ))}
        </div>

        {/* 테이블 구조 게시판 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-t-2 border-b-2 border-neutral-900 text-sm md:text-base text-neutral-700 font-semibold uppercase tracking-wider">
                <th className="py-5 px-4 w-24 text-center">No</th>
                <th className="py-5 px-6">Subject</th>
                <th className="py-5 px-6 w-48">Name</th>
                <th className="py-5 px-4 w-32 text-right">Date</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-neutral-200 text-base md:text-lg">
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <tr 
                    key={post.id} 
                    onClick={() => setSelectedPost(post)} // 클릭 시 모달 뷰어창 열림
                    className="group hover:bg-neutral-50 transition cursor-pointer"
                  >
                    <td className="py-6 px-4 text-center text-neutral-500 font-medium text-sm md:text-base">
                      {post.id}
                    </td>
                    <td className="py-6 px-6 font-medium text-neutral-900 group-hover:text-black tracking-normal">
                      {post.title}
                    </td>
                    <td className="py-6 px-6 text-neutral-600 text-sm md:text-base">
                      {post.author}
                    </td>
                    <td className="py-6 px-4 text-right text-neutral-500 text-sm md:text-base">
                      {post.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-neutral-400 text-base">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 검색창 및 페이지네이션 */}
        <div className="mt-16 flex flex-col items-center space-y-8">
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="w-10 h-10 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition"
            >
              &laquo;
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition"
            >
              &lsaquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-10 h-10 border flex items-center justify-center text-sm font-medium transition ${
                  currentPage === num 
                    ? 'border-neutral-900 text-neutral-900 font-bold bg-neutral-50' 
                    : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {num}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition"
            >
              &rsaquo;
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition"
            >
              &raquo;
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full max-w-lg">
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-neutral-300 px-4 py-3 text-sm bg-white text-neutral-800 outline-none focus:border-neutral-900"
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="title_content">제목+내용</option>
            </select>

            <input 
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900"
            />

            <button 
              type="submit"
              className="bg-neutral-800 hover:bg-black text-white px-6 py-3 text-sm font-medium transition"
            >
              검색
            </button>
          </form>
        </div>

      </section>

      <div className="py-6"></div>

      {/* 3. 팝업 뷰어창 (Modal) 영역 */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            
            {/* 팝업 내부 상단 닫기 버튼 */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black text-2xl font-light w-10 h-10 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition"
              aria-label="닫기"
            >
              &times;
            </button>

            {/* NoticeDetail 컴포넌트를 모달 내부에 렌더링 */}
            <div className="p-4 md:p-8">
              <NoticeDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}