// src/components/Notice.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../back/supabaseClient';
import NoticeDetail from './NoticeDetail';
import AdminLogin from '../components/AdminLogin';

export default function Notice() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchType, setSearchType] = useState('title');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 팝업 뷰어에 띄울 선택된 게시글 상태
  const [selectedPost, setSelectedPost] = useState(null);

  // 관리자 인증 및 모달 상태
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 글쓰기/수정 모달 및 폼 상태
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [category, setCategory] = useState('news');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // 시크릿 로그인 트리거용 카운터 (푸터 클릭용)
  const [secretClickCount, setSecretClickCount] = useState(0);

  // 1. Supabase 데이터 로드 및 인증 세션 체크
  useEffect(() => {
    fetchPosts();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Supabase 'Notice' 테이블에서 게시글 가져오기
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('Notice')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert('로그아웃 되었습니다.');
  };

  // 게시글 삭제 핸들러 (관리자 전용)
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

    const { error } = await supabase.from('Notice').delete().eq('id', id);
    if (error) {
      alert('삭제 실패: ' + error.message);
    } else {
      alert('삭제되었습니다.');
      fetchPosts();
    }
  };

  // 글쓰기 모달 열기 (수정 모드인지 신규 모드인지 세팅)
  const openEditor = (post = null) => {
    if (post) {
      setPostToEdit(post);
      setCategory(post.category || 'news');
      setTitle(post.title || '');
      setContent(post.content || '');
      setImageUrl(post.image_url || '');
    } else {
      setPostToEdit(null);
      setCategory('news');
      setTitle('');
      setContent('');
      setImageFile(null);
      setImageUrl('');
    }
    setShowEditorModal(true);
  };

  // 이미지 선택 시 미리보기 설정
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // 글 저장 (등록 또는 수정) + 이미지 업로드 처리
  const handleSavePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImageUrl = postToEdit ? postToEdit.image_url : '';

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        uploadedImageUrl = publicData.publicUrl;
      }

      const postData = {
        category,
        title,
        content,
        image_url: uploadedImageUrl,
      };

      if (postToEdit) {
        const { error } = await supabase
          .from('Notice')
          .update(postData)
          .eq('id', postToEdit.id);

        if (error) throw error;
        alert('수정되었습니다.');
      } else {
        const { error } = await supabase
          .from('Notice')
          .insert([postData]);

        if (error) throw error;
        alert('등록되었습니다.');
      }

      setShowEditorModal(false);
      fetchPosts();
    } catch (error) {
      alert('저장 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 시크릿 로그인 창 열기
  const handleSecretClick = () => {
    setSecretClickCount(prev => {
      const nextCount = prev + 1;
      if (nextCount >= 5) {
        setShowLoginModal(true);
        return 0;
      }
      return nextCount;
    });
  };

  // 필터링 및 페이징 로직
  let filtered = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.category?.toLowerCase() === activeTab.toLowerCase());

  if (searchTerm.trim() !== '') {
    filtered = filtered.filter(post => {
      const titleMatch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const contentMatch = post.content?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

      if (searchType === 'title') return titleMatch;
      if (searchType === 'content') return contentMatch;
      return titleMatch || contentMatch;
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
      
      {/* 관리자 로그인 상태 알림 바 */}
      {user && (
        <div className="bg-neutral-900 text-white px-6 py-3 text-sm flex justify-between items-center">
          <span>관리자 계정으로 접속 중입니다 ({user.email})</span>
          <button onClick={handleLogout} className="underline hover:text-neutral-300">로그아웃</button>
        </div>
      )}

      {/* 1. 상단 타이틀 섹션 */}
      <section className="w-full pt-32 pb-16 px-6 text-center bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto space-y-4">
          <span className="text-sm md:text-base font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            News & Notice
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900">
            공지사항
          </h1>
        </div>
      </section>

      {/* 2. 메인 게시판 영역 */}
      <section className="max-w-6xl mx-auto px-6 py-12 w-full flex-1">
        
        {/* 카테고리 탭 및 관리자 글쓰기 버튼 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-neutral-200 pb-5 gap-4">
          <div className="flex items-center space-x-6 text-lg md:text-xl font-medium text-neutral-400 overflow-x-auto w-full md:w-auto">
            {['all', 'news', 'interview', 'notice'].map((tab) => (
              <React.Fragment key={tab}>
                <button 
                  onClick={() => handleTabChange(tab)}
                  className={`uppercase transition whitespace-nowrap ${activeTab === tab ? 'text-black font-bold underline underline-offset-8' : 'hover:text-neutral-600'}`}
                >
                  {tab}
                </button>
                {tab !== 'notice' && <span>|</span>}
              </React.Fragment>
            ))}
          </div>

          {/* 관리자일 때만 나타나는 글쓰기 버튼 */}
          {user && (
            <button 
              onClick={() => openEditor(null)}
              className="bg-neutral-900 text-white px-6 py-3 text-base font-medium hover:bg-black transition whitespace-nowrap"
            >
              글쓰기
            </button>
          )}
        </div>

        {/* 테이블 구조 게시판 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-t-2 border-b-2 border-neutral-900 text-base md:text-lg text-neutral-800 font-semibold uppercase tracking-wider">
                <th className="py-5 px-4 w-24 text-center">No</th>
                <th className="py-5 px-6">Subject</th>
                <th className="py-5 px-6 w-48">Name</th>
                <th className="py-5 px-4 w-36 text-right">Date</th>
                {user && <th className="py-5 px-4 w-28 text-center">Manage</th>}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-neutral-200 text-lg md:text-xl">
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <tr 
                    key={post.id} 
                    onClick={() => setSelectedPost(post)}
                    className="group hover:bg-neutral-50 transition cursor-pointer"
                  >
                    <td className="py-6 px-4 text-center text-neutral-500 font-medium text-base md:text-lg">
                      {post.id}
                    </td>
                    <td className="py-6 px-6 font-medium text-neutral-900 group-hover:text-black tracking-normal">
                      <span className="text-sm text-neutral-400 uppercase mr-3 font-semibold">[{post.category}]</span>
                      {post.title}
                    </td>
                    <td className="py-6 px-6 text-neutral-600 text-base md:text-lg">
                      TKM MANAGEMENT
                    </td>
                    <td className="py-6 px-4 text-right text-neutral-500 text-base md:text-lg">
                      {post.created_at ? post.created_at.split('T')[0].replace(/-/g, '.') : ''}
                    </td>

                    {/* 관리자일 때만 보이는 수정/삭제 버튼 */}
                    {user && (
                      <td className="py-6 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => openEditor(post)}
                            className="text-sm border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100"
                          >
                            수정
                          </button>
                          <button 
                            onClick={(e) => handleDelete(post.id, e)}
                            className="text-sm border border-red-200 text-red-600 px-3 py-1.5 hover:bg-red-50"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={user ? 5 : 4} className="py-20 text-center text-neutral-400 text-lg">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 검색창 및 페이지네이션 */}
        <div className="mt-16 flex flex-col items-center space-y-8">
          <div className="flex items-center space-x-1.5">
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="w-12 h-12 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition text-base"
            >
              &laquo;
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition text-base"
            >
              &lsaquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-12 h-12 border flex items-center justify-center text-base font-medium transition ${
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
              className="w-12 h-12 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition text-base"
            >
              &rsaquo;
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="w-12 h-12 border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 transition text-base"
            >
              &raquo;
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full max-w-xl">
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-neutral-300 px-4 py-3.5 text-base bg-white text-neutral-800 outline-none focus:border-neutral-900"
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
              className="flex-1 border border-neutral-300 px-4 py-3.5 text-base outline-none focus:border-neutral-900"
            />

            <button 
              type="submit"
              className="bg-neutral-800 hover:bg-black text-white px-7 py-3.5 text-base font-medium transition"
            >
              검색
            </button>
          </form>
        </div>

      </section>

      {/* 시크릿 푸터 영역 */}
      <footer className="w-full py-10 border-t border-neutral-100 text-center text-sm text-neutral-400">
        <p onClick={handleSecretClick} className="cursor-pointer inline-block select-none">
          © TKM MANAGEMENT. All rights reserved.
        </p>
      </footer>

      {/* 3. 팝업 뷰어창 (Modal) 영역 */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl relative">
            
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black text-3xl font-light w-12 h-12 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition"
              aria-label="닫기"
            >
              &times;
            </button>

            <div className="p-6 md:p-10">
              <NoticeDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
            </div>

          </div>
        </div>
      )}

      {/* 4. 관리자 로그인 모달 */}
      {showLoginModal && (
        <AdminLogin 
          onLoginSuccess={() => {
            alert('관리자로 로그인되었습니다.');
            setShowLoginModal(false);
          }} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}

      {/* 5. 사진 첨부 기능이 포함된 글쓰기/수정 에디터 모달 */}
      {showEditorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-neutral-900">
              {postToEdit ? '게시글 수정' : '새 공지사항 작성'}
            </h2>

            <form onSubmit={handleSavePost} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">카테고리</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-neutral-300 p-3.5 text-base focus:outline-none focus:border-neutral-900 bg-white uppercase"
                >
                  <option value="news">NEWS</option>
                  <option value="interview">INTERVIEW</option>
                  <option value="notice">NOTICE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">제목</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                  className="w-full border border-neutral-300 p-3.5 text-base focus:outline-none focus:border-neutral-900"
                  placeholder="제목을 입력하세요"
                />
              </div>

              {/* 사진 첨부 필드 */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">사진 첨부</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-neutral-300 p-2.5 text-sm focus:outline-none text-neutral-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer"
                />
                {/* 이미지 미리보기 */}
                {imageUrl && (
                  <div className="mt-3 relative w-36 h-36 border border-neutral-200">
                    <img src={imageUrl} alt="미리보기" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => { setImageFile(null); setImageUrl(''); }}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">내용</label>
                <textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  required
                  rows={8}
                  className="w-full border border-neutral-300 p-3.5 text-base focus:outline-none focus:border-neutral-900"
                  placeholder="내용을 입력하세요"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowEditorModal(false)}
                  className="border border-neutral-300 px-7 py-3.5 text-base font-medium text-neutral-600 hover:bg-neutral-50 transition"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-neutral-900 text-white px-7 py-3.5 text-base font-medium hover:bg-black transition"
                >
                  {loading ? '업로드 및 저장 중...' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}