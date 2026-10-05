// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { supabase } from '../back/supabaseClient';

export default function AdminLogin({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('로그인 실패: ' + error.message);
      setLoading(false);
    } else {
      setLoading(false);
      onLoginSuccess(data.user);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-none shadow-xl relative">
        <h2 className="text-xl font-bold mb-6 text-neutral-900 text-center">관리자 로그인</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">이메일</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-full border border-neutral-300 p-3 text-sm focus:outline-none focus:border-neutral-900"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">비밀번호</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full border border-neutral-300 p-3 text-sm focus:outline-none focus:border-neutral-900"
              placeholder="••••••••"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-neutral-900 text-white py-3 text-sm font-medium hover:bg-black transition"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}