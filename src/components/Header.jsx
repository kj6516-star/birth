import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// 이미지를 사용하는 경로에 맞게 임포트 해주세요 (프로젝트 구조에 따라 경로 조정 필요)
import logoImage from '../assets/002.png'; 

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);

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
      {/* 전체를 감싸는 컨테이너 (좌우 패딩 통일) */}
      <div className="w-full px-12">
        
        {/* 1. 상단 메인 바 영역 */}
        <div className="h-20 flex items-center justify-between text-3xl">
          {/* 로고 (클릭 시 홈으로 이동) - 이미지로 대체 */}
          <Link to="/" className="cursor-pointer flex items-center shrink-0">
            <img 
              src={logoImage} 
              alt="TK MANAGEMENT Logo" 
              className="h-20 w-auto object-contain" // 헤더 높이에 맞게 크기 조절 (h-12는 약 48px)
            />MANAGEMENT
          </Link>

          {/* 대메뉴 목록 */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-14 text-2xl font-bold tracking-wider">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path} 
                className="cursor-pointer hover:text-neutral-500 transition py-2 w-[130px] text-center"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* 2. 마우스 올렸을 때 펼쳐지는 드롭다운 영역 */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-neutral-100 ${
            isHovered ? 'max-h-60 py-8 opacity-100' : 'max-h-0 py-0 opacity-0'
          }`}
        >
          <div className="hidden lg:flex justify-end">
            {/* 대메뉴와 정확히 같은 간격과 너비(`w-[130px]`)를 주어 1:1 수직 정렬 */}
            <div className="flex items-start gap-8 xl:gap-14">
              {menuItems.map((item, index) => (
                <div key={index} className="flex flex-col space-y-3 text-xl font-medium text-neutral-600 w-[130px] text-center">
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

      </div>
    </header>
  );
}