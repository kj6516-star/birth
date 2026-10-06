import React, { useState, useEffect } from 'react';
import { supabase } from '../back/supabaseClient'; // 💡 본인 프로젝트 경로에 맞게 수정
import ActorDetail from './ActorDetail'; 

export default function Actor() {
  const [actors, setActors] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [selectedActor, setSelectedActor] = useState(null); 
  const [user, setUser] = useState(null); // 🔒 관리자 로그인 상태

  // 1. 로그인 상태 확인 및 실시간 감지
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. 배우 데이터 불러오기 (Read)
  const fetchActors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Actors')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setActors(data || []);
    } catch (error) {
      console.error('배우 데이터를 불러오는 중 오류가 발생했습니다:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, []);

  // 3. 배우 등록/수정 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActorId, setEditingActorId] = useState(null); // null이면 추가, 값이 있으면 수정
  const [formData, setFormData] = useState({
    name: '',
    englishName: '',
    gender: '',
    birth: '',
    height: '',
    weight: '',
    education: '',
    image: '',
    biography: '',
  });

  const handleOpenAddModal = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 버블링 방지
    setEditingActorId(null);
    setFormData({
      name: '',
      englishName: '',
      gender: '',
      birth: '',
      height: '',
      weight: '',
      education: '',
      image: '',
      biography: '',
    });
    setIsModalOpen(true);
  };

  // 등록 및 수정 저장 처리 (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      height: formData.height ? parseInt(formData.height, 10) : null,
      weight: formData.weight ? parseInt(formData.weight, 10) : null,
    };

    if (editingActorId) {
      // 수정
      const { error } = await supabase
        .from('Actors')
        .update(payload)
        .eq('id', editingActorId);

      if (error) {
        alert('수정 실패: ' + error.message);
      } else {
        alert('배우 정보가 수정되었습니다.');
        setIsModalOpen(false);
        fetchActors();
      }
    } else {
      // 신규 등록
      const { error } = await supabase
        .from('Actors')
        .insert([payload]);

      if (error) {
        alert('등록 실패: ' + error.message);
      } else {
        alert('새 배우가 등록되었습니다.');
        setIsModalOpen(false);
        fetchActors();
      }
    }
  };

  return (
    <div className="w-full bg-white text-neutral-900 select-none min-h-screen flex flex-col justify-between">
      
      {/* 상단 타이틀 섹션 */}
      <section className="w-full pt-24 pb-8 px-4 md:px-6 text-center bg-white">
        <div className="max-w-6xl mx-auto space-y-2">
          <span className="text-[10px] md:text-sm font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            ACTORS
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-neutral-900">
            배우
          </h1>
          
          {/* 👉 관리자 상태일 때만 보이는 '배우 등록' 버튼 */}
          {user && (
            <div className="pt-2">
              <button 
                onClick={handleOpenAddModal}
                className="bg-neutral-900 text-white px-4 py-2 text-xs font-bold rounded hover:bg-black transition shadow-sm"
              >
                + 새 배우 등록
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 배우 그리드 목록 섹션 (✨ 핵심 수정: 모바일 2열, PC 4열) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-6 w-full flex-1">
        {loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm">데이터를 불러오는 중입니다...</div>
        ) : actors.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 text-sm">등록된 배우가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {actors.map((actor) => (
              <div 
                key={actor.id} 
                onClick={() => setSelectedActor(actor)} 
                className="group cursor-pointer space-y-2 relative"
              >
                {/* 이미지 박스 */}
                <div className="w-full aspect-[3/4] overflow-hidden bg-neutral-100 rounded-lg shadow-sm">
                  <img 
                    src={actor.image} 
                    alt={actor.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                  />
                </div>
                {/* 배우 이름 (✨ 모바일과 PC 글씨 크기 분기) */}
                <div className="text-left">
                  <h3 className="text-sm sm:text-base md:text-xl font-bold text-neutral-900 tracking-wide truncate">
                    {actor.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 여백용 풋터 공간 확보 */}
      <div className="py-8"></div>

      {/* 배우 상세 모달 */}
      <ActorDetail 
        actor={selectedActor} 
        onClose={() => setSelectedActor(null)} 
        user={user} 
        onUpdateSuccess={fetchActors} 
      />

      {/* 관리자용 배우 등록/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 md:p-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
              <h3 className="text-base md:text-lg font-bold">{editingActorId ? '배우 정보 수정' : '새 배우 등록'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black font-bold">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">이름 (Name)</label>
                  <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">영문 이름 (English Name)</label>
                  <input type="text" name="englishName" value={formData.englishName} onChange={(e) => setFormData({...formData, englishName: e.target.value})} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">성별 (Gender)</label>
                  <input type="text" name="gender" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">생년월일 (Birth)</label>
                  <input type="text" name="birth" value={formData.birth} onChange={(e) => setFormData({...formData, birth: e.target.value})} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">키 (Height - 숫자만)</label>
                  <input type="number" name="height" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">몸무게 (Weight - 숫자만)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">이미지 URL (Image URL)</label>
                <input type="text" name="image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">학력/소속 (Education)</label>
                <input type="text" name="education" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">바이오그래피 (Biography)</label>
                <textarea name="biography" rows="3" value={formData.biography} onChange={(e) => setFormData({...formData, biography: e.target.value})} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black resize-none"></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-neutral-100 rounded text-sm font-semibold hover:bg-neutral-200 transition">취소</button>
                <button type="submit" className="px-5 py-2 bg-black text-white rounded text-sm font-semibold hover:bg-neutral-800 transition">저장하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}