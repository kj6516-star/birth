import React, { useState } from 'react';
import Step1_Welcome from './pages/Step1_Welcome';
import Step2_Profile from './pages/Step2_Profile';
import Step3_MissionGuide from './pages/Step3_MissionGuide';
import Step4_QuizMission from './pages/Step4_QuizMission';
import Step5_CardMatch from './pages/Step5_CardMatch';
import Step6_VolcanoBridge from './pages/Step6_VolcanoBridge';
import Step7_Birthday from './pages/Step7_Birthday';
import Step8_Certificate from './pages/Step8_Certificate';

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '안시환',
    kindergarten: '햇살마루 어린이집',
    nickname: '',
    photo: null,
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 8));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1_Welcome onNext={nextStep} />;
      case 2: return <Step2_Profile formData={formData} setFormData={setFormData} onNext={nextStep} />;
      case 3: return <Step3_MissionGuide formData={formData} onNext={nextStep} />;
      case 4: return <Step4_QuizMission onNext={nextStep} />;
      case 5: return <Step5_CardMatch onNext={nextStep} />;
      case 6: return <Step6_VolcanoBridge onNext={nextStep} />;
      case 7: return <Step7_Birthday formData={formData} onNext={nextStep} />;
      case 8: return <Step8_Certificate formData={formData} onRestart={() => setStep(1)} />;
      default: return <Step1_Welcome onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-stone-900 to-amber-950 flex flex-col items-center justify-center p-4">
      {/* 책 상단 진행 인디케이터 바 */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between px-2">
        {step > 1 && (
          <button onClick={prevStep} className="text-xs bg-stone-800 text-stone-300 px-3 py-1 rounded-full hover:bg-stone-700 transition">
            ◀ 이전 페이지
          </button>
        )}
        
      </div>

      {/* 메인 책장 컨테이너 */}
      <div className="w-full max-w-md bg-stone-900/90 border-4 border-amber-600/70 rounded-3xl shadow-2xl p-6 backdrop-blur-sm transition-all duration-300">
        {renderStep()}
      </div>
    </div>
  );
}