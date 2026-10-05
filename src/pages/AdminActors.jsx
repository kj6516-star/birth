import React, { useState, useEffect } from 'react';
import { supabase } from '../back/supabaseClient'; // 프로젝트 구조에 맞춘 경로

export default function AdminActors({ onLogout }) {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 모달 제어 및 입력 폼 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null이면 추가, 값이 있으면 수정
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

  // 데이터 불러오기 (Read)
  const fetchActors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Actors')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('데이터를 불러오지 못했습니다:', error.message);
    } else {
      setActors(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = (actor = null) => {
    if (actor) {
      setEditingId(actor.id);
      setFormData({
        name: actor.name || '',
        englishName: actor.englishName || '',
        gender: actor.gender || '',
        birth: actor.birth || '',
        height: actor.height || '',
        weight: actor.weight || '',
        education: actor.education || '',
        image: actor.image || '',
        biography: actor.biography || '',
      });
    } else {
      setEditingId(null);
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
    }
    setIsModalOpen(true);
  };

  // 추가 및 수정 처리 (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      height: formData.height ? parseInt(formData.height, 10) : null,
      weight: formData.weight ? parseInt(formData.weight, 10) : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from('Actors')
        .update(payload)
        .eq('id', editingId);

      if (error) {
        alert('수정 실패: ' + error.message);
      } else {
        alert('수정되었습니다.');
        setIsModalOpen(false);
        fetchActors();
      }
    } else {
      const { error } = await supabase
        .from('Actors')
        .insert([payload]);

      if (error) {
        alert('추가 실패: ' + error.message);
      } else {
        alert('새 아티스트가 등록되었습니다.');
        setIsModalOpen(false);
        fetchActors();
      }
    }
  };

  // 삭제 처리 (Delete)
  const handleDelete = async (id) => {
    if (window.confirm('정말 이 아티스트를 삭제하시겠습니까?')) {
      const { error } = await supabase
        .from('Actors')
        .delete()
        .eq('id', id);

      if (error) {
        alert('삭제 실패: ' + error.message);
      } else {
        alert('삭제되었습니다.');
        fetchActors();
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-6 md:p-12 text-neutral-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 상단 타이틀, 로그아웃 및 등록 버튼 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-neutral-50 p-6 rounded-lg border border-neutral-200 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">관리자 대시보드 (Artists)</h1>
            <p className="text-sm text-neutral-500 mt-1">DB에 등록된 아티스트 정보를 추가, 수정, 삭제할 수 있습니다.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleOpenModal()}
              className="bg-black text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-neutral-800 transition"
            >
              + 아티스트 등록
            </button>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="border border-neutral-300 bg-white text-neutral-700 px-4 py-2.5 rounded text-sm font-semibold hover:bg-neutral-100 transition"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>

        {/* 목록 테이블 */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          {loading ? (
            <div className="text-center py-20 text-neutral-400">데이터를 불러오는 중...</div>
          ) : actors.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">등록된 아티스트가 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider">
                    <th className="p-4">이미지</th>
                    <th className="p-4">이름</th>
                    <th className="p-4">영문명</th>
                    <th className="p-4">키 / 몸무게</th>
                    <th className="p-4 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  {actors.map((actor) => (
                    <tr key={actor.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4">
                        <img src={actor.image} alt={actor.name} className="w-10 h-12 object-cover rounded bg-neutral-100" />
                      </td>
                      <td className="p-4 font-bold">{actor.name}</td>
                      <td className="p-4 text-neutral-500">{actor.englishName}</td>
                      <td className="p-4 text-neutral-500">
                        {actor.height ? `${actor.height}cm` : '-'} / {actor.weight ? `${actor.weight}kg` : '-'}
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button 
                          onClick={() => handleOpenModal(actor)}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-xs font-semibold transition"
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDelete(actor.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold transition"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* 추가/수정 모달 폼 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
              <h3 className="text-lg font-bold">{editingId ? '아티스트 정보 수정' : '새 아티스트 등록'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">이름 (Name)</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">영문 이름 (English Name)</label>
                  <input type="text" name="englishName" value={formData.englishName} onChange={handleChange} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">성별 (Gender)</label>
                  <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">생년월일 (Birth)</label>
                  <input type="text" name="birth" value={formData.birth} onChange={handleChange} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">키 (Height - 숫자만)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">몸무게 (Weight - 숫자만)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">이미지 URL (Image URL)</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">학력/소속 (Education)</label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">바이오그래피 (Biography)</label>
                <textarea name="biography" rows="3" value={formData.biography} onChange={handleChange} className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:outline-black resize-none"></textarea>
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