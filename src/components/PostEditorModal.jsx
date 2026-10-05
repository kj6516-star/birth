// src/components/PostEditorModal.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../back/supabaseClient';

export default function PostEditorModal({ postToEdit, onClose, onSaved }) {
  const [category, setCategory] = useState('NOTICE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setCategory(postToEdit.category);
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
    }
  }, [postToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (postToEdit) {
      // 수정
      const { error } = await supabase
        .from('posts')
        .update({ category, title, content })
        .eq('id', postToEdit.id);

      if (error) alert('수정 실패: ' + error.message);
      else {
        alert('수정되었습니다.');
        onSaved();
      }
    } else {
      // 신규 등록
      const { error } = await supabase
        .from('posts')
        .insert([{ category, title, content, author: '관리자', date: today }]);

      if (error) alert('등록 실패: ' + error.message);
      else {
        alert('등록되었습니다.');
        onSaved();
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-neutral-900">
          {postToEdit ? '게시글 수정' : '새 공지사항 작성'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">카테고리</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-neutral-300 p-3 text-sm focus:outline-none focus:border-neutral-900 bg-white"
            >
              <option value="NOTICE">NOTICE</option>
              <option value="NEWS">NEWS</option>
              <option value="EVENT">EVENT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">제목</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
              className="w-full border border-neutral-300 p-3 text-sm focus:outline-none focus:border-neutral-900"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">내용</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required
              rows={8}
              className="w-full border border-neutral-300 p-3 text-sm focus:outline-none focus:border-neutral-900"
              placeholder="내용을 입력하세요"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition"
            >
              취소
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-neutral-900 text-white px-6 py-3 text-sm font-medium hover:bg-black transition"
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}