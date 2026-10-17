import React, { useState, useRef } from 'react';

export default function Step2_Profile({ formData, setFormData, onNext }) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('카메라 권한이 필요하거나 지원하지 않는 기기입니다.');
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 300;
      canvas.height = video.videoHeight || 300;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoUrl = canvas.toDataURL('image/png');
      setFormData((prev) => ({ ...prev, photo: photoUrl }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
  };

  return (
    /* 최상위 컨테이너 크기(max-w-sm)는 유지하면서 
       안쪽 종이 영역(bg-[#f4e4bc])을 황동선(border-2 border-[#b89355]) 위치까지 꽉 차도록 확장 */
    <div className="relative max-w-sm mx-auto my-4 p-3 bg-[#f4e4bc] text-[#3e2723] rounded-lg shadow-2xl border-4 border-[#8c673d] overflow-hidden select-none">
      
      {/* 단 하나의 바깥 노란선(골드 라인) 테두리 */}
      <div className="border-2 border-[#b89355] p-4 rounded relative shadow-inner">
        
        {/* 모서리 고전 장식 포인트 */}
        <div className="absolute top-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute top-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 left-1.5 text-xs text-[#a6987d]">◆</div>
        <div className="absolute bottom-1.5 right-1.5 text-xs text-[#a6987d]">◆</div>

        <div className="border border-[#bdae93] p-4 flex flex-col items-center space-y-4">
          
          {/* 제목: 깃펜 스타일 제목 */}
          <h2 className="text-xl font-bold text-[#2a1a11] text-center border-b border-dashed border-[#bdae93] pb-2 tracking-tight w-full">
            📜 공룡 탐험가 등록
          </h2>

          {/* 1. 상단: 사진 영역 (낡은 사진첩 스타일) */}
          <div className="w-full flex flex-col items-center justify-center space-y-2 bg-[#e4d5b1] p-3 rounded border border-[#c9bba0] shadow-sm relative">
            <div className="w-24 h-24 rounded-sm overflow-hidden border-2 border-white bg-[#fcf8ed] flex items-center justify-center shadow-md relative transform -rotate-1">
              {formData.photo ? (
                <img src={formData.photo} alt="탐험가 프로필" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#bdae93]">
                  <span className="text-4xl opacity-60">👤</span>
                  <span className="text-[9px] text-[#8c7e65] mt-1 font-medium">사진 등록</span>
                </div>
              )}
            </div>

            {/* 사진 삭제 / 직접 찍기 / 앨범 버튼 */}
            {formData.photo ? (
              <button
                type="button"
                onClick={removePhoto}
                className="text-[11px] bg-[#f44336]/10 text-[#c62828] hover:bg-[#f44336]/20 px-3 py-1 rounded border border-[#ef5350]/50 transition font-semibold"
              >
                ✕ 사진 삭제 및 재촬영
              </button>
            ) : (
              <div className="flex space-x-2 w-full pt-1">
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-2 bg-[#5d4037] hover:bg-[#4e342e] rounded text-xs font-bold text-[#fce4ec] flex items-center justify-center space-x-1 shadow transition"
                >
                  <span>📷</span>
                  <span>직접 촬영</span>
                </button>
                <label className="flex-1 py-2 bg-[#a1887f] hover:bg-[#8d6e63] rounded text-xs font-bold text-[#3e2723] flex items-center justify-center space-x-1 cursor-pointer shadow transition">
                  <span>📁</span>
                  <span>사진 선택</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* 2. 하단: 정보 입력란 */}
          <div className="w-full space-y-2.5 bg-[#f8f1e1] p-3 rounded border border-[#decfae]">
            {[
              { label: '이름 (Name)', name: 'name', value: formData.name },
              { label: '소속 (Kindergarten)', name: 'kindergarten', value: formData.kindergarten },
              { label: '코드네임 (Nickname)', name: 'nickname', value: formData.nickname },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-[13px] text-[#5d4037] font-bold tracking-tight pl-1">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  className="w-full mt-0.5 p-2 bg-transparent border-b border-[#bdae93] text-[#2a1a11] font-bold text-xs focus:outline-none focus:border-[#5d4037] transition-colors"
                  
                />
              </div>
            ))}
          </div>

          {/* 3. 카메라 모달창 */}
          {isCameraOpen && (
            <div className="fixed inset-0 bg-[#2a1a11]/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
              <div className="w-full max-w-xs bg-[#f4e4bc] border-4 border-[#5d4037] rounded-sm p-4 flex flex-col items-center space-y-3 shadow-2xl relative">
                <h3 className="text-sm font-bold text-[#3e2723]">📸 탐험가의 정면을 기록합니다</h3>
                <div className="w-full h-60 bg-black rounded overflow-hidden relative border-2 border-[#8d6e63] shadow-inner">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </div>
                <div className="flex space-x-2 w-full pt-1">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 py-2.5 bg-[#d84315] text-white font-bold rounded text-xs shadow hover:bg-[#bf360c] transition"
                  >
                    기록 완료 찰칵!
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 bg-[#a1887f] text-[#3e2723] rounded text-xs font-bold hover:bg-[#8d6e63] transition"
                  >
                    중단
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 다음 단계 버튼 */}
          <button
            type="button"
            onClick={onNext}
            className="w-full py-3 mt-1 bg-[#2a1a11] text-[#f4e4bc] font-bold rounded hover:bg-[#3e2723] transition shadow-md text-sm tracking-widest"
          >
            등록 완료
          </button>

        </div>
      </div>
    </div>
  );
}