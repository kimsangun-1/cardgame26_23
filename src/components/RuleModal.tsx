'use client';

import React from 'react';
import { X, BookOpen, Layers, CheckCircle2, Shuffle, MousePointer } from 'lucide-react';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RuleModal: React.FC<RuleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 border border-emerald-500/50 rounded-2xl shadow-2xl text-white flex flex-col max-h-[90vh] overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-800/80 bg-emerald-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-400/20 border border-amber-400/40 rounded-xl text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-100 leading-tight">솔리테어 게임 규칙 & 가이드</h2>
              <p className="text-xs text-emerald-400/80">처음 플레이하시는 분들을 위한 친절한 설명서</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 (스크롤) */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-emerald-100/90 leading-relaxed">
          {/* 1. 게임의 목표 */}
          <section className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/40">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. 게임의 최종 목표</span>
            </h3>
            <p>
              우측 상단의 <strong className="text-white">4개 기초 더미(Foundation)</strong>에 
              각 무늬(♥, ♦, ♣, ♠)별로 <strong className="text-amber-300">A(1)부터 시작하여 K(13)까지 오름차순</strong>으로 
              52장의 모든 카드를 차례대로 모으면 승리합니다!
            </p>
          </section>

          {/* 2. 구역별 설명 */}
          <section className="space-y-3">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>2. 게임판 구역 구성</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-emerald-950/60 p-3.5 rounded-lg border border-emerald-800/50">
                <span className="font-semibold text-white block mb-1">📦 뽑기 더미 (Stock)</span>
                <p className="text-xs text-emerald-200/80">
                  클릭하면 카드를 1장씩 꺼내 옆의 공개 더미로 이동시킵니다. 카드가 떨어지면 빈자리를 눌러 다시 뒤집어 무제한 재사용할 수 있습니다.
                </p>
              </div>

              <div className="bg-emerald-950/60 p-3.5 rounded-lg border border-emerald-800/50">
                <span className="font-semibold text-white block mb-1">👀 공개 더미 (Waste)</span>
                <p className="text-xs text-emerald-200/80">
                  뽑힌 카드가 앞면으로 놓이는 곳입니다. 맨 위 카드를 테이블이나 기초 더미로 가져가 활용할 수 있습니다.
                </p>
              </div>

              <div className="bg-emerald-950/60 p-3.5 rounded-lg border border-emerald-800/50">
                <span className="font-semibold text-white block mb-1">🏛️ 기초 더미 (Foundations)</span>
                <p className="text-xs text-emerald-200/80">
                  우측 상단 4칸입니다. 각 무늬별로 반드시 <strong>A → 2 → 3 ... → K</strong> 순서대로만 쌓을 수 있습니다.
                </p>
              </div>

              <div className="bg-emerald-950/60 p-3.5 rounded-lg border border-emerald-800/50">
                <span className="font-semibold text-white block mb-1">🃏 7개의 카드 열 (Tableau)</span>
                <p className="text-xs text-emerald-200/80">
                  메인 플레이 공간입니다. 카드를 전략적으로 정리하고 뒤집힌 카드를 계속 오픈해야 합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 3. 카드 이동 핵심 규칙 */}
          <section className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/40 space-y-2">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2 mb-2">
              <Shuffle className="w-4 h-4" />
              <span>3. 카드 이동 핵심 규칙</span>
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-1">
              <li>
                <strong className="text-white">색상 교차 & 내림차순:</strong> 열에서는 <span className="text-red-400 font-bold">빨간색(♥,♦)</span>과 <span className="text-slate-200 font-bold">검은색(♠,♣)</span>이 번갈아 나와야 하며, 숫자는 <strong>하나씩 작아져야</strong> 합니다. (예: 검정 K 밑에 빨강 Q, 그 밑에 검정 J)
              </li>
              <li>
                <strong className="text-white">카드 묶음 이동:</strong> 올바른 순서로 연결된 앞면 카드들은 묶음째로 다른 열로 한 번에 옮길 수 있습니다.
              </li>
              <li>
                <strong className="text-white">빈 열 채우기:</strong> 열의 카드를 모두 치워 빈자리가 생기면, 오직 <strong className="text-amber-300">K(King)</strong> 또는 K로 시작하는 카드 묶음만 놓을 수 있습니다.
              </li>
              <li>
                <strong className="text-white">자동 앞면 공개:</strong> 열의 앞면 카드를 옮겨 뒷면 카드가 맨 위에 드러나면 자동으로 앞면으로 뒤집힙니다.
              </li>
            </ul>
          </section>

          {/* 4. 조작 팁 */}
          <section className="bg-emerald-950/60 rounded-xl p-4 border border-emerald-800/50 space-y-1.5">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2 mb-2">
              <MousePointer className="w-4 h-4" />
              <span>4. 편리한 조작 팁</span>
            </h3>
            <div className="text-xs sm:text-sm space-y-1 text-emerald-200/90">
              <p>👆 <strong>클릭 조작:</strong> 카드를 누른 후 이동할 열이나 기초 더미를 클릭하세요.</p>
              <p>🖱️ <strong>드래그 & 드롭:</strong> 카드를 직접 끌어다 놓아도 됩니다.</p>
              <p>⚡ <strong>더블 클릭 빠른 이동:</strong> 카드를 더블 클릭하면 기초 더미로 갈 수 있는 경우 자동으로 날아갑니다!</p>
            </div>
          </section>
        </div>

        {/* 모달 푸터 */}
        <div className="p-4 border-t border-emerald-800/80 bg-emerald-950/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 transition shadow cursor-pointer text-sm"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
