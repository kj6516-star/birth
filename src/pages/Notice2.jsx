// src/components/Notice2.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../back/supabaseClient';
import NoticeDetail from './NoticeDetail';
import AdminLogin from '../components/AdminLogin';

export default function Notice2() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // 팝업 뷰어창에 띄울 선택된 게시글 상태
  const [selectedPost, setSelectedPost] = useState(null);

  // 관리자 인증 및 모달 상태
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 글쓰기/수정 모달 및 폼 상태
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [category, setCategory] = useState('NOTICE'); // 기본값을 NOTICE로 설정
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // 모바일 사이드바(메뉴) 열림/닫힘 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      setCategory(post.category || 'NOTICE');
      setTitle(post.title || '');
      setContent(post.content || '');
      setImageUrl(post.image_url || '');
      setImageFile(null);
    } else {
      setPostToEdit(null);
      setCategory('NOTICE');
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

  // 시크릿 로그인 창 열기 (푸터 저작권 텍스트 5번 클릭 시 작동)
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

  // 카테고리 및 검색어 필터링
  const filteredCards = posts.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category?.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return matchesCategory && matchesSearch;
  });

  // 검색 초기화 함수
  const handleReset = () => {
    setSelectedCategory('ALL');
    setSearchInput('');
    setSearchTerm('');
    setIsSidebarOpen(false); // 모바일에서 선택 시 메뉴 닫기
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setIsSidebarOpen(false); // 모바일에서 검색 시 메뉴 닫기
  };

  return (
    <div className="w-full min-h-screen bg-white text-neutral-900 select-none pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-12 relative flex flex-col justify-between">
      
      {/* 관리자 로그인 상태 알림 바 */}
      {user && (
        <div className="absolute top-0 left-0 right-0 bg-neutral-900 text-white px-4 md:px-6 py-2.5 text-xs md:text-sm flex justify-between items-center z-40">
          <span className="truncate mr-2">관리자 계정으로 접속 중입니다 ({user.email})</span>
          <button onClick={handleLogout} className="underline hover:text-neutral-300 shrink-0">로그아웃</button>
        </div>
      )}

      {/* 모바일 전용 메뉴 토글 버튼 바 (PC에서는 숨김: lg:hidden) */}
      <div className="lg:hidden mb-6 flex items-center justify-between border-b border-neutral-200 pb-3">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold border border-neutral-300 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 transition"
        >
          <span>☰</span> <span>검색 및 카테고리</span>
        </button>
        <span className="text-xs text-neutral-500 uppercase tracking-wider">
          선택됨: <strong className="text-black">{selectedCategory}</strong>
        </span>
      </div>

      {/* 전체 레이아웃 컨테이너 */}
      <div className="max-w-7xl mx-auto flex flex-row gap-6 lg:gap-16 w-full flex-1 relative">
        
        {/* ================= 1. 좌측 검색 및 필터 패널 ================= */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}

        <aside className={`
          fixed lg:relative top-0 left-0 z-50 h-full lg:h-auto
          w-72 bg-white lg:bg-transparent p-6 lg:p-0
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          flex-shrink-0 space-y-6 md:space-y-8 overflow-y-auto
        `}>
          {/* 모바일용 닫기 버튼 */}
          <div className="flex justify-between items-center lg:hidden border-b border-neutral-200 pb-4">
            <h2 className="text-base font-bold tracking-[0.2em] uppercase text-neutral-900">
              MENU
            </h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-2xl text-neutral-400 hover:text-black w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
          </div>

          <div className="border-b border-neutral-200 pb-5 md:pb-6">
            <h2 className="text-sm md:text-lg font-bold tracking-[0.2em] uppercase text-neutral-900 mb-3 md:mb-4 hidden lg:block">
              SEARCH
            </h2>
            
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text"
                placeholder="검색어 입력"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border border-neutral-300 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-lg placeholder-neutral-400 outline-none focus:border-black transition rounded-none"
              />
            </form>
          </div>

          <div className="space-y-3 md:space-y-4">
            <span className="text-xs md:text-lg font-semibold tracking-wider text-neutral-400 uppercase block">
              Category
            </span>
            <div className="flex flex-col gap-1.5 md:gap-2">
              {['ALL', 'NOTICE', 'NEWS', 'INTERVIEW'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsSidebarOpen(false);
                  }}
                  className={`text-left px-4 md:px-5 py-2.5 md:py-3 rounded-none text-sm md:text-lg font-medium transition border-l-2 ${
                    selectedCategory === cat 
                      ? 'bg-neutral-100 text-black font-bold border-black' 
                      : 'border-transparent text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 pt-2">
            <button 
              onClick={handleReset}
              className="px-4 md:px-5 py-2.5 md:py-2.5 border border-neutral-300 text-sm md:text-lg text-neutral-500 hover:text-black hover:border-black transition"
            >
              초기화
            </button>
            {user && (
              <button 
                onClick={() => { openEditor(null); setIsSidebarOpen(false); }}
                className="px-4 md:px-5 py-2.5 md:py-2.5 bg-neutral-900 text-white text-sm md:text-lg font-medium hover:bg-black transition"
              >
                글쓰기
              </button>
            )}
          </div>
        </aside>

        {/* ================= 2. 우측 카드 그리드 영역 ================= */}
        <main className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-neutral-200 pb-3 md:pb-4 text-xs md:text-lg text-neutral-500">
            <span>총 <strong className="text-black">{filteredCards.length}</strong>개의 소식</span>
            <span className="uppercase tracking-widest">{selectedCategory}</span>
          </div>

          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-12">
              {filteredCards.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedPost(item)}
                  className="group cursor-pointer flex flex-col space-y-2 md:space-y-3 relative"
                >
                  <div className="w-full aspect-[16/10] bg-neutral-100 overflow-hidden relative">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    />
                    <span className="absolute top-2.5 left-2.5 md:top-3 md:left-3 bg-black/70 backdrop-blur-md text-white text-xs md:text-sm px-2.5 md:px-3 py-0.5 md:py-1 tracking-wider uppercase font-medium">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs md:text-lg">
                    <span className="text-neutral-400 font-light">
                      {item.created_at ? item.created_at.split('T')[0].replace(/-/g, '.') : ''}
                    </span>

                    {/* 관리자 수정/삭제 버튼 */}
                    {user && (
                      <div className="flex space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => openEditor(item)}
                          className="text-xs md:text-lg border border-neutral-300 px-2.5 md:px-3 py-0.5 hover:bg-neutral-100"
                        >
                          수정
                        </button>
                        <button 
                          onClick={(e) => handleDelete(item.id, e)}
                          className="text-xs md:text-lg border border-red-200 text-red-600 px-2.5 md:px-3 py-0.5 hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="text-base md:text-xl font-medium text-neutral-900 group-hover:text-neutral-600 transition leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 md:py-32 text-center text-xs md:text-lg text-neutral-400 border border-dashed border-neutral-200">
              검색된 소식이 없습니다.
            </div>
          )}
        </main>

      </div>

      {/* ================= 3. 상세 내용 모달 뷰어창 ================= */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto rounded-none shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-neutral-400 hover:text-black text-2xl md:text-3xl font-light w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition z-10"
              aria-label="닫기"
            >
              &times;
            </button>
            <div className="p-4 md:p-10">
              <NoticeDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. 관리자 로그인 모달 ================= */}
      {showLoginModal && (
        <AdminLogin 
          onLoginSuccess={() => {
            alert('관리자로 로그인되었습니다.');
            setShowLoginModal(false);
          }} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}

      {/* ================= 5. 글쓰기/수정 에디터 모달 ================= */}
      {showEditorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl p-5 md:p-8 shadow-xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto my-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-neutral-900">
              {postToEdit ? '게시글 수정' : '새 소식 작성'}
            </h2>

            <form onSubmit={handleSavePost} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-sm md:text-lg font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">카테고리</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-neutral-300 p-3 md:p-3.5 text-sm md:text-lg focus:outline-none focus:border-neutral-900 bg-white uppercase rounded-none"
                >
                  <option value="NOTICE">NOTICE</option>
                  <option value="NEWS">NEWS</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                </select>
              </div>

              <div>
                <label className="block text-sm md:text-lg font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">제목</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                  className="w-full border border-neutral-300 p-3 md:p-3.5 text-sm md:text-lg focus:outline-none focus:border-neutral-900 rounded-none"
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm md:text-lg font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">사진 첨부</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-neutral-300 p-2 text-xs md:text-lg focus:outline-none text-neutral-600 file:mr-3 md:file:mr-4 file:py-2 file:px-3 md:file:px-5 file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer"
                />
                {imageUrl && (
                  <div className="mt-3 relative w-28 h-28 md:w-36 md:h-36 border border-neutral-200">
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
                <label className="block text-sm md:text-lg font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">내용</label>
                <textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  required
                  rows={6}
                  className="w-full border border-neutral-300 p-3 md:p-3.5 text-sm md:text-lg focus:outline-none focus:border-neutral-900 rounded-none"
                  placeholder="내용을 입력하세요"
                />
              </div>

              <div className="flex justify-end space-x-2 md:space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowEditorModal(false)}
                  className="border border-neutral-300 px-5 md:px-7 py-2.5 md:py-3.5 text-sm md:text-lg font-medium text-neutral-600 hover:bg-neutral-50 transition"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-neutral-900 text-white px-5 md:px-7 py-2.5 md:py-3.5 text-sm md:text-lg font-medium hover:bg-black transition"
                >
                  {loading ? '업로드 및 저장 중...' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 시크릿 푸터 영역 */}
      <footer className="w-full py-6 md:py-8 mt-12 md:mt-16 border-t border-neutral-100 text-center text-xs md:text-sm text-neutral-400">
        <p onClick={handleSecretClick} className="cursor-pointer inline-block select-none">
          © TKM MANAGEMENT. All rights reserved.
        </p>
      </footer>

    </div>
  );
}