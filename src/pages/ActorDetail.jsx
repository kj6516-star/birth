import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../back/supabaseClient';

export default function ActorDetail({ actor, onClose, user, onUpdateSuccess }) {
  if (!actor) return null;

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(actor || {});

  // actor가 바뀔 때마다 폼 데이터 동기화
  useEffect(() => {
    setFormData(actor ? JSON.parse(JSON.stringify(actor)) : {}); // 깊은 복사로 원본 객체 오염 방지
    setIsEditing(false);
  }, [actor]);

  // 💡 카테고리 정의 및 원하는 출력/편집 순서 배열
  const categoryTitles = {
    drama: 'TV 드라마',
    movie: '영화',
    performance: '공연',
    commercial: '광고',
    etc: '기타'
  };

  const categoryOrder = ['drama', 'movie', 'performance', 'commercial', 'etc'];

  // ────────────────────────────
  // 💡 필모그래피 편집 관련 핸들러들
  // ────────────────────────────

  // 1. 특정 카테고리에 새 연도별 필모 추가
  const handleAddFilmRow = (categoryKey) => {
    const currentFilm = formData.filmography || {};
    const categoryItems = currentFilm[categoryKey] || [];
    
    setFormData({
      ...formData,
      filmography: {
        ...currentFilm,
        [categoryKey]: [...categoryItems, { year: '', works: [''] }]
      }
    });
  };

  // 2. 필모 행 삭제
  const handleRemoveFilmRow = (categoryKey, rowIndex) => {
    const currentFilm = formData.filmography || {};
    const categoryItems = [...currentFilm[categoryKey]];
    categoryItems.splice(rowIndex, 1);

    setFormData({
      ...formData,
      filmography: {
        ...currentFilm,
        [categoryKey]: categoryItems
      }
    });
  };

  // 3. 연도(Year) 수정
  const handleFilmYearChange = (categoryKey, rowIndex, value) => {
    const currentFilm = formData.filmography || {};
    const categoryItems = [...currentFilm[categoryKey]];
    categoryItems[rowIndex].year = value;

    setFormData({
      ...formData,
      filmography: { ...currentFilm, [categoryKey]: categoryItems }
    });
  };

  // 4. 작품명(Works) 수정
  const handleFilmWorksChange = (categoryKey, rowIndex, value) => {
    const currentFilm = formData.filmography || {};
    const categoryItems = [...currentFilm[categoryKey]];
    categoryItems[rowIndex].works = value.split('\n');

    setFormData({
      ...formData,
      filmography: { ...currentFilm, [categoryKey]: categoryItems }
    });
  };

  // ────────────────────────────
  // Supabase 데이터베이스 저장 (Update)
  // ────────────────────────────
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      englishName: formData.englishName,
      gender: formData.gender,
      birth: formData.birth,
      height: formData.height ? parseInt(formData.height, 10) : null,
      weight: formData.weight ? parseInt(formData.weight, 10) : null,
      education: formData.education,
      image: formData.image,
      biography: formData.biography,
      filmography: formData.filmography,
    };

    const { error } = await supabase
      .from('Actors')
      .update(payload)
      .eq('id', actor.id);

    if (error) {
      alert('수정 실패: ' + error.message);
    } else {
      alert('배우 프로필과 필모그래피가 성공적으로 수정되었습니다.');
      setIsEditing(false);
      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    }
  };

  // 프로필 삭제
  const handleDelete = async () => {
    if (window.confirm(`정말 '${actor.name}' 배우의 프로필을 삭제하시겠습니까?`)) {
      const { error } = await supabase.from('Actors').delete().eq('id', actor.id);
      if (error) {
        alert('삭제 실패: ' + error.message);
      } else {
        alert('삭제되었습니다.');
        if (onUpdateSuccess) onUpdateSuccess();
        onClose();
      }
    }
  };

  // 인쇄 핸들러 (지정된 순서 적용)
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert('팝업 차단이 설정되어 있을 수 있습니다.');
      return;
    }

    let filmographyHTML = '';
    const currentFilm = isEditing ? formData.filmography : actor.filmography;
    
    if (currentFilm) {
      categoryOrder.forEach((key) => {
        const items = currentFilm[key];
        if (!items || items.length === 0) return;
        const title = categoryTitles[key] || key;
        let rowsHTML = '';
        items.forEach(row => {
          const worksArray = Array.isArray(row.works) ? row.works : [row.works];
          const worksText = worksArray.join('<br>');
          rowsHTML += `
            <div style="display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 14px;">
              <div style="width: 70px; font-weight: bold; color: #111; flex-shrink: 0;">${row.year}</div>
              <div style="flex: 1; color: #444; line-height: 1.5;">${worksText}</div>
            </div>
          `;
        });
        filmographyHTML += `
          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 16px; font-weight: 900; color: #111; border-left: 4px solid #f59e0b; padding-left: 10px; margin-bottom: 12px;">${title}</h3>
            <div style="padding-left: 14px;">${rowsHTML}</div>
          </div>
        `;
      });
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${actor.name} - TK MANAGEMENT BIO-SHEET</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Malgun Gothic', sans-serif; background: #111; color: #000; padding: 20px; display: flex; flex-direction: column; align-items: center; }
            .toolbar { width: 100%; max-width: 850px; display: flex; justify-content: space-between; align-items: center; background: #1a1a1a; padding: 12px 20px; color: #fff; margin-bottom: 20px; border-radius: 4px; }
            .action-btn { background: #fff; color: #000; border: none; padding: 8px 16px; font-weight: bold; font-size: 13px; border-radius: 4px; cursor: pointer; }
            .a4-sheet { width: 850px; background: #fff; padding: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            @media print {
              body { background: #fff; padding: 0; }
              .toolbar { display: none !important; }
              .a4-sheet { width: 100%; box-shadow: none; padding: 0; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <div style="color: #fff; font-weight: bold;">TK MANAGEMENT / CASTING BIO-SHEET</div>
            <div>
              <button class="action-btn" onclick="window.print()">🖨️ PRINT</button>
              <button class="action-btn" onclick="window.close()">✕ 닫기</button>
            </div>
          </div>
          <div class="a4-sheet">
            <h2 style="font-size: 38px; font-weight: 900; margin-bottom: 20px;">${actor.name}</h2>
            ${filmographyHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCastingInquiry = () => {
    onClose();
    navigate('/contact', { state: { actorName: actor.name } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto p-6 md:p-12">
        
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition z-10"
        >
          ✕
        </button>

        {/* 🔒 관리자 제어 바 */}
        {user && (
          <div className="mb-6 p-4 bg-neutral-900 text-white rounded-xl flex justify-between items-center shadow-md">
            <div className="text-xs font-semibold text-amber-400">🛠️ ADMIN MODE</div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className="px-3 py-1.5 bg-white text-neutral-900 text-xs font-bold rounded hover:bg-neutral-200"
              >
                {isEditing ? '수정 취소' : '✏️ 정보 및 필모 수정 모드'}
              </button>
              <button 
                onClick={handleDelete} 
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
              >
                🗑️ 프로필 삭제
              </button>
            </div>
          </div>
        )}

        {/* 👉 [수정 모드] 기본 정보 + 필모그래피 입력 폼 */}
        {isEditing ? (
          <form onSubmit={handleUpdateSubmit} className="space-y-8">
            <h3 className="text-2xl font-black text-neutral-900 border-b pb-4">배우 정보 및 필모그래피 수정</h3>
            
            {/* 기본 정보 입력 필드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">이름</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-neutral-300 rounded p-2 text-sm"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">영문 이름</label>
                <input 
                  type="text" 
                  value={formData.englishName || ''} 
                  onChange={(e) => setFormData({...formData, englishName: e.target.value})}
                  className="w-full border border-neutral-300 rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">성별</label>
                <input 
                  type="text" 
                  value={formData.gender || ''} 
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full border border-neutral-300 rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">생년월일</label>
                <input 
                  type="text" 
                  value={formData.birth || ''} 
                  onChange={(e) => setFormData({...formData, birth: e.target.value})}
                  className="w-full border border-neutral-300 rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">키 (cm)</label>
                <input 
                  type="number" 
                  value={formData.height || ''} 
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full border border-neutral-300 rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">학력</label>
                <input 
                  type="text" 
                  value={formData.education || ''} 
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  className="w-full border border-neutral-300 rounded p-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">이미지 URL</label>
              <input 
                type="text" 
                value={formData.image || ''} 
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full border border-neutral-300 rounded p-2 text-sm"
              />
            </div>

            {/* 🎬 필모그래피 편집 영역 (지정된 순서 적용) */}
            <div className="border-t pt-6 space-y-6">
              <h4 className="text-lg font-bold text-neutral-900">필모그래피 편집</h4>
              
              {categoryOrder.map((catKey) => {
                const catTitle = categoryTitles[catKey];
                const rows = formData.filmography?.[catKey] || [];

                return (
                  <div key={catKey} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-neutral-800">{catTitle}</span>
                      <button 
                        type="button"
                        onClick={() => handleAddFilmRow(catKey)}
                        className="px-2.5 py-1 bg-neutral-900 text-white text-xs rounded hover:bg-black"
                      >
                        + 연도별 항목 추가
                      </button>
                    </div>

                    {rows.length === 0 && (
                      <p className="text-xs text-neutral-400 italic">등록된 내역이 없습니다.</p>
                    )}

                    {rows.map((row, rIdx) => (
                      <div key={rIdx} className="flex gap-3 items-start bg-white p-3 rounded border border-neutral-200">
                        <div className="w-24">
                          <label className="block text-[10px] text-neutral-400 mb-1">연도</label>
                          <input 
                            type="text" 
                            value={row.year || ''} 
                            onChange={(e) => handleFilmYearChange(catKey, rIdx, e.target.value)}
                            placeholder="예: 2024"
                            className="w-full border rounded p-1.5 text-xs"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] text-neutral-400 mb-1">작품명 (줄바꿈으로 여러 개 입력 가능)</label>
                          <textarea 
                            rows="2"
                            value={Array.isArray(row.works) ? row.works.join('\n') : row.works} 
                            onChange={(e) => handleFilmWorksChange(catKey, rIdx, e.target.value)}
                            placeholder="작품명을 입력하세요"
                            className="w-full border rounded p-1.5 text-xs resize-none"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveFilmRow(catKey, rIdx)}
                          className="mt-5 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* 저장/취소 버튼 */}
            <div className="flex justify-end gap-2 pt-4">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="px-5 py-2.5 bg-neutral-100 text-xs font-semibold rounded-lg hover:bg-neutral-200"
              >
                취소
              </button>
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
              >
                변경사항 저장하기
              </button>
            </div>
          </form>
        ) : (
          /* 👉 [일반 조회 모드] */
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pb-10 border-b border-neutral-200">
              <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
                <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#f59e0b] tracking-widest uppercase">ACTOR PROFILE</span>
                  <h2 className="text-4xl font-black mt-1 text-neutral-900">{actor.name}</h2>
                  <p className="text-sm text-neutral-400 font-medium">{actor.englishName}</p>
                </div>

                {/* ✨ 수정된 프로필 정보 박스 (한 줄 깨짐 방지 및 반응형 적용) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-5 rounded-xl text-xs md:text-sm border border-neutral-100">
                  <div className="flex items-center gap-2"><span className="text-neutral-400 whitespace-nowrap">성별:</span> <span className="font-semibold text-neutral-800">{actor.gender}</span></div>
                  <div className="flex items-center gap-2"><span className="text-neutral-400 whitespace-nowrap">생년월일:</span> <span className="font-semibold text-neutral-800">{actor.birth}</span></div>
                  <div className="flex items-center gap-2"><span className="text-neutral-400 whitespace-nowrap">키:</span> <span className="font-semibold text-neutral-800">{actor.height ? `${actor.height}cm` : ''}</span></div>
                  <div className="flex items-center gap-2 col-span-1 sm:col-span-2"><span className="text-neutral-400 whitespace-nowrap">학력:</span> <span className="font-semibold text-neutral-800">{actor.education}</span></div>
                </div>
              </div>
            </div>

            {/* 필모그래피 출력 영역 (지정된 순서 적용) */}
            <div className="pt-10 space-y-12">
              {actor.filmography && categoryOrder.map((key) => {
                const items = actor.filmography[key];
                if (!items || items.length === 0) return null;

                return (
                  <div key={key} className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-neutral-900">{categoryTitles[key]}</h3>
                      <div className="w-8 h-1 bg-[#f59e0b] mt-2 rounded-full"></div>
                    </div>

                    <div className="space-y-4 text-sm md:text-base">
                      {items.map((row, index) => {
                        const worksArray = Array.isArray(row.works) ? row.works : [row.works];
                        return (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-12">
                            <span className="w-16 font-bold text-neutral-900 text-lg shrink-0">{row.year}</span>
                            <div className="flex flex-col space-y-1.5 flex-1">
                              {worksArray.map((work, wIndex) => (
                                <span key={wIndex} className="text-neutral-600 font-medium">{work}</span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 하단 버튼 (인쇄 및 캐스팅 문의) */}
            <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handlePrint}
                className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm flex items-center justify-center gap-3 transition shadow-md"
              >
                DOWNLOAD PROFILE (프로필 인쇄 / PDF)
              </button>

              <button
                onClick={handleCastingInquiry}
                className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-sm flex items-center justify-center gap-3 transition shadow-sm"
              >
                이 배우 캐스팅 문의하기
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}