import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../back/supabaseClient';

export default function Write() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    field: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    phone: '',
    email: '',
    height: '',
    weight: '',
    instagram: '',
    videoLink: '',
    specialty: '',
    introduction: '',
    photoUrl: '',
    portfolioLink: '',
    agree: false,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 모달이 열릴 때 배경(body) 스크롤 고정 및 해제
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmModal]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);

    try {
      let uploadedPhotoUrl = formData.photoUrl;

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('audition-photos')
          .upload(filePath, photoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('audition-photos')
          .getPublicUrl(filePath);

        uploadedPhotoUrl = publicUrlData.publicUrl;
      }

      const birthDate = formData.birthYear && formData.birthMonth && formData.birthDay
        ? `${formData.birthYear}-${String(formData.birthMonth).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}`
        : null;

      const submitData = {
        name: formData.name, 
        gender: formData.gender || null,
        field: formData.field || null,
        birth: birthDate,
        phone: formData.phone || null,
        email: formData.email || null,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        instagram: formData.instagram || null,
        videoLink: formData.videoLink || null,
        specialty: formData.specialty || null, 
        introduction: formData.introduction || null,
        photoUrl: uploadedPhotoUrl || null,
        portfolioLink: formData.portfolioLink || null,
        agree: formData.agree
      };

      const { error } = await supabase
        .from('Audition_form')
        .insert([submitData]);

      if (error) throw error;

      try {
        await supabase.functions.invoke('send-email', {
          body: {
            formType: 'audition',
            ...submitData,
          },
        });
      } catch (emailError) {
        console.error('메일 알림 전송 실패:', emailError);
      }

      setShowConfirmModal(false);
      setIsSubmitted(true);

      setFormData({
        name: '', gender: '', field: '', birthYear: '', birthMonth: '', birthDay: '',
        phone: '', email: '', height: '', weight: '', instagram: '', videoLink: '',
        specialty: '', introduction: '', photoUrl: '', portfolioLink: '', agree: false,
      });
      setPhotoFile(null);
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoPreview('');

    } catch (error) {
      console.error('지원 접수 오류:', error.message);
      alert(`접수 중 문제가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getGenderText = (g) => g === 'female' ? '여성 (Female)' : g === 'male' ? '남성 (Male)' : g;
  const getFieldText = (f) => f === 'actor' ? '배우' : f === 'entertainer' ? '엔터테이너' : f;
    
  return (
    <div className="w-full bg-white text-neutral-900 select-none min-h-screen flex flex-col justify-between relative">
      
      {/* ================= 💡 ReactDOM.createPortal을 이용해 모달을 body 최상단으로 분리 ================= */}
      {showConfirmModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl relative my-auto">
            
            <div className="px-6 py-5 border-b border-neutral-200 shrink-0 bg-white rounded-t-2xl">
              <h3 className="text-xl font-black text-neutral-900">📝 지원서 내용 확인</h3>
              <p className="text-sm text-neutral-500 mt-1">작성하신 내용이 정확한지 입력창 형태로 검토해주세요.</p>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-cyan-600 uppercase tracking-wide">01. 기본 인적사항</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-500">이름 (Name)</label>
                    <input type="text" value={formData.name} disabled className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-500">성별 (Gender)</label>
                    <input type="text" value={getGenderText(formData.gender)} disabled className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-500">지원분야 (Field)</label>
                    <input type="text" value={getFieldText(formData.field)} disabled className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-500">생년월일 (Birth Date)</label>
                  <input type="text" value={`${formData.birthYear || ''}년 ${formData.birthMonth || ''}월 ${formData.birthDay || ''}일`} disabled className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-500">연락처 (Phone)</label>
                    <input type="text" value={formData.phone} disabled className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-500">이메일 (Email)</label>
                    <input type="text" value={formData.email} disabled className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-cyan-600 uppercase tracking-wide">02. SNS 및 포트폴리오 링크</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-500">인스타그램</label>
                    <input type="text" value={formData.instagram || '입력 안 함'} disabled className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-500">유튜브 / 영상 링크</label>
                    <input type="text" value={formData.videoLink || '입력 안 함'} disabled className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-cyan-600 uppercase tracking-wide">03. 자기소개 및 첨부</h4>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-500">자기소개</label>
                  <textarea value={formData.introduction || '입력 안 함'} disabled rows="4" className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded text-neutral-800 text-sm cursor-not-allowed resize-none" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-500">첨부된 프로필 사진</label>
                  {photoPreview ? (
                    <div className="w-32 h-40 border rounded overflow-hidden">
                      <img src={photoPreview} alt="최종 확인 미리보기" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500">등록된 사진이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 shrink-0 flex gap-3 bg-white rounded-b-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="flex-1 py-3.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold rounded-xl transition"
              >
                수정하기
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? '전송 중...' : '최종 전송하기'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
      {/* ==================================================================== */}

      {/* 1. 상단 타이틀 섹션 */}
      <section className="w-full pt-28 pb-12 px-6 text-center bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-neutral-400 uppercase">AUDITION</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900">오디션 지원하기</h1>
        </div>
      </section>

      {/* 2. 중앙 주황색 슬로건 배너 */}
      <div className="w-full bg-[#f59e0b] py-8 px-6 text-center text-white font-bold text-lg md:text-3xl tracking-wide shadow-sm">
        TK MANAGEMENT와 함께 할 미래의 아티스트를 찾습니다.
      </div>

      {/* 3. 지원 폼 또는 완료 화면 영역 */}
      <section className="max-w-4xl mx-auto px-6 py-16 w-full">
        {isSubmitted ? (
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-10 text-center space-y-6 shadow-sm my-12">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">✓</div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900">오디션 지원이 정상적으로 접수되었습니다.</h2>
              <p className="text-neutral-600 text-base">지원해주셔서 감사합니다. 내부 검토 후 연락드리겠습니다.</p>
            </div>
            <div className="pt-4 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg transition shadow"
              >
                새로운 지원서 작성하기
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePreSubmit} className="space-y-10">
            {/* 01. 기본 인적사항 */}
            <div className="space-y-4">
              <h2 className="text-cyan-600 font-bold text-xl tracking-wide">01. 기본 인적사항</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">이름 (Name) *</label>
                  <input
                    type="text" name="name" placeholder="홍길동"
                    value={formData.name} onChange={handleChange} required
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">성별 (Gender) *</label>
                  <select
                    name="gender" value={formData.gender} onChange={handleChange} required
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base bg-white text-neutral-700"
                  >
                    <option value="">성별 선택</option>
                    <option value="male">남성 (Male)</option>
                    <option value="female">여성 (Female)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">지원분야 (Field) *</label>
                  <select
                    name="field" value={formData.field} onChange={handleChange} required
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base bg-white text-neutral-700"
                  >
                    <option value="">지원분야 선택</option>
                    <option value="actor">배우</option>
                    <option value="entertainer">엔터테이너</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-base font-semibold text-neutral-600">생년월일 (Birth Date) *</label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    name="birthYear" value={formData.birthYear} onChange={handleChange} required
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base bg-white text-neutral-700"
                  >
                    <option value="">년 (Year)</option>
                    {Array.from({ length: 60 }, (_, i) => 2026 - i).map((year) => (
                      <option key={year} value={year}>{year}년</option>
                    ))}
                  </select>
                  <select
                    name="birthMonth" value={formData.birthMonth} onChange={handleChange} required
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base bg-white text-neutral-700"
                  >
                    <option value="">월 (Month)</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>{month}월</option>
                    ))}
                  </select>
                  <select
                    name="birthDay" value={formData.birthDay} onChange={handleChange} required
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base bg-white text-neutral-700"
                  >
                    <option value="">일 (Day)</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>{day}일</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">연락처 (Phone) *</label>
                  <input
                    type="text" name="phone" placeholder="010-0000-0000"
                    value={formData.phone} onChange={handleChange} required
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">이메일 (Email) *</label>
                  <input
                    type="email" name="email" placeholder="example@email.com"
                    value={formData.email} onChange={handleChange} required
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">키 (Height)</label>
                  <input
                    type="number" name="height" placeholder="cm 단위 숫자 (예: 172)"
                    value={formData.height} onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">몸무게 (Weight)</label>
                  <input
                    type="number" name="weight" placeholder="kg 단위 숫자 (예: 52)"
                    value={formData.weight} onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
              </div>
            </div>

            <hr className="border-neutral-200" />

            {/* 02. SNS 및 포트폴리오 링크 */}
            <div className="space-y-4">
              <h2 className="text-cyan-600 font-bold text-xl tracking-wide">02. SNS 및 포트폴리오 링크</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">인스타그램 계정 (Instagram)</label>
                  <input
                    type="text" name="instagram" placeholder="@username 또는 프로필 URL"
                    value={formData.instagram} onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">유튜브 / 영상 링크 (YouTube / Vimeo)</label>
                  <input
                    type="text" name="videoLink" placeholder="https://youtube.com/..."
                    value={formData.videoLink} onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-base font-semibold text-neutral-600">특기 / 취미 (Specialties & Talents)</label>
                <input
                  type="text" name="specialty" placeholder="예: 현대무용, 사투리 연기, 바이올린, 태권도, 외국어 등"
                  value={formData.specialty} onChange={handleChange}
                  className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                />
              </div>
            </div>

            <hr className="border-neutral-200" />

            {/* 03. 자기소개 및 사진/영상 첨부 */}
            <div className="space-y-4">
              <h2 className="text-cyan-600 font-bold text-xl tracking-wide">03. 자기소개 및 사진/영상 첨부</h2>

              <div className="space-y-1">
                <label className="block text-base font-semibold text-neutral-600">자기소개 및 배우로서의 포부</label>
                <textarea
                  name="introduction" rows="5"
                  placeholder="배우를 꿈꾸게 된 계기, 본인이 생각하는 매력과 강점 등을 자유롭게 서술해주세요."
                  value={formData.introduction} onChange={handleChange}
                  className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-neutral-600">프로필 사진 첨부 </label>
                  <input
                    type="file" accept="image/*" onChange={handlePhotoChange} 
                    className="w-full p-2.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                  {photoPreview && (
                    <div className="mt-2 relative w-32 h-40 border border-neutral-200 rounded overflow-hidden shadow-sm">
                      <img src={photoPreview} alt="프로필 미리보기" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-base font-semibold text-neutral-600">연기 영상 또는 쇼릴 링크 (선택)</label>
                  <input
                    type="text" name="portfolioLink" placeholder="자유 연기 영상 링크 (유튜브/드라이브)"
                    value={formData.portfolioLink} onChange={handleChange}
                    className="w-full p-3.5 border border-neutral-300 rounded focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
              </div>
            </div>

            {/* 개인정보 수집 동의 */}
            <div className="space-y-2 pt-2">
              <fieldset className="border border-neutral-300 rounded p-4">
                <legend className="px-2 text-base font-bold text-neutral-500 bg-white">개인정보 수집 및 이용에 대한 안내</legend>
                <div className="h-32 overflow-y-auto text-sm text-neutral-600 space-y-3 pr-2 leading-relaxed">
                  <p className="font-semibold text-neutral-800">개인정보 항목 수집 및 이용 동의</p>
                  <div>
                    <p className="font-semibold text-neutral-700">[수집 목적]</p>
                    <p>오디션 지원자 관리 및 오디션 진행, 인재DB 운영</p>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700">[수집하는 개인정보 항목]</p>
                    <p>(필수) 이름, 성별, 지원분야, 생년월일, 연락처, 이메일, 프로필 사진 / (선택) 키, 몸무게, 인스타그램, 유튜브/영상 링크, 특기/취미, 자기소개</p>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700">[개인정보의 보유 및 이용 기간]</p>
                    <p>지원일로부터 1년 동안 오디션 인재DB 보관 후 파기</p>
                  </div>
                </div>
              </fieldset>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox" id="agree" name="agree"
                  checked={formData.agree} onChange={handleChange}
                  className="w-4 h-4 text-amber-500 border-neutral-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="agree" className="text-base text-neutral-700 font-medium cursor-pointer">
                  [필수] 오디션 지원을 위한 개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-center text-xl rounded-lg transition shadow-md"
              >
                지원 내용 확인 및 제출
              </button>
            </div>

          </form>
        )}
      </section>

    </div>
  );
}