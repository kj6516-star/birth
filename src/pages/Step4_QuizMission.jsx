import React, { useState, useEffect } from 'react';

// 🌟 이미지를 상단에서 직접 import 합니다
import tyrannoImg from '../images/05.Tyrannosaurus.jpg';
import triceraImg from '../images/01.triceratops.jpg';
import brachioImg from '../images/04.Brachiosaurus.jpg';
import stegoImg from '../images/02.stegosaurus.jpg';
import iguanaImg from '../images/03.Iguanodon.jpg';
import raptorImg from '../images/06.Velociraptor.jpg';
import spinoImg from '../images/07.Spinosaurus.jpg';
import giganoImg from '../images/10.Giganotosaurus.jpg';
import protoImg from '../images/08.Protoceratops.jpg';
import pteraImg from '../images/12.ftera.webp';
import mosaImg from '../images/11.mosa.webp';
import lamImg from '../images/09.Lambeosaurus.jpg';

export default function Step4_QuizMission({ onNext }) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'result'
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0); 
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  // 🔍 이미지를 확대해서 볼 모달 관련 상태
  const [selectedImage, setSelectedImage] = useState(null);

  // 원본 퀴즈 데이터
  const rawQuizzes = [
    {
      id: 1,
      imgSrc: tyrannoImg,
      answer: '티라노사우루스',
      aliases: ['티라노', '티라노사우르스', '티라노사우루스', '티라노사우르'],
      hints: [
        '💡 힌트 1: 육식을 좋아하는 무서운 공룡이에요!',
        '💡 힌트 2: 날카로운 이빨과 강력한 턱을 가졌어요.',
        '💡 힌트 3: 이름이 "티"로 시작해요!',
        '💡 힌트 4: 티ㄹㄴㅅㅇㄹㅅ',
      ],
    },
    {
      id: 2,
      imgSrc: triceraImg,
      answer: '트리케라톱스',
      aliases: ['트리케라', '트리케라톱스', '트리케라톱'],
      hints: [
        '💡 힌트 1: 풀과 나뭇잎을 좋아하는 초식공룡이에요.',
        '💡 힌트 2: 얼굴에 커다란 뿔이 있어요.',
        '💡 힌트 3: 이름이 "트"로 시작해요!',
        '💡 힌트 4: 트ㄹㅋㄹㅌㅅ',
      ],
    },
    {
      id: 3,
      imgSrc: brachioImg,
      answer: '브라키오사우루스',
      aliases: ['브라키오', '브라키오사우르스', '브라키오사우루스'],
      hints: [
        '💡 힌트 1: 키가 아주아주 큰 초식공룡이에요.',
        '💡 힌트 2: 높은 곳에 있는 나뭇잎도 잘 먹어요.',
        '💡 힌트 3: 이름이 "브"로 시작해요!',
        '💡 힌트 4: 브ㄹㅋㅇㅅㅇㄹㅅ',
      ],
    },
    {
      id: 4,
      imgSrc: stegoImg,
      answer: '스테고사우루스',
      aliases: ['스테고', '스테고사우르스', '스태고사우루스'],
      hints: [
        '💡 힌트 1: 몸집이 크고 초식을 하는 공룡이에요.',
        '💡 힌트 2: 등 위에 멋진 뼈 판들이 줄지어 있어요.',
        '💡 힌트 3: 이름이 "스"로 시작해요!',
        '💡 힌트 4: 스ㅌㄱㅅㅇㄹㅅ',
      ],
    },
    {
      id: 5,
      imgSrc: iguanaImg,
      answer: '이구아노돈',
      aliases: ['이구아노돈', '이그아노돈'],
      hints: [
        '💡 힌트 1: 나뭇잎을 잘 씹어먹는 초식공룡이에요.',
        '💡 힌트 2: 두 발로도 걷고 네 발로도 걸어요.',
        '💡 힌트 3: 이름이 "이"로 시작해요!',
        '💡 힌트 4: 이ㄱㅇㄴㄷ',
      ],
    },
    {
      id: 6,
      imgSrc: raptorImg,
      answer: '벨로시랩터',
      aliases: ['밸로시랩터', '벨로시렙터', '밸로시렙터', '랩터', '렙터'],
      hints: [
        '💡 힌트 1: 몸집은 작지만 아주 날렵하고 영리해요.',
        '💡 힌트 2: 무리를 지어서 사냥을 해요.',
        '💡 힌트 3: 이름이 "벨"로 시작해요!',
        '💡 힌트 4: 벨ㄹㅅㄹㅌ',
      ],
    },
    {
      id: 7,
      imgSrc: spinoImg,
      answer: '스피노사우루스',
      aliases: ['스피노', '스피노사우르스'],
      hints: [
        '💡 힌트 1: 물속을 헤엄치며 물고기를 잡아먹어요.',
        '💡 힌트 2: 티라노보다 몸길이가 더 길기도 해요.',
        '💡 힌트 3: 이름이 "스"로 시작해요!',
        '💡 힌트 4: 스ㅍㄴㅅㅇㄹㅅ',
      ],
    },
    {
      id: 8,
      imgSrc: giganoImg,
      answer: '기가노토사우루스',
      aliases: ['기가노토', '기가노토사우르스'],
      hints: [
        '💡 힌트 1: 아주 거대한 육식공룡이에요.',
        '💡 힌트 2: 커다란 몸집으로 남쪽 대륙을 누볐어요.',
        '💡 힌트 3: 이름이 "기"로 시작해요!',
        '💡 힌트 4: 기ㄱㄴㅌㅅㅇㄹㅅ',
      ],
    },
    {
      id: 9,
      imgSrc: protoImg,
      answer: '프로토케라톱스',
      aliases: ['프로토케라톱스', '프로토캐라톱스'],
      hints: [
        '💡 힌트 1: 몸집이 비교적 작고 귀여운 공룡이에요.',
        '💡 힌트 2: 머리 뒤쪽에 방패 같은 목 프릴이 있어요.',
        '💡 힌트 3: 이름이 "프"로 시작해요!',
        '💡 힌트 4: 프ㄹㅌㅋㅌㅅ',
      ],
    },
    {
      id: 10,
      imgSrc: pteraImg,
      answer: '프테라노돈',
      aliases: ['프테라노돈', '프태라노돈', '프테라', '프태라'],
      hints: [
        '💡 힌트 1: 땅 위가 아니라 하늘을 날아다녀요.',
        '💡 힌트 2: 커다란 날개로 바람을 타고 날아요.',
        '💡 힌트 3: 이름이 "프"로 시작해요!',
        '💡 힌트 4: 프ㅌㄹㄴㄷ',
      ],
    },
    {
      id: 11,
      imgSrc: mosaImg,
      answer: '모사사우루스',
      aliases: ['모사', '모사사우르스', '모사사우루스'],
      hints: [
        '💡 힌트 1: 바다에 사는 거대한 공룡이예요.',
        '💡 힌트 2: 커다란 입과 강력한 이빨을 가졌어요.',
        '💡 힌트 3: 이름이 "모"로 시작해요!',
        '💡 힌트 4: 모ㅅㅅㅇㄹㅅ',
      ],
    },
    {
      id: 12,
      imgSrc: lamImg,
      answer: '람베오사우루스',
      aliases: ['람베오사우루스', '람배오사우루스', '람배오', '람베오'],
      hints: [
        '💡 힌트 1: 온순하고 거대한 무리를 짓는 초식공룡이에요.',
        '💡 힌트 2: 독특한 도끼 모양의 머리 벼슬이 있어요',
        '💡 힌트 3: 이름이 "람"로 시작해요!',
        '💡 힌트 4: 람ㅂㅇㅅㅇㄹㅅ',
      ],
    },
  ];

  // Fisher-Yates 셔플 알고리즘
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setQuizzes(shuffleArray(rawQuizzes));
  }, []);

  if (quizzes.length === 0) return null;

  const qData = quizzes[currentIndex];
  const currentEarnedScore = Math.max(0, 10 - revealedHints * 2 - wrongAttempts * 1);

  const handleShowHint = () => {
    if (revealedHints < 4) {
      setRevealedHints((prev) => prev + 1);
    }
  };

  const handleNextStepOrQuiz = () => {
    setUserInput('');
    setFeedback('');
    setIsAnswered(false);
    setRevealedHints(0);
    setWrongAttempts(0);

    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameState('result');
    }
  };

  const handleSkipQuestion = () => {
    setFeedback('다음 문제로 넘어갑니다! ⏭️');
    setIsAnswered(true);

    setTimeout(() => {
      handleNextStepOrQuiz();
    }, 500);
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (isAnswered || !userInput.trim()) return;

    const cleanedInput = userInput.replace(/\s+/g, '');
    const isCorrect = qData.aliases.some((alias) =>
      cleanedInput.includes(alias.replace(/\s+/g, ''))
    );

    if (isCorrect) {
      const earned = currentEarnedScore;
      setScore((prev) => prev + earned);
      setIsAnswered(true);
      setFeedback(`정답입니다! 🦖✨ (+${earned}점 획득)`);

      setTimeout(() => {
        handleNextStepOrQuiz();
      }, 1500);
    } else {
      setWrongAttempts((prev) => prev + 1);
      setFeedback('아쉬워요! 틀려서 1점이 차감되었어요 (-1점) 😅');
      setUserInput('');
    }
  };

  return (
    /* 최상위 컨테이너: h-[620px] 고정 크기 유지 + 유연한 내부 스크롤 허용 */
    <div className="relative max-w-sm h-[620px] mx-auto my-4 p-3 bg-[#f4e4bc] text-[#3e2723] rounded-lg shadow-2xl border-4 border-[#8c673d] overflow-hidden select-none flex flex-col">
      
      {/* 바깥 노란선(골드 라인) 테두리 */}
      <div className="border-2 border-[#b89355] p-3 rounded relative shadow-inner flex-1 flex flex-col min-h-0">
        
        {/* 모서리 고전 장식 포인트 */}
        <div className="absolute top-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute top-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>

        {/* 내부 콘텐츠 영역 (스크롤을 통해 큰 글씨도 오버플로우 없이 수용) */}
        <div className="border border-[#bdae93] p-3 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          
          {/* 📌 상단 타이틀 영역: 가로 폭 좁음 문제 해결을 위한 2열 구조 */}
          <div className="w-full border-b border-dashed border-[#bdae93] pb-2 space-y-1">
            <h2 className="text-lg font-black text-[#2a1a11] text-center tracking-tight">
              🥩 미션 1: 공룡 주관식 퀴즈
            </h2>
            
            {gameState === 'playing' && (
              <div className="flex justify-between items-center bg-[#e4d5b1] px-3 py-1 rounded-lg border border-[#c9bba0]">
                <span className="text-xs font-bold text-[#5d4037]">
                  문제 <strong className="text-[#2a1a11] text-sm">{currentIndex + 1}</strong> / {quizzes.length}
                </span>
                <span className="text-xs font-black text-[#d84315] bg-[#fcf8ed] px-2 py-0.5 rounded shadow-xs">
                  🏆 현재 점수: {score}점
                </span>
              </div>
            )}
          </div>

          {/* 중앙 가변 영역 */}
          <div className="flex-1 flex flex-col justify-center my-2">
            
            {/* 1. 퀴즈 시작 전 안내 화면 */}
            {gameState === 'ready' && (
              <div className="w-full bg-[#f8f1e1] p-4 rounded-xl border border-[#decfae] space-y-3 text-center">
                <div className="text-5xl mb-1">🦖❓</div>
                <h3 className="text-xl font-black text-[#2a1a11]">공룡 박사 도전 미션!</h3>
                <p className="text-sm text-[#5d4037] leading-relaxed font-bold px-1 text-left bg-[#fcf8ed] p-3 rounded-lg border border-[#e4d5b1]">
                  공룡 사진을 보고 이름을 맞춰보세요!<br />
                  • 문제 당 기본 점수: <strong className="text-[#d84315]">10점</strong><br />
                  • 힌트 사용 시: <strong className="text-[#d84315]">-2점</strong><br />
                  • 오답 작성 시: <strong className="text-[#d84315]">-1점</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setGameState('playing')}
                  className="w-full py-3.5 bg-[#2a1a11] text-[#f4e4bc] font-black rounded-xl hover:bg-[#3e2723] transition text-base shadow-md tracking-widest mt-1"
                >
                  미션 시작하기! 🚀
                </button>
              </div>
            )}

            {/* 2. 퀴즈 진행 중 화면 */}
            {gameState === 'playing' && (
              <div className="w-full space-y-2.5">
                {/* 🔍 공룡 사진 영역 */}
                <div 
                  onClick={() => setSelectedImage(qData.imgSrc)}
                  className="w-full h-36 bg-[#fcf8ed] rounded-xl border-2 border-[#bdae93] overflow-hidden flex items-center justify-center relative shadow-inner cursor-pointer group"
                >
                  <img
                    src={qData.imgSrc}
                    alt="공룡 퀴즈 사진"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* 🔍 확대 안내 뱃지 */}
                  <span className="absolute bottom-2 right-2 bg-[#2a1a11]/85 text-[#f4e4bc] text-xs px-2.5 py-1 rounded-full backdrop-blur-xs group-hover:bg-[#d84315] transition-colors flex items-center space-x-1 font-bold shadow-md">
                    <span>🔍</span>
                    <span>터치하여 크게 보기</span>
                  </span>
                </div>

                {/* 힌트 및 점수 현황 영역 */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-sm font-bold text-[#5d4037]">
                    <span>
                      맞히면: <strong className="text-[#d84315] text-base">{currentEarnedScore}점</strong>
                      {wrongAttempts > 0 && (
                        <span className="text-red-600 text-xs ml-1.5">(오답 {wrongAttempts}회)</span>
                      )}
                    </span>
                    {revealedHints < 4 && (
                      <button
                        type="button"
                        onClick={handleShowHint}
                        className="text-xs bg-[#e4d5b1] text-[#5d4037] active:bg-[#d7c49e] border border-[#c9bba0] px-3 py-1.5 rounded-lg font-bold transition shadow-xs"
                      >
                        🔍 힌트 보기 (-2점)
                      </button>
                    )}
                  </div>

                  {/* 사용자가 연 힌트 출력 */}
                  {revealedHints > 0 && (
                    <div className="space-y-1 bg-[#f8f1e1] p-2.5 rounded-lg border border-[#decfae]">
                      {qData.hints.slice(0, revealedHints).map((hintText, idx) => (
                        <p key={idx} className="text-xs text-[#8c673d] font-bold">
                          {hintText}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* 주관식 정답 입력 폼 */}
                <form onSubmit={handleSubmitAnswer} className="space-y-2 pt-0.5">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="공룡 이름 입력"
                    disabled={isAnswered}
                    className="w-full p-3 bg-[#fcf8ed] border-2 border-[#bdae93] rounded-xl text-[#2a1a11] font-black text-center text-base focus:outline-none focus:border-[#5d4037] shadow-inner"
                  />
                  
                  <div className="flex flex-col space-y-1.5">
                    <button
                      type="submit"
                      disabled={isAnswered}
                      className="w-full py-3 bg-[#2a1a11] text-[#f4e4bc] font-black rounded-xl active:bg-[#3e2723] transition text-sm shadow-md tracking-widest"
                    >
                      정답 제출하기! ✨
                    </button>
                    <button
                      type="button"
                      onClick={handleSkipQuestion}
                      disabled={isAnswered}
                      className="w-full py-2 bg-[#a1887f] text-[#3e2723] font-bold rounded-lg active:bg-[#8d6e63] transition text-sm shadow-xs"
                    >
                      다음 문제로 넘어가기 ➔
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. 퀴즈 완료 결과 화면 */}
            {gameState === 'result' && (
              <div className="w-full bg-[#f8f1e1] p-5 rounded-xl border border-[#decfae] space-y-4 text-center">
                <div className="text-5xl mb-1">🎉🏆</div>
                <h3 className="text-xl font-black text-[#2a1a11]">미션 1 완료!</h3>
                <p className="text-sm text-[#5d4037] font-bold leading-relaxed">
                  공룡 퀴즈를 모두 풀었어요!<br />
                  획득한 총 점수
                </p>
                <div className="bg-[#fcf8ed] p-4 rounded-xl border-2 border-[#bdae93] inline-block w-full shadow-inner">
                  <span className="text-4xl font-black text-[#d84315]">{score}점</span>
                </div>
              </div>
            )}

          </div>

          {/* 하단 고정 피드백 영역 */}
          <div className="w-full pt-1">
            {gameState === 'result' ? (
              <button
                type="button"
                onClick={onNext}
                className="w-full py-3.5 bg-[#2a1a11] text-[#f4e4bc] font-black rounded-xl active:bg-[#3e2723] transition text-base shadow-md tracking-widest"
              >
                다음 미션으로 넘어가기 ➔
              </button>
            ) : (
              <div className="h-6 flex items-center justify-center">
                {feedback && (
                  <span className="text-xs font-black text-[#d84315] animate-bounce">
                    {feedback}
                  </span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 🖼️ 이미지 확대 모달창 (팝업) */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="absolute inset-0 z-50 bg-[#2a1a11]/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#f4e4bc] p-4 rounded-2xl border-4 border-[#8c673d] shadow-2xl max-w-xs w-full flex flex-col items-center space-y-3 relative"
          >
            {/* 상단 닫기 버튼 */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-[#2a1a11] text-[#f4e4bc] font-black rounded-full border-2 border-[#8c673d] shadow flex items-center justify-center text-base hover:bg-[#3e2723] transition"
            >
              ✕
            </button>

            {/* 확대된 이미지 */}
            <div className="w-full h-64 bg-[#fcf8ed] rounded-xl border-2 border-[#bdae93] overflow-hidden flex items-center justify-center shadow-inner">
              <img
                src={selectedImage}
                alt="확대된 공룡 사진"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-[#8c673d] font-bold text-center">
              💡 화면 바깥을 누르거나 ✕ 버튼을 누르면 닫힙니다.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}