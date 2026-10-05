import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../back/supabaseClient';

export default function Contact() {
  const location = useLocation();
  const navigate = useNavigate();
  const targetActor = location.state?.actorName || '';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    category: targetActor ? 'casting' : '',
    targetActor: targetActor,
    title: targetActor ? `[캐스팅 제안] ${targetActor} 배우 작품/광고 출연 문의` : '',
    content: '',
    agree: false,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('성함을 입력해주세요.');
      return;
    }
    if (!formData.email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!formData.category) {
      alert('문의 분류를 선택해주세요.');
      return;
    }
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      alert('문의 내용을 입력해주세요.');
      return;
    }
    if (!formData.agree) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('Contact_form').insert([
        {
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          actor: formData.targetActor,
          title: formData.title,
          content: formData.content,
          agree: formData.agree,
        },
      ]);

      if (error) throw error;

      setShowConfirmModal(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('문의 접수 중 에러 발생:', error.message);
      alert('문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 카테고리 값을 한글 텍스트로 변환해주는 헬퍼 함수
  const getCategoryText = (cat) => {
    switch (cat) {
      case 'casting': return '배우 캐스팅 제안';
      case 'audition': return '오디션 관련 문의';
      case 'business': return '비즈니스 및 제휴 문의';
      default: return cat;
    }
  };

  return (
    <div className="w-full bg-white text-neutral-900 select-none min-h-screen flex flex-col justify-between">
      
      {/* 상단 타이틀 섹션 */}
      <section className="w-full pt-28 pb-12 px-6 text-center bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            CONTACT US
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900">
            문의하기
          </h1>
        </div>
      </section>

      {/* 중앙 주황색 슬로건 배너 */}
      <div className="w-full bg-[#f59e0b] py-8 px-6 text-center text-white font-bold text-lg md:text-2xl tracking-wide shadow-sm">
        배우 캐스팅, 광고/화보 제안, 비즈니스 협업 및 제휴 문의를 상시 접수하고 있습니다
      </div>

      {/* 문의 안내 및 폼 / 성공 화면 영역 */}
      <section className="max-w-4xl mx-auto px-6 py-16 w-full space-y-16">
        
        {isSubmitted ? (
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-10 text-center space-y-6 shadow-sm my-12">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900">
                문의가 성공적으로 완료되었습니다.
              </h2>
              <p className="text-neutral-600 text-base">
                문의해주셔서 감사합니다. 빠른 시일 내에 검토 후 답변드리겠습니다.
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg transition shadow"
              >
                홈으로 가기
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    company: '',
                    phone: '',
                    email: '',
                    category: '',
                    targetActor: '',
                    title: '',
                    content: '',
                    agree: false,
                  });
                }}
                className="px-8 py-3.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold rounded-lg transition"
              >
                새로운 문의 작성하기
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePreSubmit} className="space-y-10">
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                <h3 className="text-cyan-600 font-bold text-xl tracking-wide">
                  INQUIRY FORM (온라인 문의 접수)
                </h3>
                {targetActor && (
                  <div className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                    <span className="text-amber-400">배우:</span> {targetActor}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">성함 (NAME) *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">소속 / 회사명 (COMPANY)</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="제작사, 방송사, 에이전시 등"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">이메일 (E-MAIL) *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">연락처 (PHONE)</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">문의 분류 (CATEGORY) *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base bg-white text-neutral-700"
                  >
                    <option value="">문의 유형 선택</option>
                    <option value="casting">배우 캐스팅 제안</option>
                    <option value="audition">오디션 관련 문의</option>
                    <option value="business">비즈니스 및 제휴 문의</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">대상 배우 선택 (TARGET ACTOR)</label>
                  <input
                    type="text"
                    name="targetActor"
                    placeholder="-- 특정 배우 선택 (선택사항) --"
                    value={formData.targetActor}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
              </div>

            </div>

            <hr className="border-neutral-200" />

            <div className="space-y-4">
              <h3 className="text-cyan-600 font-bold text-xl tracking-wide">
                문의 내용 작성
              </h3>

              <div className="space-y-1">
                <label className="block text-base font-semibold text-neutral-600">제목 (SUBJECT) *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="문의 제목을 입력해주세요."
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-base font-semibold text-neutral-600">내용 (INQUIRY / MESSAGE) *</label>
                <textarea
                  name="content"
                  rows="6"
                  placeholder="작품 개요, 배역 설명, 촬영 일정, 예산 또는 협력 제안 내용을 상세히 적어주시면 빠른 회신에 도움이 됩니다."
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base resize-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <fieldset className="border border-neutral-300 rounded p-4">
                <legend className="px-2 text-base font-bold text-neutral-500 bg-white">
                  개인정보 수집 및 이용에 대한 안내
                </legend>
                <div className="h-32 overflow-y-auto text-sm text-neutral-600 space-y-3 pr-2 leading-relaxed">
                  <p className="font-semibold text-neutral-800">개인정보 항목 수집 및 이용 동의</p>
                  <div>
                    <p className="font-semibold text-neutral-700">[수집 목적]</p>
                    <p>문의사항 확인 및 원활한 의사소통 경로 확보</p>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700">[수집하는 개인정보 항목]</p>
                    <p>(필수) 이름, 연락처, 이메일, 문의 내용</p>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700">[개인정보의 보유 및 이용 기간]</p>
                    <p>문의 접수 및 처리 완료 후 3개월간 보관 후 파기</p>
                  </div>
                </div>
              </fieldset>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-4 h-4 text-amber-500 border-neutral-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="agree" className="text-base text-neutral-700 font-medium cursor-pointer">
                  [필수] 문의 접수를 위한 개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-center text-xl rounded-lg transition shadow-md flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                작성 내용 확인 및 제출
              </button>
            </div>

          </form>
        )}

      </section>

      {/* ================= 입력 내용 확인 모달 (입력창 스타일 적용) ================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-black text-neutral-900">📝 문의하기</h3>
              <p className="text-sm text-neutral-500 mt-1">작성하신 내용이 정확한지 다시 한번 검토해주세요.</p>
            </div>

            {/* 실제 입력창 형태를 재현한 읽기 전용 미리보기 영역 */}
            <div className="space-y-4 text-neutral-700">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-500">성함 (NAME)</label>
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-500">소속 / 회사명 (COMPANY)</label>
                  <input
                    type="text"
                    value={formData.company || '없음'}
                    disabled
                    className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-500">이메일 (E-MAIL)</label>
                  <input
                    type="text"
                    value={formData.email}
                    disabled
                    className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-500">연락처 (PHONE)</label>
                  <input
                    type="text"
                    value={formData.phone || '없음'}
                    disabled
                    className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-500">문의 분류 (CATEGORY)</label>
                  <input
                    type="text"
                    value={getCategoryText(formData.category)}
                    disabled
                    className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-500">대상 배우 (TARGET ACTOR)</label>
                  <input
                    type="text"
                    value={formData.targetActor || '선택 안 함'}
                    disabled
                    className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-500">제목 (SUBJECT)</label>
                <input
                  type="text"
                  value={formData.title}
                  disabled
                  className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-500">내용 (MESSAGE)</label>
                <textarea
                  value={formData.content}
                  disabled
                  rows="4"
                  className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed resize-none"
                />
              </div>

            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold rounded-xl transition"
              >
                수정하기
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? '전송 중...' : '최종 전송하기'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}