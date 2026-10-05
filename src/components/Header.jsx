import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/002.png'; 

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // 모바일 메뉴 열림/닫힘 상태

  const menuItems = [
    { 
      title: 'COMPANY', 
      path: '/about', 
      submenus: [
        { name: '회사소개', path: '/about' }, 
        { name: '대표인사말', path: '/greeting' }
      ] 
    },
    { 
      title: 'ARTISTS', 
      path: '/artists/actor',
      submenus: [
        { name: '배우', path: '/artists/actor' },
        { name: '엔터테이너', path: '/artists/entertainer' }
      ] 
    },
    { 
      title: 'NEWS', 
      path: '/news/notice',
      submenus: [
        { name: 'NOTICE', path: '/news/notice' },
        { name: 'NOTICE2', path: '/news/notice2' }
      ] 
    },
    { 
      title: 'AUDITION', 
      path: '/audition/info',
      submenus: [
        { name: '지원안내', path: '/audition/info' },
        { name: '지원하기', path: '/audition/write' }
      ] 
    },
    { 
      title: 'CONTACT', 
      path: '/contact',
      submenus: [] 
    }
  ];

  return (
    <header 
      className="relative w-full bg-white text-black border-b border-neutral-200 transition-all duration-300 select-none z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 전체를 감싸는 컨테이너 (모바일선 패딩 축소, 반응형 적용) */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        
        {/* 1. 상단 메인 바 영역 */}
        <div className="h-16 md:h-20 flex items-center justify-between text-xl md:text-3xl">
          {/* 로고 (모바일에서는 크기 조절 및 텍스트 크기 조정) */}
          <Link to="/" className="cursor-pointer flex items-center shrink-0">
            <img 
              src={logoImage} 
              alt="TK MANAGEMENT Logo" 
              className="h-10 md:h-16 w-auto object-contain mr-1" 
            />
            <span className="text-lg md:text-3xl font-bold tracking-tight">MANAGEMENT</span>
          </Link>

          {/* 데스크톱 대메뉴 목록 (lg 이상에서만 표시) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-14 text-xl xl:text-2xl font-bold tracking-wider">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path} 
                className="cursor-pointer hover:text-neutral-500 transition py-2 w-[110px] xl:w-[130px] text-center"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* 모바일 햄버거 버튼 (lg 미만에서만 표시) */}
          <button 
            className="lg:hidden p-2 text-neutral-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 2. 데스크톱 마우스 올렸을 때 펼쳐지는 드롭다운 영역 */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-neutral-100 ${
            isHovered ? 'max-h-60 py-8 opacity-100' : 'max-h-0 py-0 opacity-0'
          }`}
        >
          <div className="hidden lg:flex justify-end">
            <div className="flex items-start gap-6 xl:gap-14">
              {menuItems.map((item, index) => (
                <div key={index} className="flex flex-col space-y-3 text-lg xl:text-xl font-medium text-neutral-600 w-[110px] xl:w-[130px] text-center">
                  {item.submenus.map((sub, subIndex) => (
                    <Link 
                      key={subIndex} 
                      to={sub.path}
                      className="cursor-pointer hover:text-black transition-all duration-200"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. 모바일 전용 드롭다운/아코디언 메뉴 영역 */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 bg-white max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col space-y-4 px-2">
              {menuItems.map((item, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <Link 
                    to={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-black px-2 py-1 bg-neutral-50 rounded"
                  >
                    {item.title}
                  </Link>
                  <div className="pl-4 flex flex-col space-y-2">
                    {item.submenus.map((sub, subIndex) => (
                      <Link 
                        key={subIndex} 
                        to={sub.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm font-medium text-neutral-600 hover:text-black py-1"
                      >
                        - {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}