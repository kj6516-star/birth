// src/components/Info.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Info() {
  return (
    <div className="w-full bg-white text-neutral-900 select-none min-h-screen flex flex-col justify-between">
      
      {/* 1. 상단 타이틀 섹션 */}
      <section className="w-full pt-20 md:pt-28 pb-10 md:pb-12 px-5 md:px-6 text-center bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            AUDITION
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-neutral-900">
            오디션 안내
          </h1>
        </div>
      </section>

      {/* 2. 중앙 주황색 슬로건 배너 */}
      <div className="w-full bg-[#f59e0b] py-6 md:py-8 px-5 md:px-6 text-center text-white font-bold text-base md:text-3xl tracking-wide shadow-sm">
        TK MANAGEMENT와 함께 할 미래의 아티스트를 찾습니다.
      </div>

      {/* 3. 하단 상세 내용 섹션 */}
      <section className="max-w-4xl mx-auto px-5 md:px-6 py-10 md:py-16 w-full space-y-10 md:space-y-12">
        
        {/* 모집 분야 */}
        <div className="space-y-3 pb-6 md:pb-8 border-b border-neutral-200">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900">모집 분야</h3>
          <div className="w-8 h-[2px] bg-amber-500" />
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed pt-1 md:pt-2">
            영화, 드라마, OTT 오리지널 시리즈, 연극, 광고 등 연기 활동 전반. 전문 배우 매니지먼트로서 스크린과 브라운관 전 분야에 걸친 캐스팅과 작품 활동을 지원합니다.
          </p>
        </div>

        {/* 지원 대상 */}
        <div className="space-y-3 pb-6 md:pb-8 border-b border-neutral-200">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900">지원 대상</h3>
          <div className="w-8 h-[2px] bg-amber-500" />
          <ul className="text-base md:text-lg text-neutral-700 space-y-2 pt-1 md:pt-2 leading-relaxed">
            <li>• 연기에 대한 진정성과 열정, 고유한 개성을 지닌 신인배우 및 배우 지망생</li>
            <li>• 성별 및 연령 제한 없음</li>
            <li>• 경력 무관 (신인·지망생 및 기성 배우 모두 가능)</li>
            <li>• 국내외 연기 활동 결격사유 없는 자</li>
          </ul>
        </div>

        {/* 지원 방법 */}
        <div className="space-y-3 pb-6 md:pb-8 border-b border-neutral-200">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900">지원 방법</h3>
          <div className="w-8 h-[2px] bg-amber-500" />
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed pt-1 md:pt-2">
            온라인 오디션 지원서 양식을 통해 상시 접수합니다. 별도의 접수 마감 기한 없이 24시간 언제나 온라인으로 간편하게 신인배우 오디션에 지원하실 수 있습니다.
          </p>
        </div>

        {/* 제출 자료 */}
        <div className="space-y-3 pb-6 md:pb-8 border-b border-neutral-200">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900">제출 자료</h3>
          <div className="w-8 h-[2px] bg-amber-500" />
          <ul className="text-base md:text-lg text-neutral-700 space-y-2 pt-1 md:pt-2 leading-relaxed">
            <li>• 기본 인적사항 및 연락처 (필수)</li>
            <li>• 프로필 사진 (얼굴 클로즈업 또는 상반신 / 필수)</li>
            <li>• 자기소개 및 배우로서의 포부 서술</li>
            <li>• 자유 연기 영상 또는 쇼릴 링크 (선택 제출 우대)</li>
            <li>• SNS 및 포트폴리오 링크 (선택)</li>
          </ul>
        </div>

        {/* 오디션 진행 과정 */}
        <div className="space-y-3 pb-6 md:pb-8 border-b border-neutral-200">
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900">오디션 진행 과정</h3>
          <div className="w-8 h-[2px] bg-amber-500" />
          <div className="text-base md:text-lg text-neutral-700 space-y-2 pt-1 md:pt-2 leading-relaxed">
            <p><strong className="text-neutral-900">1단계:</strong> 온라인 서류 및 포트폴리오 심사</p>
            <p><strong className="text-neutral-900">2단계:</strong> 실물 카메라 오디션 & 심층 심사</p>
            <p><strong className="text-neutral-900">3단계:</strong> 최종 미팅 및 전속 매니지먼트 계약 체결</p>
          </div>
        </div>

        {/* 심사 및 결과 안내 · 문의 및 지원하기 버튼 */}
        <div className="space-y-6 pt-2">
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-bold text-neutral-900">심사 및 결과 안내 · 문의</h3>
            <div className="w-8 h-[2px] bg-amber-500" />
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed pt-1 md:pt-2">
              접수된 지원서는 전문 캐스팅 팀이 상시 검토하며, 1차 서류 심사 합격자에 한하여 기재된 연락처로 개별 안내드립니다.
            </p>
          </div>

          <div className="pt-4">
            <Link 
              to="/audition/write" 
              className="block w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-center text-lg md:text-xl rounded-lg transition shadow-md"
            >
              지금 지원하기 ↗
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}