'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw } from 'lucide-react';

interface WinModalProps {
  nickname: string;
  completionTime: string;
  onRestart: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  nickname,
  completionTime,
  onRestart,
}) => {
  useEffect(() => {
    // 화려한 컨페티 효과
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-emerald-800 to-emerald-950 border border-amber-400/50 rounded-2xl p-6 sm:p-8 text-center shadow-2xl shadow-emerald-950/80 text-white relative">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-400/20 border border-amber-400 rounded-full flex items-center justify-center text-amber-400">
          <Trophy className="w-9 h-9" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mb-2">
          게임 완료!
        </h2>
        <p className="text-emerald-200 text-sm mb-6">축하합니다! 모든 카드를 완성했습니다.</p>

        <div className="bg-emerald-900/80 rounded-xl p-4 border border-emerald-600/50 space-y-2 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-emerald-300">플레이어</span>
            <span className="font-bold text-white text-base">{nickname}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-emerald-300">완료 시간</span>
            <span className="font-mono font-bold text-amber-300 text-base">{completionTime}</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 px-4 rounded-xl font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>처음으로</span>
        </button>
      </div>
    </div>
  );
};
