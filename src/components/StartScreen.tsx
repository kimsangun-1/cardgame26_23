'use client';

import React, { useState } from 'react';
import { Play, BookOpen } from 'lucide-react';
import { RuleModal } from './RuleModal';

interface StartScreenProps {
  onStart: (nickname: string) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-950 text-white p-4">
      <div className="w-full max-w-md bg-emerald-900/90 border border-emerald-600/40 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md text-center">
        {/* 상단 장식 카드 아이콘 */}
        <div className="flex justify-center space-x-2 text-2xl mb-4">
          <span className="text-red-400">♥</span>
          <span className="text-slate-200">♠</span>
          <span className="text-red-400">♦</span>
          <span className="text-slate-200">♣</span>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-emerald-100">
          전략적으로 퍼즐을 맞추는 카드 게임!
        </h1>
        <p className="text-emerald-300/80 text-sm mb-6">
          클론다이크 솔리테어 (Klondike Solitaire)
        </p>

        {/* 닉네임 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="nickname" className="block text-sm font-medium text-emerald-200 mb-1">
              플레이어 닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (error) setError('');
              }}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-white placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              autoFocus
            />
            {error && (
              <p className="text-rose-300 text-xs mt-2 pl-1 font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] shadow-lg shadow-amber-900/30 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span className="text-base">게임 시작</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRuleOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-emerald-200 bg-emerald-800/60 hover:bg-emerald-800 active:scale-[0.98] border border-emerald-600/50 transition flex items-center justify-center space-x-2 cursor-pointer text-sm"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>📖 게임 규칙 및 방법 (룰집)</span>
          </button>
        </form>

        {/* 룰 모달 */}
        <RuleModal isOpen={isRuleOpen} onClose={() => setIsRuleOpen(false)} />

        {/* 간단 안내 */}
        <div className="mt-6 pt-6 border-t border-emerald-700/50 text-xs text-emerald-300/70 leading-relaxed text-left">
          <p className="font-semibold text-emerald-200 mb-1">💡 게임 팁</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>카드를 드래그하거나 클릭 후 이동할 위치를 클릭하세요.</li>
            <li>빨강과 검정 색상을 번갈아 가며 내림차순으로 카드를 정렬하세요.</li>
            <li>우측 상단 기초 더미에 A부터 K까지 4개 무늬를 모두 모으면 승리합니다!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
