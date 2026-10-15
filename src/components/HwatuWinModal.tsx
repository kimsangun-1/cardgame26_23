'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, RefreshCw, Medal, Loader2 } from 'lucide-react';
import { Ranker, fetchTop3Rankings } from '../lib/googleSheets';

interface HwatuWinModalProps {
  nickname: string;
  completionTime: string;
  attempts: number;
  onRetry: () => void;
  onResetToHome: () => void;
}

export const HwatuWinModal: React.FC<HwatuWinModalProps> = ({
  nickname,
  completionTime,
  attempts,
  onRetry,
  onResetToHome,
}) => {
  const [rankers, setRankers] = useState<Ranker[]>([]);
  const [isLoadingRank, setIsLoadingRank] = useState<boolean>(true);

  useEffect(() => {
    // 화려한 컨페티 축하 효과
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // 구글 시트에 데이터가 기록되는 약간의 시간(약 1.5초) 후 최신 Top 3 랭킹 조회
    const timer = setTimeout(async () => {
      try {
        const top3 = await fetchTop3Rankings();
        setRankers(top3);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingRank(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 border border-amber-400/60 rounded-2xl p-5 sm:p-7 text-center shadow-2xl text-stone-100 max-h-[92vh] overflow-y-auto">
        <div className="w-14 h-14 mx-auto mb-3 bg-amber-400/20 border-2 border-amber-400 rounded-full flex items-center justify-center text-amber-400 animate-bounce">
          <Trophy className="w-7 h-7" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mb-1">
          모든 화투패를 맞췄어요!
        </h2>
        <p className="text-emerald-300/90 text-xs sm:text-sm mb-4">
          총 12쌍(24장)을 모두 성공적으로 완성했습니다.
        </p>

        {/* 내 플레이 결과 통계 박스 */}
        <div className="bg-stone-950/80 rounded-xl p-3.5 border border-amber-500/30 space-y-2 mb-4 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-stone-400">플레이어</span>
            <span className="font-bold text-white text-sm sm:text-base">{nickname}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-400">내 완료 시간</span>
            <span className="font-mono font-bold text-amber-300 text-sm sm:text-base">{completionTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-400">총 시도 횟수</span>
            <span className="font-mono font-bold text-emerald-300">{attempts}회</span>
          </div>
        </div>

        {/* 🏆 구글 시트 기반 명예의 전당 (Top 3 순위) */}
        <div className="bg-stone-950/90 rounded-xl p-3.5 border border-amber-400/50 mb-5 text-left">
          <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-amber-500/30">
            <span className="text-xs sm:text-sm font-bold text-amber-300 flex items-center space-x-1.5">
              <Medal className="w-4 h-4 text-amber-400" />
              <span>명예의 전당 (종료시간 TOP 3)</span>
            </span>
            <span className="text-[10px] text-stone-400">구글 시트 연동</span>
          </div>

          {isLoadingRank ? (
            <div className="py-4 flex flex-col items-center justify-center text-stone-400 text-xs space-y-1.5">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
              <span>실시간 순위 집계 중...</span>
            </div>
          ) : rankers.length > 0 ? (
            <div className="space-y-1.5">
              {rankers.map((item, index) => {
                const badgeColor =
                  index === 0
                    ? 'bg-amber-400 text-stone-950 font-extrabold'
                    : index === 1
                    ? 'bg-slate-300 text-stone-950 font-bold'
                    : 'bg-amber-700 text-white font-bold';
                
                const isCurrentPlayer = item.name === nickname && item.finishtime === completionTime;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition ${
                      isCurrentPlayer
                        ? 'bg-amber-500/20 border border-amber-400/60'
                        : 'bg-stone-900/60 border border-stone-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${badgeColor}`}>
                        {item.rank}
                      </span>
                      <span className="font-bold text-white truncate max-w-[110px] sm:max-w-[140px]">
                        {item.name}
                        {isCurrentPlayer && <span className="text-[10px] text-amber-300 ml-1">(나)</span>}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-amber-300">{item.finishtime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-3 text-xs text-stone-400">
              아직 등록된 랭킹 데이터가 없습니다.
            </p>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={onRetry}
            className="w-full py-3 px-4 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다시 도전</span>
          </button>

          <button
            onClick={onResetToHome}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-stone-300 bg-stone-800/80 hover:bg-stone-800 active:scale-[0.98] border border-stone-700 transition flex items-center justify-center space-x-2 cursor-pointer text-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4 text-stone-400" />
            <span>처음으로</span>
          </button>
        </div>
      </div>
    </div>
  );
};
