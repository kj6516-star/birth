import React from 'react';

export default function ParticleBackground() {
  const particles = Array.from({ length: 55 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050811]">
      <style>{`
        @keyframes fallSnow {
          0% {
            transform: translateY(0px) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes nebulaPulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.15);
          }
        }
      `}</style>

      {/* 1. 선명하고 몽환적인 은하수(네뷸라) 오로라 빛 */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-purple-700/40 via-indigo-600/30 to-blue-500/20 rounded-full blur-[90px]"
        style={{ animation: 'nebulaPulse 7s ease-in-out infinite' }}
      ></div>
      <div 
        className="absolute top-2/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-br from-cyan-600/25 via-blue-800/30 to-purple-900/30 rounded-full blur-[100px]"
        style={{ animation: 'nebulaPulse 9s ease-in-out infinite reverse' }}
      ></div>

      {/* 2. 반짝이는 별 파티클 */}
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 1; // 1px ~ 4px 크기
        const left = Math.random() * 100; // 가로 위치 (%)
        const duration = Math.random() * 5 + 3; // 떨어지는 속도
        const delay = Math.random() * 5; 
        const opacity = Math.random() * 0.8 + 0.2;

        return (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `-10px`,
              opacity: opacity,
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)', // 별빛 번짐 강화
              animation: `fallSnow ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}