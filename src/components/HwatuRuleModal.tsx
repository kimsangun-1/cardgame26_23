'use client';

import React, { useEffect, useRef } from 'react';
import { X, BookOpen, CheckCircle2, HelpCircle, Layers, Award, Sparkles } from 'lucide-react';
import { MONTH_DATA, HwatuCard } from '../lib/hwatu/data';
import { CardIllustration } from './CardIllustration';

interface HwatuRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HwatuRuleModal: React.FC<HwatuRuleModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Esc 키 닫기 및 포커스 관리
  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 3월 예시 카드 2장 (정답 예시용)
  const sampleCard3A: HwatuCard = {
    id: 'sample-3-1',
    month: 3,
    monthName: '3월',
    symbolName: '벚꽃',
    cardIndex: 1,
    title: '벚꽃 장막',
    svgType: 'm3_c1',
  };
  const sampleCard3B: HwatuCard = {
    id: 'sample-3-2',
    month: 3,
    monthName: '3월',
    symbolName: '벚꽃',
    cardIndex: 2,
    title: '홍단',
    svgType: 'm3_c2',
  };
  // 8월 예시 카드 (오답 예시용)
  const sampleCard8: HwatuCard = {
    id: 'sample-8-1',
    month: 8,
    monthName: '8월',
    symbolName: '공산과 달',
    cardIndex: 1,
    title: '공산 보름달',
    svgType: 'm8_c1',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rule-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-3xl bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 border border-amber-500/40 rounded-2xl shadow-2xl text-stone-100 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/20 bg-emerald-950/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-400/20 border border-amber-400/40 rounded-xl text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="rule-modal-title" className="text-lg sm:text-xl font-bold text-amber-100">
                화투패 짝 맞추기 룰집 (규칙 안내)
              </h2>
              <p className="text-xs text-emerald-300/80">
                누구나 쉽게 즐기는 전통 카드 기억력 게임
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/60 transition cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 (스크롤) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-stone-200 leading-relaxed">
          {/* 알림 안내문구 */}
          <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-3.5 text-xs text-amber-200/90 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              이 게임은 고스톱이나 포커가 아니며, 점수 계산이나 베팅 없이 같은 월을 찾는 순수 기억력 짝 맞추기 게임입니다. 카드 일러스트는 한국 전통 화투에서 영감을 받아 자체 제작된 학습용 벡터 디자인입니다.
            </p>
          </div>

          {/* ① 어떤 게임인가요? */}
          <section className="bg-stone-900/60 rounded-xl p-4 border border-emerald-800/40">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2 mb-1.5">
              <span>① 어떤 게임인가요?</span>
            </h3>
            <p className="text-stone-300">
              뒤집힌 화투패 중 <strong className="text-amber-200">같은 월의 카드 두 장</strong>을 찾는 기억력 게임이에요. 48장을 모두 맞춰 총 24쌍을 완성하면 성공!
            </p>
          </section>

          {/* ② 어떻게 진행하나요? */}
          <section className="bg-stone-900/60 rounded-xl p-4 border border-emerald-800/40">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2 mb-1.5">
              <span>② 어떻게 진행하나요?</span>
            </h3>
            <p className="text-stone-300">
              카드 한 장을 눌러 확인하고, 다른 한 장을 골라보세요. 같은 월이면 정답! 다른 월이면 잠시 후(약 1초 뒤) 두 장 모두 다시 뒤집혀요.
            </p>
          </section>

          {/* ③ 무엇이 같아야 하나요? & 시각적 예시 */}
          <section className="bg-stone-900/60 rounded-xl p-4 border border-emerald-800/40 space-y-3">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2">
              <span>③ 무엇이 같아야 하나요?</span>
            </h3>
            <p className="text-stone-300">
              그림이 완전히 같을 필요는 없어요. <strong className="text-white underline decoration-amber-400">두 카드에 표시된 &apos;월(Month)&apos;이 같으면 짝</strong>이에요.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* 정답 예시 */}
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3 text-center">
                <span className="text-xs font-bold text-emerald-400 block mb-2">
                  ✅ 정답 예시 (같은 3월, 서로 다른 그림)
                </span>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-14 aspect-[2/3] rounded border border-amber-900 bg-white overflow-hidden shadow">
                    <CardIllustration card={sampleCard3A} />
                  </div>
                  <span className="text-lg font-bold text-emerald-400">+</span>
                  <div className="w-14 aspect-[2/3] rounded border border-amber-900 bg-white overflow-hidden shadow">
                    <CardIllustration card={sampleCard3B} />
                  </div>
                </div>
                <p className="text-xs text-emerald-200">3월 카드 + 다른 그림의 3월 카드 → <strong>짝 성공!</strong></p>
              </div>

              {/* 오답 예시 */}
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3 text-center">
                <span className="text-xs font-bold text-rose-400 block mb-2">
                  ❌ 오답 예시 (서로 다른 월)
                </span>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-14 aspect-[2/3] rounded border border-amber-900 bg-white overflow-hidden shadow">
                    <CardIllustration card={sampleCard3A} />
                  </div>
                  <span className="text-lg font-bold text-rose-400">+</span>
                  <div className="w-14 aspect-[2/3] rounded border border-amber-900 bg-white overflow-hidden shadow">
                    <CardIllustration card={sampleCard8} />
                  </div>
                </div>
                <p className="text-xs text-rose-200">3월 카드 + 8월 카드 → <strong>다시 뒤집힘</strong></p>
              </div>
            </div>
          </section>

          {/* ④ 같은 월이 4장인데 어떻게 맞추나요? */}
          <section className="bg-stone-900/60 rounded-xl p-4 border border-emerald-800/40">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2 mb-1.5">
              <span>④ 같은 월이 4장인데 어떻게 맞추나요?</span>
            </h3>
            <p className="text-stone-300">
              각 월에는 카드가 4장씩 있어요. 그중 어떤 두 장을 골라도 같은 월이면 짝으로 인정해요. 한 월마다 두 쌍, 전체 24쌍을 맞추면 완료예요. (광·띠·피의 구분은 매칭에 영향을 주지 않습니다)
            </p>
          </section>

          {/* ⑤ 월별 카드 한눈에 보기 */}
          <section className="space-y-3">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>⑤ 월별 카드 한눈에 보기 (1월 ~ 12월)</span>
            </h3>
            <p className="text-xs text-stone-300">
              게임에 실제로 사용되는 12개 월의 대표 상징과 미리보기입니다:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {MONTH_DATA.map((info) => {
                const previewCard: HwatuCard = {
                  id: `preview-${info.month}`,
                  month: info.month,
                  monthName: info.monthName,
                  symbolName: info.symbol,
                  cardIndex: 1,
                  title: `${info.monthName} 대표패`,
                  svgType: `m${info.month}_c1`,
                };
                return (
                  <div
                    key={info.month}
                    className="bg-stone-950/70 border border-stone-800 rounded-xl p-2.5 flex items-center space-x-2.5 shadow-sm"
                  >
                    <div className="w-10 aspect-[2/3] shrink-0 rounded border border-stone-700 bg-white overflow-hidden shadow-sm">
                      <CardIllustration card={previewCard} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1">
                        <span className="font-extrabold text-amber-400 text-xs">{info.monthName}</span>
                      </div>
                      <span className="font-semibold text-stone-200 text-xs block truncate">{info.symbol}</span>
                      <span className="text-[10px] text-stone-400 truncate block">{info.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ⑥ 기록은 어떻게 측정하나요? */}
          <section className="bg-stone-900/60 rounded-xl p-4 border border-emerald-800/40">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2 mb-1.5">
              <span>⑥ 기록은 어떻게 측정하나요?</span>
            </h3>
            <p className="text-stone-300">
              게임 시작부터 마지막 짝을 맞출 때까지 시간을 측정해요. <strong className="text-amber-200">룰집을 보는 시간도 포함돼요.</strong> 카드 두 장을 확인할 때마다 시도 횟수가 1회 올라가요.
            </p>
          </section>

          {/* ⑦ 처음부터 다시 하고 싶다면? */}
          <section className="bg-stone-900/60 rounded-xl p-4 border border-emerald-800/40">
            <h3 className="font-bold text-base text-amber-300 flex items-center space-x-2 mb-1.5">
              <span>⑦ 처음부터 다시 하고 싶다면?</span>
            </h3>
            <p className="text-stone-300">
              &apos;처음으로&apos;를 누르면 닉네임 입력 화면으로 돌아가요. 진행 중인 기록은 초기화돼요. 현재 닉네임으로 패만 다시 섞어 도전하고 싶다면 &apos;다시 도전&apos;을 눌러보세요!
            </p>
          </section>
        </div>

        {/* 모달 푸터 */}
        <div className="p-4 border-t border-amber-500/20 bg-emerald-950/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition shadow cursor-pointer text-sm"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
