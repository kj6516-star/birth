import React from 'react';

export default function About() {
  return (
    <div className="w-full bg-white text-neutral-900 select-none">
      
      {/* 1. 상단 비주얼 섹션 (Hero Section) */}
      <section className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-900/80 to-neutral-900 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black opacity-80" />

        <div className="relative z-20 text-center space-y-4 px-6">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-neutral-400 font-medium">
            TK COMPANY INTRODUCTION
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wider leading-tight">
            CREATING NEW WAVE <br />
            <span className="text-neutral-400 font-light">IN ENTERTAINMENT</span>
          </h1>
        </div>
      </section>

      {/* 2. 브랜드 철학 및 소개 (Who We Are) */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
        <h2 className="text-xs md:text-sm font-bold tracking-[0.25em] text-neutral-400 uppercase">
          WHO WE ARE
        </h2>
        <p className="text-xl md:text-3xl font-light leading-relaxed text-neutral-800 tracking-tight">
          <strong className="font-semibold text-black">㈜TK Company</strong>는 대중문화 예술의 새로운 패러다임을 제시하고, <br className="hidden md:block" />
          끝없는 도전과 창의적인 프로듀싱을 통해 <br className="hidden md:block" />
          글로벌 아티스트와 대중을 연결합니다.
        </p>
        <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-8" />
      </section>

      {/* 3. 프로세스 섹션 (4단계 전문 프로세스) */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-neutral-50/60 border-t border-neutral-100">
        <div className="mb-16 space-y-3">
          <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-neutral-400 uppercase">
            OUR SYSTEM & PHILOSOPHY
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            WE BELIEVE IN POTENTIAL.
          </h2>
          <p className="text-sm md:text-base text-neutral-500">
            신인 아티스트의 첫 시작부터 주연으로 성장하기까지, TK만의 4단계 전문 프로세스
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-neutral-200/80 p-8 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xl font-bold text-neutral-400 tracking-wider">01 / DISCOVERY</span>
              <h3 className="text-lg font-bold text-black">발견</h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                아직 세상에 알려지지 않은 원석 같은 새로운 얼굴과 독창적인 마스크를 발굴합니다.
              </p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 p-8 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xl font-bold text-neutral-400 tracking-wider">02 / DEVELOPMENT</span>
              <h3 className="text-lg font-bold text-black">성장과 훈련</h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                아티스트 각자가 지닌 고유한 개성과 매력, 연기적 장점을 파악하여 탄탄하게 성장시킵니다.
              </p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 p-8 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xl font-bold text-neutral-400 tracking-wider">03 / MANAGEMENT</span>
              <h3 className="text-lg font-bold text-black">전문 매니지먼트</h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                오디션 준비부터 캐스팅 전략, 작품 활동 및 미디어 관리까지 체계적인 시스템으로 함께합니다.
              </p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 p-8 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xl font-bold text-neutral-400 tracking-wider">04 / OPPORTUNITY</span>
              <h3 className="text-lg font-bold text-black">기회 연결</h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                영화, 드라마, OTT 시리즈, 광고 등 배우가 더 많은 최적의 장면과 만날 수 있도록 연결합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 회사 위치 및 지도 섹션 */}
      <section className="relative w-full bg-[#121214] py-28 px-6 overflow-hidden text-neutral-300">
        
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* 섹션 상단 타이틀 */}
          <div className="space-y-2">
            <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-neutral-500 uppercase">
              LOCATION
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              OFFICE LOCATION
            </h2>
          </div>

          {/* 하나의 커다란 화이트 박스 */}
          <div className="bg-white text-neutral-900 p-8 md:p-12 shadow-2xl rounded-none md:rounded-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* 왼쪽 영역: 주소 및 연락처 정보 */}
            <div className="space-y-8 flex flex-col justify-center h-full">
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-black tracking-wider uppercase text-neutral-900">
                  TKM MANAGEMENT
                </h3>
                <div className="w-12 h-[2px] bg-amber-500" />
              </div>

              <div className="space-y-4 text-xl md:text-sm text-neutral-700">
                <div className="flex items-start gap-3">
                  <span className="text-xl select-none">📍</span>
                  <div className="space-y-1">
                    <p className="font-semibold text-black text-base">(03929) 서울특별시 마포구 마포나루길 442 TKM ENT</p>
                    <p className="text-neutral-500 text-base">(03929) 442, Maponaru-gil, Mapo-gu, Seoul, TKM ENT</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2 border-t border-neutral-100">
                  <p className="flex items-center gap-2 text-base">
                    <span className="text-neutral-400">✉</span> contact@tkmcompany.com
                  </p>
                  <p className="flex items-center gap-2 text-base">
                    <span className="text-neutral-400">📞</span> +82-2-540-8820
                  </p>
                  <p className="flex items-center gap-2 text-base">
                    <span className="text-neutral-400">📠</span> +82-2-540-8821
                  </p>
                </div>
              </div>
            </div>

            {/* 오른쪽 영역: 카카오 이미지 지도 소스 적용 */}
            <div className="w-full flex justify-center items-center bg-neutral-100 border border-neutral-200 rounded-lg p-2 overflow-hidden">
              <div style={{ font: 'normal normal 400 12px/normal dotum, sans-serif', width: '100%', maxWidth: '640px', color: '#333', position: 'relative' }}>
                <div style={{ width: '100%', overflow: 'hidden' }}>
                  <a href="https://map.kakao.com/?urlX=477155.9999999993&amp;urlY=1126091.9999999995&amp;name=%EC%84%9C%EC%9A%B8%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EB%A7%88%ED%8F%AC%EB%82%98%EB%A3%A8%EA%B8%B8%20442&amp;map_type=TYPE_MAP&amp;from=roughmap" target="_blank" rel="noopener noreferrer">
                    <img className="map" src="http://t1.kakaocdn.net/roughmap/imgmap/19f8c50ea5d068c6e5d65bfd2a67f690d87801c1418592525af80c85fd21fe54" alt="카카오 지도" style={{ width: '100%', height: 'auto', border: '1px solid #ccc', display: 'block' }} />
                  </a>
                </div>
                <div style={{ overflow: 'hidden', padding: '7px 11px', border: '1px solid rgba(0, 0, 0, 0.1)', borderTop: 'none', borderRadius: '0px 0px 2px 2px', backgroundColor: 'rgb(249, 249, 249)' }}>
                  <a href="https://map.kakao.com" target="_blank" rel="noopener noreferrer" style={{ float: 'left' }}>
                    <img src="//t1.kakaocdn.net/localimg/localimages/07/2018/pc/common/logo_kakaomap.png" width="72" height="16" alt="카카오맵" style={{ display: 'block', width: '72px', height: '16px' }} />
                  </a>
                  <div style={{ float: 'right', position: 'relative', top: '1px', fontSize: '11px' }}>
                    <a target="_blank" rel="noopener noreferrer" href="https://map.kakao.com/?from=roughmap&amp;eName=%EC%84%9C%EC%9A%B8%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EB%A7%88%ED%8F%AC%EB%82%98%EB%A3%A8%EA%B8%B8%20442&amp;eX=477155.9999999993&amp;eY=1126091.9999999995" style={{ float: 'left', height: '15px', paddingTop: '1px', lineHeight: '15px', color: '#000', textDecoration: 'none' }}>길찾기</a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}