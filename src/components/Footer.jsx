import React, { useState, useEffect } from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { supabase } from '../back/supabaseClient'; // 본인의 Supabase 클라이언트 경로 확인
import AdminLogin from './AdminLogin';           // 이미 가지고 계신 관리자 로그인 컴포넌트

export default function Footer() {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 1. 현재 로그인 상태 확인 및 실시간 감지
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

  // 2. 관리자 버튼 클릭 핸들러 (로그인 상태면 로그아웃, 아니면 로그인 모달 열기)
  const handleAdminAction = async () => {
    if (user) {
      if (window.confirm('관리자 모드에서 로그아웃 하시겠습니까?')) {
        await supabase.auth.signOut();
        setUser(null);
        alert('로그아웃 되었습니다.');
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <footer className="w-full bg-white text-neutral-500 text-sm py-12 border-t border-neutral-200 select-none">
        <div className="w-full px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          
          {/* 왼쪽: 회사 정보 */}
          <div className="space-y-4">
            {/* 기업 정보 타이틀 */}
            <div className="font-bold text-black tracking-wider text-base">
              COMPANY INFORMATION
            </div>

            {/* 상세 정보 */}
            <div className="space-y-1.5 leading-relaxed text-neutral-600">
              <p>
                상호명 : ㈜TK Company (티케이컴퍼니) <span className="mx-2 text-neutral-300">|</span> 
                브랜드 : TK MANAGEMENT (티케이 매니지먼트)
              </p>
              <p>
                대표이사 : 조태경 <span className="mx-2 text-neutral-300">|</span> 
                개인정보보호책임자 : 조태경 <span className="mx-2 text-neutral-300">|</span> 
                사업자등록번호 : 291-88-03353
              </p>
              <p>
                대중문화예술기획업 등록번호 : 제2025-서울강남-0418호(등록대기중)
              </p>
              <p>
                주소 : 서울특별시 마포구 마포나루길 442 마포인트 3층
              </p>
              <p>
                대표전화 : 02-540-8820(등록대기중) <span className="mx-2 text-neutral-300">|</span> 
                팩스 : 02-540-8821(등록대기중)
              </p>
            </div>
          </div>

          {/* 오른쪽: 위에는 소셜 아이콘, 아래에는 약관 및 저작권 영역 */}
          <div className="flex flex-col items-start md:items-end gap-4">
            
            {/* 1. TKM OFFICIAL 및 소셜 아이콘 영역 (위쪽) */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-black text-base">TKM OFFICIAL</span>
              <div className="flex gap-2">
                {/* 인스타그램 (인스타 고유 그라데이션 배경 적용) */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf] text-white rounded-lg flex items-center justify-center hover:opacity-80 transition shadow-sm"
                >
                  <FaInstagram size={17} />
                </a>

                {/* X (구 트위터 - 검은 배경에 흰색 로고) */}
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:opacity-80 transition shadow-sm"
                >
                  <FaXTwitter size={15} />
                </a>

                {/* 유튜브 (선명한 레드 배경) */}
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 bg-[#ff0000] text-white rounded-lg flex items-center justify-center hover:opacity-80 transition shadow-sm"
                >
                  <FaYoutube size={17} />
                </a>
              </div>
            </div>

            {/* 2. 약관 및 저작권 영역 (아래쪽) */}
            <div className="space-y-2 text-left md:text-right">
              <div className="flex flex-wrap gap-4 font-semibold text-neutral-800">
                <span className="cursor-pointer hover:underline">개인정보처리방침</span>
                <span className="cursor-pointer hover:underline">영상정보처리기기 운영·관리 방침</span>
              </div>
              
              {/* 저작권 문구 + 조그마한 관리자 로그인 트리거 */}
              <div className="flex items-center justify-start md:justify-end gap-3">
                <p className="text-neutral-400">
                  © TK Company. All Rights Reserved.
                </p>
                <button 
                  onClick={handleAdminAction}
                  className="text-[11px] text-neutral-300 hover:text-neutral-700 transition font-mono tracking-tighter"
                  title={user ? "로그아웃" : "관리자 로그인"}
                >
                  {user ? '[Admin Out]' : '[Admin]'}
                </button>
              </div>
            </div>

          </div>

        </div>
      </footer>

      {/* 3. 관리자 로그인 모달 창 (로그아웃 상태에서 [Admin]을 누를 때만 노출) */}
      {isLoginModalOpen && (
        <AdminLogin 
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setIsLoginModalOpen(false);
            alert('관리자로 로그인되었습니다.');
          }} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
    </>
  );
}