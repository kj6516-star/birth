import React, { useState, useEffect } from 'react';

export default function Step5_CardMatch({ onNext, totalScore = 0 }) {
  const [gameState, setGameState] = useState('ready'); // 'ready' (시작 전), 'playing' (진행 중), 'result' (결과 화면)
  const [pairsCount, setPairsCount] = useState(4); // 4쌍(8장), 8쌍(16장), 10쌍(20장)
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  
  const [missionScore, setMissionScore] = useState(0); // 미션 2에서 얻은 점수
  const [alertMessage, setAlertMessage] = useState(null); // 커스텀 알림창 상태

  // 공룡 이모지 풀 (총 10쌍까지 가능)
  const dinoEmojis = ['🦖', '🦕', '🐉', '🐲', '🦴', '🌋', '🥚', '🌿', '💧', '⚡'];

  const initGame = (count) => {
    const selected = dinoEmojis.slice(0, count);
    const deck = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ id, emoji }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMissionScore(0);
    setAlertMessage(null);
  };

  // 게임 시작 또는 재도전 시 세팅
  const handleStartGame = (count) => {
    setPairsCount(count);
    initGame(count);
    setGameState('playing');
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    // 2장의 카드를 뒤집었을 때 판정
    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      
      if (cards[firstId].emoji === cards[secondId].emoji) {
        // 🟢 쌍을 찾았을 때 (+10점)
        const newMatched = [...matched, firstId, secondId];
        setMatched(newMatched);
        setFlipped([]);
        setMissionScore((prev) => prev + 10);
        
        // 커스텀 알림창 띄우기
        setAlertMessage({ text: '✨ 딩동댕! 공룡알 짝을 찾았어요! (+10점)', type: 'success' });
        setTimeout(() => setAlertMessage(null), 1200);

        // 모든 카드를 다 찾았을 경우
        if (newMatched.length === cards.length) {
          setTimeout(() => {
            setGameState('result');
          }, 1500);
        }
      } else {
        // 🔴 쌍을 틀렸을 때 (-2점, 최저 0점 방지)
        setMissionScore((prev) => Math.max(0, prev - 2));
        
        // 커스텀 알림창 띄우기
        setAlertMessage({ text: '💦 아쉬워요! 다른 공룡알을 찾아보세요 (-2점)', type: 'error' });

        setTimeout(() => {
          setFlipped([]);
          setAlertMessage(null);
        }, 900);
      }
    }
  };

  return (
    /* 최상위 컨테이너: h-[620px] 고정 크기 유지 및 앤틱 스타일 적용 */
    <div className="relative max-w-sm h-[620px] mx-auto my-4 p-3 bg-[#f4e4bc] text-[#3e2723] rounded-lg shadow-2xl border-4 border-[#8c673d] overflow-hidden select-none flex flex-col">
      
      {/* 바깥 노란선(골드 라인) 테두리 */}
      <div className="border-2 border-[#b89355] p-3 rounded relative shadow-inner flex-1 flex flex-col min-h-0">
        
        {/* 모서리 고전 장식 포인트 */}
        <div className="absolute top-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute top-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>

        {/* 내부 콘텐츠 영역 (스크롤로 큰 글씨와 카드 레이아웃 수용) */}
        <div className="border border-[#bdae93] p-3 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          
          {/* 📌 상단 타이틀 영역: 가로 폭 유연성 확보를 위한 2열 구조 */}
          <div className="w-full border-b border-dashed border-[#bdae93] pb-2 space-y-1">
            <h2 className="text-lg font-black text-[#2a1a11] text-center tracking-tight">
              🥚 미션 2: 공룡알 짝 맞추기
            </h2>
            
            {gameState === 'playing' && (
              <div className="flex justify-between items-center bg-[#e4d5b1] px-3 py-1 rounded-lg border border-[#c9bba0]">
                <span className="text-xs font-bold text-[#5d4037]">
                  난이도: <strong className="text-[#2a1a11]">{pairsCount}쌍 ({pairsCount * 2}장)</strong>
                </span>
                <span className="text-xs font-black text-[#d84315] bg-[#fcf8ed] px-2 py-0.5 rounded shadow-xs">
                  🏆 점수: {missionScore}점
                </span>
              </div>
            )}
          </div>

          {/* 중앙 가변 영역 (상태별 컨텐츠) */}
          <div className="flex-1 flex flex-col justify-center my-2">
            
            {/* 1. 게임 시작 전 안내 화면 (ready) */}
            {gameState === 'ready' && (
              <div className="w-full bg-[#f8f1e1] p-4 rounded-xl border border-[#decfae] space-y-3 text-center">
                <div className="text-5xl mb-1">🥚🔍</div>
                <h3 className="text-xl font-black text-[#2a1a11]">공룡알 짝 맞추기</h3>
                
                <div className="text-left bg-[#fcf8ed] p-3 rounded-xl border border-[#e4d5b1] space-y-1.5 text-xs sm:text-sm text-[#5d4037]">
                  <p className="font-black text-[#8c673d] text-sm">📌 게임 규칙</p>
                  <p className="font-bold">• 카드를 뒤집어 똑같은 공룡알 이모지 짝을 찾아보세요!</p>
                  <p className="font-bold">• <strong className="text-[#d84315]">짝을 맞추면:</strong> +10점 🌟</p>
                  <p className="font-bold">• <strong className="text-[#d84315]">짝을 틀리면:</strong> -2점 💦</p>
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-xs sm:text-sm font-black text-[#5d4037]">난이도를 선택하고 시작하세요!</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartGame(4)}
                      className="py-3 bg-[#fcf8ed] hover:bg-[#2a1a11] hover:text-[#f4e4bc] text-[#3e2723] font-black rounded-xl transition text-xs sm:text-sm shadow border border-[#bdae93] active:scale-95"
                    >
                      🐣 쉬움<br/><span className="text-[10px] opacity-80">(4쌍)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartGame(8)}
                      className="py-3 bg-[#fcf8ed] hover:bg-[#2a1a11] hover:text-[#f4e4bc] text-[#3e2723] font-black rounded-xl transition text-xs sm:text-sm shadow border border-[#bdae93] active:scale-95"
                    >
                      🦕 보통<br/><span className="text-[10px] opacity-80">(8쌍)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartGame(10)}
                      className="py-3 bg-[#fcf8ed] hover:bg-[#2a1a11] hover:text-[#f4e4bc] text-[#3e2723] font-black rounded-xl transition text-xs sm:text-sm shadow border border-[#bdae93] active:scale-95"
                    >
                      🦖 어려움<br/><span className="text-[10px] opacity-80">(10쌍)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 게임 플레이 화면 (playing) */}
            {gameState === 'playing' && (
              <div className="space-y-2 relative">
                {/* 커스텀 알림창 오버레이 */}
                {alertMessage && (
                  <div className="absolute inset-x-0 -top-3 z-20 flex justify-center pointer-events-none">
                    <div className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black shadow-2xl border animate-bounce ${
                      alertMessage.type === 'success' 
                        ? 'bg-[#d4af37] text-[#1f110a] border-[#f5e5c0]' 
                        : 'bg-[#d84315] text-white border-red-300'
                    }`}>
                      {alertMessage.text}
                    </div>
                  </div>
                )}

                {/* 카드 그리드 영역 (쌍 개수에 맞춰 유연한 카드 높이 조정) */}
                <div className={`grid ${pairsCount === 4 ? 'grid-cols-4' : pairsCount === 8 ? 'grid-cols-4' : 'grid-cols-5'} gap-1.5 bg-[#f8f1e1] p-2.5 rounded-xl border border-[#decfae]`}>
                  {cards.map((card) => {
                    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`${
                          pairsCount === 4 ? 'h-14 text-2xl' : pairsCount === 8 ? 'h-11 text-xl' : 'h-10 text-lg'
                        } rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-90 ${
                          isFlipped
                            ? 'bg-[#e4d5b1] border-2 border-[#8c673d] scale-95'
                            : 'bg-[#fcf8ed] hover:bg-[#f0e6d2] border border-[#bdae93]'
                        }`}
                      >
                        {isFlipped ? card.emoji : '🥚'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. 게임 완료 및 결과 화면 (result) */}
            {gameState === 'result' && (
              <div className="w-full bg-[#f8f1e1] p-5 rounded-xl border border-[#decfae] space-y-4 text-center">
                <div className="text-5xl mb-1">🎉🏆</div>
                <h3 className="text-xl font-black text-[#2a1a11]">미션 2 완료!</h3>
                <p className="text-xs sm:text-sm text-[#5d4037] font-bold">
                  공룡알 짝 맞추기 성공! 멋지게 모든 짝을 찾았어요!
                </p>

                {/* 점수 정산 박스 */}
                <div className="bg-[#fcf8ed] p-3.5 rounded-xl border border-[#bdae93] space-y-2 text-left text-xs sm:text-sm font-bold shadow-inner">
                  <div className="flex justify-between text-[#5d4037]">
                    <span>미션 1 점수:</span>
                    <strong className="text-[#2a1a11] text-sm">{totalScore}점</strong>
                  </div>
                  <div className="flex justify-between text-[#5d4037]">
                    <span>미션 2 획득 점수:</span>
                    <strong className="text-[#d84315] text-sm">+{missionScore}점</strong>
                  </div>
                  <div className="border-t border-[#bdae93] pt-2 flex justify-between text-sm sm:text-base font-black text-[#2a1a11]">
                    <span>총 누적 점수:</span>
                    <span className="text-lg text-[#d84315]">{totalScore + missionScore}점</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 하단 고정 영역 (결과 화면 동작 버튼) */}
          <div className="w-full pt-1">
            {gameState === 'result' && (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={onNext}
                  className="w-full py-3.5 bg-[#2a1a11] text-[#f4e4bc] font-black rounded-xl active:bg-[#3e2723] transition text-sm sm:text-base shadow-md tracking-widest"
                >
                  다음 미션으로 넘어가기 ➔
                </button>
                <button
                  type="button"
                  onClick={() => setGameState('ready')}
                  className="w-full py-2.5 bg-[#a1887f] text-[#3e2723] font-bold rounded-xl active:bg-[#8d6e63] transition text-xs sm:text-sm shadow-xs"
                >
                  🔄 난이도 다시 골라서 재도전하기
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}