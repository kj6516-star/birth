import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json() // Supabase Webhook에서 넘어온 데이터

    // 성별 및 지원 분야 텍스트 변환
    const genderText = record.gender === 'female' ? '여성' : record.gender === 'male' ? '남성' : record.gender;
    const fieldText = record.field === 'actor' ? '배우' : record.field === 'entertainer' ? '엔터테이너' : record.field;

    // 이메일 HTML 본문 디자인
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
        <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">🚨 [신규 오디션 지원] 새로운 지원자가 접수되었습니다.</h2>
        
        <h3>👤 기본 인적사항</h3>
        <ul>
          <li><b>이름:</b> ${record.name}</li>
          <li><b>지원 분야:</b> ${fieldText}</li>
          <li><b>성별:</b> ${genderText}</li>
          <li><b>생년월일:</b> ${record.birth || '미입력'}</li>
          <li><b>연락처:</b> ${record.phone}</li>
          <li><b>이메일:</b> ${record.email}</li>
          <li><b>신체조건:</b> 키 ${record.height || '-'}cm / 몸무게 ${record.weight || '-'}kg</li>
        </ul>

        <h3>📝 상세 프로필</h3>
        <ul>
          <li><b>인스타그램:</b> ${record.instagram || '미입력'}</li>
          <li><b>유튜브/영상 링크:</b> ${record.videoLink || '미입력'}</li>
          <li><b>특기:</b> ${record.specialty || '미입력'}</li>
          <li><b>자기소개:</b> <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">${record.introduction || '미입력'}</p></li>
        </ul>

        <h3>📸 프로필 사진</h3>
        ${record.photoUrl ? `<p><a href="${record.photoUrl}" target="_blank"><img src="${record.photoUrl}" width="150" style="border-radius: 8px; border: 1px solid #ccc;" /></a></p><p><a href="${record.photoUrl}" target="_blank">이미지 원본 크게 보기</a></p>` : '<p>등록된 사진 없음</p>'}
      </div>
    `;

    // Resend API 호출하여 이메일 발송
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Audition System <onboarding@resend.dev>', 
        to: ['kj6516@gmail.com'], // 👈 여기에 실제 알림 받을 담당자 이메일 입력!
        subject: `[신규 지원] ${record.name} (${fieldText}) 지원서가 접수되었습니다.`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})