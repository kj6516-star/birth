import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import Greeting from './pages/Greeting';
import Info from './pages/Info';
import Write from './pages/Write';
import Contact from './pages/Contact';
import Actor from './pages/Actor';
import Entertaner from './pages/Entertaner';
import Notice3 from './pages/Notice3';
import Notice2 from './pages/Notice2';
import ParticleBackground from './components/ParticleBackground'; // [이동] 최상단으로 불러오기

// 메인 홈 화면 컴포넌트 (박스 제한 제거)
function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto relative w-full py-20 z-10">
      
      {/* 기존에 있던 배경 빛 효과 */}
      <div className="absolute w-72 h-72 bg-neutral-800 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>

      <span className="text-xs md:text-xl uppercase tracking-[0.3em] text-neutral-400 mb-4 font-light">
        TK MANAGEMENT
      </span>
      
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter uppercase mb-6 leading-tight">
        Beyond Limits, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-600">
          Create The Future
        </span>
      </h1>
      
      <p className="text-neutral-400 text-sm md:text-base max-w-xl mb-10 font-light leading-relaxed">
        새로운 가치를 창출하고 대중과 소통하는 차세대 엔터테인먼트 기업 TKM과 함께 빛날 인재를 기다립니다.
      </p>

      {/* 액션 버튼 그룹 */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
        <Link 
          to="/audition/info" 
          className="px-8 py-4 bg-white text-black text-xs md:text-base font-semibold tracking-widest uppercase rounded-none hover:bg-neutral-200 transition shadow-lg text-center"
        >
          Online Audition
        </Link>
        <Link 
          to="/contact" 
          className="px-8 py-4 border border-neutral-700 text-white text-xs md:text-base font-semibold tracking-widest uppercase rounded-none hover:bg-neutral-900 transition text-center"
        >
          Business Inquiry
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      {/* [수정] 전체 앱 배경을 은하수 톤(#050811)으로 맞추고 상대 좌표 지정 */}
      <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between selection:bg-neutral-700 relative overflow-hidden">
        
        {/* [추가] 화면 전체를 채우는 은하수 파티클 배경 */}
        <ParticleBackground />

        {/* 1. 상단 네비게이션 바 (z-10을 주어 별보다 위에 오도록 설정) */}
        <div className="relative z-10">
          <Header />
        </div>

        {/* 2. 주소에 따라 바뀌는 페이지 영역 */}
        <div className="relative z-10 flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/greeting" element={<Greeting />} />
            <Route path="/audition/info" element={<Info />} />
            <Route path="/audition/write" element={<Write />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/artists/actor" element={<Actor />} />
            <Route path="/artists/entertainer" element={<Entertaner />} />
            <Route path="/news/notice" element={<Notice3 />} />
            <Route path="/news/notice2" element={<Notice2 />} />
          </Routes>
        </div>

        {/* 3. 하단 푸터 영역 */}
        <div className="relative z-10">
          <Footer />
        </div>
        
      </div>
    </Router>
  );
}