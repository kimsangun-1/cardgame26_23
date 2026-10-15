'use client';

import React, { useState } from 'react';
import { Play, BookOpen, Sparkles } from 'lucide-react';
import { HwatuRuleModal } from './HwatuRuleModal';

interface HwatuStartScreenProps {
  onStart: (nickname: string) => void;
}

export const HwatuStartScreen: React.FC<HwatuStartScreenProps> = ({ onStart }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isRuleOpen, setIsRuleOpen] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('닉네임을 입력해주세요. 공백만으로는 시작할 수 없습니다.');
      return;
    }
    setError('');
    onStart(trimmed);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 text-white p-4">
      <div className="w-full max-w-md bg-stone-900/90 border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md text-center">
        {/* 상단 장식 및 뱃지 */}
        <div className="flex justify-center items-center space-x-2 mb-3">
          <span className="w-6 h-9 rounded bg-red-600 border border-red-900 shadow-sm flex items-center justify-center text-[10px] text-amber-200 font-bold">1월</span>
          <span className="w-6 h-9 rounded bg-red-600 border border-red-900 shadow-sm flex items-center justify-center text-[10px] text-amber-200 font-bold">3월</span>
          <span className="w-6 h-9 rounded bg-red-600 border border-red-900 shadow-sm flex items-center justify-center text-[10px] text-amber-200 font-bold">8월</span>
          <span className="w-6 h-9 rounded bg-red-600 border border-red-900 shadow-sm flex items-center justify-center text-[10px] text-amber-200 font-bold">11월</span>
        </div>

        {/* 정확한 제목 */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-amber-100">
          우리나라 전통 카드, 화투패 맞추기!!
        </h1>

        {/* 설명 문구 */}
        <p className="text-emerald-300 text-sm mb-6 font-medium">
          같은 월의 화투패 두 장을 찾아 12쌍(24장)을 모두 맞춰보세요!
        </p>

        {/* 닉네임 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="nickname-input" className="block text-sm font-semibold text-amber-200/90 mb-1">
              플레이어 닉네임
            </label>
            <input
              id="nickname-input"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (error) setError('');
              }}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-stone-950/80 border border-amber-600/50 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              autoFocus
            />
            {error && (
              <p className="text-rose-400 text-xs mt-1.5 pl-1 font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] shadow-lg shadow-amber-950/50 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span className="text-base">게임 시작</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRuleOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-amber-200 bg-stone-800/80 hover:bg-stone-800 active:scale-[0.98] border border-amber-500/40 transition flex items-center justify-center space-x-2 cursor-pointer text-sm"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>룰집 (게임 방법 보기)</span>
          </button>
        </form>

        {/* 하단 팁 */}
        <div className="mt-6 pt-5 border-t border-stone-800 text-xs text-stone-400 leading-relaxed text-left flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            그림이 완전히 같지 않아도 <strong className="text-amber-300">같은 월</strong>이면 정답으로 인정됩니다! 룰집에서 각 월별 상징을 미리 확인해 보세요.
          </span>
        </div>
      </div>

      {/* 룰 모달 */}
      <HwatuRuleModal isOpen={isRuleOpen} onClose={() => setIsRuleOpen(false)} />
    </div>
  );
};
