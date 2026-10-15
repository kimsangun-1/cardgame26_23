'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Clock, User, RefreshCw, BookOpen, CheckCircle, Target } from 'lucide-react';
import { HwatuCard, createHwatuDeck, shuffleHwatuDeck } from '../lib/hwatu/data';
import { formatTime } from '../lib/solitaire/timer';
import { sendGameResultToGoogleSheet } from '../lib/googleSheets';
import { HwatuCardView } from './HwatuCardView';
import { HwatuRuleModal } from './HwatuRuleModal';
import { HwatuWinModal } from './HwatuWinModal';

interface HwatuGameBoardProps {
  nickname: string;
  onResetToHome: () => void;
}

export const HwatuGameBoard: React.FC<HwatuGameBoardProps> = ({
  nickname,
  onResetToHome,
}) => {
  // 48장의 셔플된 카드
  const [deck, setDeck] = useState<HwatuCard[]>(() => shuffleHwatuDeck(createHwatuDeck()));

  // 현재 선택되어 앞면이 노출된 카드의 ID 목록 (최대 2장)
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // 이미 맞춘 카드의 ID 집합
  const [matchedCardIds, setMatchedCardIds] = useState<Set<string>>(new Set());

  // 시도 횟수
  const [attempts, setAttempts] = useState<number>(0);

  // 뒤집기 대기 중이거나 처리 중일 때 추가 클릭 차단 플래그
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 승리 상태 및 완료 시간
  const [isWon, setIsWon] = useState<boolean>(false);
  const [completionTime, setCompletionTime] = useState<string>('00:00');

  // 룰 모달 오픈 상태
  const [isRuleOpen, setIsRuleOpen] = useState<boolean>(false);

  // 시간 측정 (Date.now() 차이 기반)
  const startTimeRef = useRef<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // 오답 카드 원상복귀 타이머 참조 (게임 리셋 시 클리어용)
  const flipBackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 게임 시작 시 타이머 초기화 및 구동
  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsedSeconds(0);

    const interval = setInterval(() => {
      if (!isWon) {
        const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isWon]);

  // 언마운트 시 지연 타이머 정리
  useEffect(() => {
    return () => {
      if (flipBackTimeoutRef.current) {
        clearTimeout(flipBackTimeoutRef.current);
      }
    };
  }, []);

  // 카드 클릭 핸들러
  const handleCardClick = (card: HwatuCard) => {
    // 처리 중(애니메이션/판정 대기)이거나, 룰집이 열려있거나, 이미 맞춘 카드거나, 이미 선택된 카드인 경우 차단
    if (
      isProcessing ||
      isRuleOpen ||
      matchedCardIds.has(card.id) ||
      selectedCardIds.includes(card.id)
    ) {
      return;
    }

    // 1. 첫 번째 카드 선택
    if (selectedCardIds.length === 0) {
      setSelectedCardIds([card.id]);
      return;
    }

    // 2. 두 번째 카드 선택
    if (selectedCardIds.length === 1) {
      const firstCardId = selectedCardIds[0];
      const firstCard = deck.find((c) => c.id === firstCardId)!;

      // 두 장 선택 표시 및 추가 클릭 방지
      setSelectedCardIds([firstCardId, card.id]);
      setIsProcessing(true);

      // 시도 횟수 1 증가 (서로 다른 두 장을 선택하여 판정이 발생할 때마다)
      setAttempts((prev) => prev + 1);

      // 같은 월 판정
      if (firstCard.month === card.month) {
        // [정답]: 같은 월인 경우
        const newMatched = new Set(matchedCardIds);
        newMatched.add(firstCardId);
        newMatched.add(card.id);
        setMatchedCardIds(newMatched);
        setSelectedCardIds([]);
        setIsProcessing(false);

        // 12쌍(24장) 모두 맞춘 경우 승리 판정
        if (newMatched.size === 24) {
          const totalSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const finalTime = formatTime(totalSeconds);
          setCompletionTime(finalTime);
          setIsWon(true);

          // 구글 시트로 완성 기록 전송
          sendGameResultToGoogleSheet({
            name: nickname,
            score: `${attempts + 1}회 (완성 12/12쌍)`,
            finishtime: finalTime,
          });
        }
      } else {
        // [오답]: 다른 월인 경우 -> 약 1초 동안 보여준 뒤 둘 다 다시 뒤집음
        flipBackTimeoutRef.current = setTimeout(() => {
          setSelectedCardIds([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  // 중간 진행 상황을 구글 시트에 기록하는 헬퍼 함수
  const recordCurrentProgress = () => {
    // 플레이어가 시도를 1회 이상 했거나 1쌍 이상 맞춘 경우에만 기록
    if (attempts > 0 || matchedCardIds.size > 0) {
      const currentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const currentTimeStr = formatTime(currentSeconds);
      const currentPairs = Math.floor(matchedCardIds.size / 2);
      
      sendGameResultToGoogleSheet({
        name: nickname,
        score: `${attempts}회 (${currentPairs}/12쌍 달성)`,
        finishtime: currentTimeStr,
      });
    }
  };

  // '다시 도전' (현재 닉네임 유지, 덱 새로 셔플, 상태 초기화)
  const handleRetry = useCallback(() => {
    if (!isWon) {
      recordCurrentProgress();
    }
    if (flipBackTimeoutRef.current) {
      clearTimeout(flipBackTimeoutRef.current);
    }
    setDeck(shuffleHwatuDeck(createHwatuDeck()));
    setSelectedCardIds([]);
    setMatchedCardIds(new Set());
    setAttempts(0);
    setIsProcessing(false);
    setIsWon(false);
    startTimeRef.current = Date.now();
    setElapsedSeconds(0);
  }, [attempts, matchedCardIds, isWon]);

  // '처음으로' 클릭 시 미완성 상태도 기록 후 타이머 정리 및 홈으로 이동
  const handleReset = () => {
    if (!isWon) {
      recordCurrentProgress();
    }
    if (flipBackTimeoutRef.current) {
      clearTimeout(flipBackTimeoutRef.current);
    }
    onResetToHome();
  };

  const matchedPairsCount = Math.floor(matchedCardIds.size / 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 text-white flex flex-col select-none">
      {/* 상단 헤더 (닉네임, 시간, 맞춘 짝 수, 시도 횟수, 주요 버튼) */}
      <header className="bg-stone-950/90 border-b border-amber-600/30 px-3 sm:px-6 py-3 shadow-lg sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          {/* 정보 지표 영역 */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            {/* 플레이어 닉네임 */}
            <div className="flex items-center space-x-1.5 bg-stone-900/90 px-3 py-1.5 rounded-lg border border-amber-500/30 shadow-sm">
              <User className="w-4 h-4 text-amber-400" />
              <span className="text-stone-400 font-medium">플레이어:</span>
              <span className="font-bold text-white tracking-wide">{nickname}</span>
            </div>

            {/* 경과 시간 */}
            <div className="flex items-center space-x-1.5 bg-stone-900/90 px-3 py-1.5 rounded-lg border border-amber-500/30 shadow-sm">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-stone-400 font-medium">시간:</span>
              <span className="font-mono font-bold text-emerald-300">
                {formatTime(elapsedSeconds)}
              </span>
            </div>

            {/* 맞춘 짝 수 */}
            <div className="flex items-center space-x-1.5 bg-stone-900/90 px-3 py-1.5 rounded-lg border border-amber-500/30 shadow-sm">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span className="text-stone-400 font-medium">맞춘 짝:</span>
              <span className="font-mono font-bold text-amber-300">
                {matchedPairsCount} / 12
              </span>
            </div>

            {/* 시도 횟수 */}
            <div className="flex items-center space-x-1.5 bg-stone-900/90 px-3 py-1.5 rounded-lg border border-amber-500/30 shadow-sm">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-stone-400 font-medium">시도:</span>
              <span className="font-mono font-bold text-cyan-300">{attempts}회</span>
            </div>
          </div>

          {/* 우측 버튼 영역 */}
          <div className="flex items-center space-x-2">
            {/* 룰집 버튼 */}
            <button
              onClick={() => setIsRuleOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 active:scale-95 text-xs sm:text-sm font-semibold transition border border-amber-500/40 flex items-center space-x-1.5 cursor-pointer text-amber-300"
              title="게임 규칙 보기"
            >
              <BookOpen className="w-4 h-4" />
              <span>룰집</span>
            </button>

            {/* 다시 도전 (동일 닉네임 새 판) */}
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-xs sm:text-sm font-semibold transition border border-emerald-600/60 flex items-center space-x-1.5 cursor-pointer text-emerald-200"
              title="카드를 새로 섞고 다시 시작"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>다시 도전</span>
            </button>

            {/* 처음으로 (홈으로 복귀) */}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 text-xs sm:text-sm font-bold transition shadow flex items-center space-x-1.5 cursor-pointer"
              title="닉네임 입력 화면으로 복귀"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>처음으로</span>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 게임 보드 (24장 화투패 그리드 - 12쌍) */}
      <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-5xl w-full mx-auto flex flex-col justify-center">
        {/* 그리드 반응형: PC 6열x4행, 모바일 4열x6행 또는 3열x8행 */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4">
          {deck.map((card) => {
            const isFlipped = selectedCardIds.includes(card.id);
            const isMatched = matchedCardIds.has(card.id);

            return (
              <div key={card.id} className="w-full">
                <HwatuCardView
                  card={card}
                  isFlipped={isFlipped}
                  isMatched={isMatched}
                  disabled={isProcessing || isRuleOpen}
                  onClick={() => handleCardClick(card)}
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* 룰집 모달 */}
      <HwatuRuleModal isOpen={isRuleOpen} onClose={() => setIsRuleOpen(false)} />

      {/* 게임 완료 축하 모달 */}
      {isWon && (
        <HwatuWinModal
          nickname={nickname}
          completionTime={completionTime}
          attempts={attempts}
          onRetry={handleRetry}
          onResetToHome={handleReset}
        />
      )}
    </div>
  );
};
