import React, { useState, useEffect } from 'react';

export default function Step6_FeedTyranno({ onNext, totalScore = 0 }) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'countdown', 'playing', 'result'
  const [countdown, setCountdown] = useState(3); // 3초 카운트다운
  const [timeLeft, setTimeLeft] = useState(60); // 1분 (60초)
  const [missionScore, setMissionScore] = useState(0);
  const [foodQueue, setFoodQueue] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);

  // 먹이 종류 정의
  const foodTypes = [
    { name: '바나나', icon: '🍌' },
    { name: '고기', icon: '🥩' },
    { name: '물', icon: '💧' },
    { name: '물고기', icon: '🐟' },
    { name: '사과', icon: '🍎' },
  ];

  const getRandomFood = () => {
    const randomIndex = Math.floor(Math.random() * foodTypes.length);
    return foodTypes[randomIndex];
  };

  // 1단계: 시작 버튼 누르면 바로 게임으로 안 가고 카운트다운(준비) 단계로 진입
  const handleReadyToStart = () => {
    const initialQueue = Array.from({ length: 5 }, () => getRandomFood());
    setFoodQueue(initialQueue);
    setMissionScore(0);
    setAlertMessage(null);
    setCountdown(3);
    setGameState('countdown');
  };

  // 3초 카운트다운 효과
  useEffect(() => {
    let timer = null;
    if (gameState === 'countdown' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (gameState === 'countdown' && countdown === 0) {
      setTimeLeft(60);
      setGameState('playing'); // 카운트다운 끝나면 본격 게임 시작!
    }
    return () => clearTimeout(timer);
  }, [gameState, countdown]);

  // 1분(60초) 게임 타이머
  useEffect(() => {
    let timer = null;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('result');
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  // 유저가 먹이 버튼을 눌렀을 때 처리
  const handleFeedClick = (selectedFoodName) => {
    if (gameState !== 'playing' || foodQueue.length === 0) return;

    const currentTargetFood = foodQueue[0]; // 제일 왼쪽에 있는 먹이

    if (selectedFoodName === currentTargetFood.name) {
      setMissionScore((prev) => prev + 2);
      setFoodQueue((prevQueue) => [...prevQueue.slice(1), getRandomFood()]);

      setAlertMessage({ text: '냠냠! +2점! 🦖✨', type: 'success' });
      setTimeout(() => setAlertMessage(null), 500);
    } else {
      setMissionScore((prev) => Math.max(0, prev - 1));
      
      setAlertMessage({ text: '크앙! 잘못된 먹이에요! (-1점) 💥', type: 'error' });
      setTimeout(() => setAlertMessage(null), 600);
    }
  };

  return (
    /* 최상위 컨테이너: h-[620px] 고정 크기 및 앤틱 일지 스타일 적용 */
    <div className="relative max-w-sm h-[620px] mx-auto my-4 p-3 bg-[#f4e4bc] text-[#3e2723] rounded-lg shadow-2xl border-4 border-[#8c673d] overflow-hidden select-none flex flex-col">
      
      {/* 바깥 노란선(골드 라인) 테두리 */}
      <div className="border-2 border-[#b89355] p-3 rounded relative shadow-inner flex-1 flex flex-col min-h-0">
        
        {/* 모서리 고전 장식 포인트 */}
        <div className="absolute top-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute top-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>

        {/* 내부 콘텐츠 영역 */}
        <div className="border border-[#bdae93] p-3 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          
          {/* 상단 타이틀 영역 */}
          <div className="w-full border-b border-dashed border-[#bdae93] pb-2">
            <h2 className="text-lg font-black text-[#2a1a11] text-center tracking-tight">
              🥩 미션 3: 티라노 먹이 주기
            </h2>
          </div>

          {/* 중앙 가변 영역 (상태별 컨텐츠) */}
          <div className="flex-1 flex flex-col justify-center my-1">
            
            {/* 1. 시작 전 안내 화면 (ready) */}
            {gameState === 'ready' && (
              <div className="w-full bg-[#f8f1e1] p-4 rounded-xl border border-[#decfae] space-y-3 text-center">
                <div className="text-5xl mb-1">🦖🍖</div>
                <h3 className="text-xl font-black text-[#2a1a11]">배고픈 티라노 먹이 주기!</h3>
                
                <div className="text-left bg-[#fcf8ed] p-3 rounded-xl border border-[#e4d5b1] space-y-1.5 text-xs sm:text-sm text-[#5d4037]">
                  <p className="font-black text-[#8c673d] text-sm">📌 미션 규칙 (제한시간 1분)</p>
                  <p className="font-bold">• 티라노 입 앞(맨 왼쪽)에 보이는 먹이를 순서대로 눌러주세요!</p>
                  <p className="font-bold">• <strong className="text-[#d84315]">맞았을 때:</strong> +2점 획득! 🌟</p>
                  <p className="font-bold">• <strong className="text-[#d84315]">틀렸을 때:</strong> -1점 차감! 💥</p>
                </div>

                <button
                  type="button"
                  onClick={handleReadyToStart}
                  className="w-full py-3.5 bg-[#2a1a11] text-[#f4e4bc] font-black rounded-xl active:bg-[#3e2723] transition text-base shadow-md tracking-widest mt-1"
                >
                  먹이 주기 게임 시작! 🚀
                </button>
              </div>
            )}

            {/* 2. 3초 카운트다운 화면 (countdown) */}
            {gameState === 'countdown' && (
              <div className="w-full bg-[#f8f1e1] p-6 rounded-xl border border-[#decfae] space-y-3 text-center flex flex-col items-center justify-center h-48">
                <p className="text-sm text-[#8c673d] font-bold">티라노가 기다리고 있어요!</p>
                <div className="text-6xl font-black text-[#d84315] animate-bounce">
                  {countdown > 0 ? countdown : '시작! 🦖'}
                </div>
              </div>
            )}

            {/* 3. 게임 진행 화면 (playing) */}
            {gameState === 'playing' && (
              <div className="flex-1 flex flex-col justify-between py-0.5 space-y-2">
                
                {/* 🏆 점수 영역 */}
                <div className="flex justify-center items-center">
                  <span className="bg-[#e4d5b1] text-[#2a1a11] font-extrabold px-4 py-1 rounded-xl border-2 border-[#8c673d] text-sm shadow-xs">
                    🏆 점수 : <span className="text-[#d84315] text-base font-black">{missionScore}</span>점
                  </span>
                </div>

                {/* 중앙 플레이 박스 (먹이 및 버튼) */}
                <div className="space-y-2 relative bg-[#f8f1e1] p-2.5 rounded-xl border border-[#decfae] shadow-sm">
                  
                  {/* 커스텀 오버레이 알림창 */}
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

                  {/* 컨베이어 벨트 먹이 라인 및 티라노 */}
                  <div className="bg-[#fcf8ed] p-2 rounded-xl border-2 border-[#bdae93] flex items-center justify-between space-x-2 overflow-hidden shadow-inner">
                    <div className="text-3xl animate-pulse flex-shrink-0 border-r-2 border-[#bdae93] pr-2 transform scale-x-[-1]">
                      🦖
                    </div>

                    <div className="flex space-x-1 flex-1 justify-around">
                      {foodQueue.map((food, idx) => (
                        <div
                          key={idx}
                          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all ${
                            idx === 0
                              ? 'bg-[#e4d5b1] border-2 border-[#8c673d] scale-105 shadow-md'
                              : 'bg-[#f8f1e1] border border-[#c9bba0] opacity-60'
                          }`}
                        >
                          <span className="text-lg">{food.icon}</span>
                          {idx === 0 && (
                            <span className="text-[8px] font-black text-[#8c673d]">NOW</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 🌟 먹이 선택 버튼 영역: 상단 3개 + 하단 2개 큼직한 2줄 배치 */}
                  <div className="space-y-1.5 pt-1">
                    {/* 상단 3개 버튼 (바나나, 고기, 물) */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {foodTypes.slice(0, 3).map((food) => (
                        <button
                          key={food.name}
                          type="button"
                          onClick={() => handleFeedClick(food.name)}
                          className="py-2.5 bg-[#fcf8ed] hover:bg-[#f0e6d2] active:bg-[#2a1a11] active:text-[#f4e4bc] text-[#3e2723] font-black rounded-xl transition shadow-sm flex flex-col items-center justify-center border-2 border-[#bdae93] active:scale-95"
                        >
                          <span className="text-3xl mb-0.5">{food.icon}</span>
                          <span className="text-xs sm:text-sm">{food.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* 하단 2개 버튼 (물고기, 사과) */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {foodTypes.slice(3, 5).map((food) => (
                        <button
                          key={food.name}
                          type="button"
                          onClick={() => handleFeedClick(food.name)}
                          className="py-2.5 bg-[#fcf8ed] hover:bg-[#f0e6d2] active:bg-[#2a1a11] active:text-[#f4e4bc] text-[#3e2723] font-black rounded-xl transition shadow-sm flex flex-col items-center justify-center border-2 border-[#bdae93] active:scale-95"
                        >
                          <span className="text-3xl mb-0.5">{food.icon}</span>
                          <span className="text-xs sm:text-sm">{food.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ⏱️ 남은 시간 영역 */}
                <div className="flex justify-center items-center">
                  <span className="bg-[#d84315]/15 text-[#d84315] font-extrabold px-5 py-1 rounded-xl border-2 border-[#d84315]/40 text-xs sm:text-sm shadow-xs">
                    ⏱️ 남은 시간 : <span className="text-base sm:text-lg font-black">{timeLeft}</span>초
                  </span>
                </div>

              </div>
            )}

            {/* 4. 게임 완료 및 최종 결과 화면 (result) */}
            {gameState === 'result' && (
              <div className="w-full bg-[#f8f1e1] p-5 rounded-xl border border-[#decfae] space-y-4 text-center">
                <div className="text-5xl mb-1">🎉🏆</div>
                <h3 className="text-xl font-black text-[#2a1a11]">모든 미션 완수!</h3>
                <p className="text-xs sm:text-sm text-[#5d4037] font-bold">
                  티라노가 배부르게 먹이를 먹었어요! 수고했어요 탐험가님!
                </p>

                {/* 점수 정산 박스 */}
                <div className="bg-[#fcf8ed] p-3.5 rounded-xl border border-[#bdae93] space-y-2 text-left text-xs sm:text-sm font-bold shadow-inner">
                  <div className="flex justify-between text-[#5d4037]">
                    <span>이전 미션 누적 점수:</span>
                    <strong className="text-[#2a1a11] text-sm">{totalScore}점</strong>
                  </div>
                  <div className="flex justify-between text-[#5d4037]">
                    <span>미션 3 (먹이 주기):</span>
                    <strong className="text-[#d84315] text-sm">+{missionScore}점</strong>
                  </div>
                  <div className="border-t border-[#bdae93] pt-2 flex justify-between text-sm sm:text-base font-black text-[#2a1a11]">
                    <span>생일 탐험 최종 총점:</span>
                    <span className="text-lg text-[#d84315]">{totalScore + missionScore}점</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 하단 고정 영역 (결과 화면의 버튼들) */}
          <div className="w-full pt-1">
            {gameState === 'result' && (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={onNext}
                  className="w-full py-3.5 bg-[#2a1a11] text-[#f4e4bc] font-black rounded-xl active:bg-[#3e2723] transition text-sm sm:text-base shadow-md tracking-widest"
                >
                  생일 축하 수료증 발급받기! 🎫
                </button>
                <button
                  type="button"
                  onClick={handleReadyToStart}
                  className="w-full py-2.5 bg-[#a1887f] text-[#3e2723] font-bold rounded-xl active:bg-[#8d6e63] transition text-xs sm:text-sm shadow-xs"
                >
                  🔄 먹이 주기 다시 도전하기
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}