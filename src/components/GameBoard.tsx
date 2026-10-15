'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Clock, User, RefreshCw, BookOpen } from 'lucide-react';
import { Card, CardLocation, GameState, Suit } from '../lib/solitaire/types';
import {
  initializeGame,
  canMoveToFoundation,
  canMoveToTableau,
  isGameWon,
  autoFlipTableauTops,
  SUITS,
  getSuitSymbol,
} from '../lib/solitaire/rules';
import { formatTime } from '../lib/solitaire/timer';
import { CardView } from './CardView';
import { WinModal } from './WinModal';
import { RuleModal } from './RuleModal';

interface GameBoardProps {
  nickname: string;
  onResetToHome: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ nickname, onResetToHome }) => {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const [selectedLocation, setSelectedLocation] = useState<CardLocation | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [isRuleOpen, setIsRuleOpen] = useState(false);
  const [completionTime, setCompletionTime] = useState<string>('00:00');

  // 시간 측정 (시작 시각과 현재 시각의 차이로 계산하여 탭 전환 시에도 정확함)
  const startTimeRef = useRef<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // 타이머 루프
  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsedSeconds(0);

    const interval = setInterval(() => {
      if (!isWon) {
        const diffInSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(diffInSec);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isWon]);

  // 승리 조건 체크
  const checkWinCondition = useCallback((currentState: GameState) => {
    if (isGameWon(currentState.foundations)) {
      setIsWon(true);
      const totalSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setCompletionTime(formatTime(totalSeconds));
    }
  }, []);

  // 카드 뽑기 (Stock -> Waste)
  const handleStockClick = () => {
    setSelectedLocation(null);
    setGameState((prev) => {
      if (prev.stock.length > 0) {
        const newStock = [...prev.stock];
        const drawnCard = newStock.pop()!;
        drawnCard.isFaceUp = true;
        return {
          ...prev,
          stock: newStock,
          waste: [...prev.waste, drawnCard],
        };
      } else if (prev.waste.length > 0) {
        // 뽑기 더미 소진 시: waste를 뒤집어서 stock으로 다시 채움 (재셔플 없음, 맨 위 카드가 맨 아래로)
        const newStock = prev.waste
          .slice()
          .reverse()
          .map((c) => ({ ...c, isFaceUp: false }));
        return {
          ...prev,
          stock: newStock,
          waste: [],
        };
      }
      return prev;
    });
  };

  // 선택된 카드 가져오기 유틸
  const getSelectedCards = (
    loc: CardLocation,
    state: GameState
  ): { cards: Card[]; isMovable: boolean } | null => {
    if (loc.type === 'waste') {
      if (state.waste.length === 0) return null;
      return { cards: [state.waste[state.waste.length - 1]], isMovable: true };
    }
    if (loc.type === 'tableau' && loc.pileIndex !== undefined && loc.cardIndex !== undefined) {
      const col = state.tableau[loc.pileIndex];
      const card = col[loc.cardIndex];
      if (!card || !card.isFaceUp) return null;
      return { cards: col.slice(loc.cardIndex), isMovable: true };
    }
    if (loc.type === 'foundation' && loc.suit) {
      const pile = state.foundations[loc.suit];
      if (pile.length === 0) return null;
      return { cards: [pile[pile.length - 1]], isMovable: true };
    }
    return null;
  };

  // 이동 실행 함수
  const executeMove = (
    source: CardLocation,
    target: { type: 'tableau'; pileIndex: number } | { type: 'foundation'; suit: Suit }
  ): boolean => {
    let success = false;

    setGameState((prev) => {
      const sourceData = getSelectedCards(source, prev);
      if (!sourceData || !sourceData.isMovable) return prev;
      const { cards } = sourceData;
      const movingCard = cards[0];

      // 타겟이 Foundation인 경우 (카드 1장만 이동 가능)
      if (target.type === 'foundation') {
        if (cards.length !== 1) return prev;
        const targetPile = prev.foundations[target.suit];
        if (!canMoveToFoundation(movingCard, targetPile, target.suit)) return prev;

        // 이동 적용
        const newFoundations = {
          ...prev.foundations,
          [target.suit]: [...targetPile, movingCard],
        };

        let newWaste = prev.waste;
        let newTableau = prev.tableau;

        if (source.type === 'waste') {
          newWaste = prev.waste.slice(0, -1);
        } else if (source.type === 'tableau' && source.pileIndex !== undefined) {
          const colIndex = source.pileIndex;
          const newCol = prev.tableau[colIndex].slice(0, -1);
          newTableau = prev.tableau.map((col, idx) => (idx === colIndex ? newCol : col));
          newTableau = autoFlipTableauTops(newTableau);
        } else if (source.type === 'foundation' && source.suit) {
          if (source.suit === target.suit) return prev;
          newFoundations[source.suit] = prev.foundations[source.suit].slice(0, -1);
        }

        const nextState = {
          ...prev,
          foundations: newFoundations,
          waste: newWaste,
          tableau: newTableau,
        };

        success = true;
        checkWinCondition(nextState);
        return nextState;
      }

      // 타겟이 Tableau인 경우
      if (target.type === 'tableau') {
        const targetCol = prev.tableau[target.pileIndex];
        // 동일 열로의 이동 무시
        if (source.type === 'tableau' && source.pileIndex === target.pileIndex) {
          return prev;
        }

        if (!canMoveToTableau(movingCard, targetCol)) return prev;

        // 이동 적용
        let newWaste = prev.waste;
        let newFoundations = prev.foundations;
        let newTableau = [...prev.tableau];

        // 소스에서 제거
        if (source.type === 'waste') {
          newWaste = prev.waste.slice(0, -1);
        } else if (source.type === 'tableau' && source.pileIndex !== undefined) {
          const colIndex = source.pileIndex;
          newTableau[colIndex] = newTableau[colIndex].slice(0, source.cardIndex);
          newTableau = autoFlipTableauTops(newTableau);
        } else if (source.type === 'foundation' && source.suit) {
          newFoundations = {
            ...prev.foundations,
            [source.suit]: prev.foundations[source.suit].slice(0, -1),
          };
        }

        // 목적지 열에 추가
        newTableau[target.pileIndex] = [...newTableau[target.pileIndex], ...cards];

        success = true;
        return {
          ...prev,
          waste: newWaste,
          foundations: newFoundations,
          tableau: newTableau,
        };
      }

      return prev;
    });

    return success;
  };

  // 더블 클릭 시 Foundation으로 빠른 이동 자동 시도
  const handleQuickMoveToFoundation = (card: Card, source: CardLocation) => {
    for (const suit of SUITS) {
      if (canMoveToFoundation(card, gameState.foundations[suit], suit)) {
        executeMove(source, { type: 'foundation', suit });
        setSelectedLocation(null);
        return;
      }
    }
  };

  // 소스 카드 클릭 처리 (선택 또는 이동 실행)
  const handleCardClick = (loc: CardLocation, card?: Card) => {
    // 1. 이미 무언가 선택되어 있는 경우 -> 목적지로 이동 시도
    if (selectedLocation) {
      // 같은 카드를 다시 누르면 선택 해제
      if (
        selectedLocation.type === loc.type &&
        selectedLocation.pileIndex === loc.pileIndex &&
        selectedLocation.cardIndex === loc.cardIndex &&
        selectedLocation.suit === loc.suit
      ) {
        setSelectedLocation(null);
        return;
      }

      // 태블로 목적지
      if (loc.type === 'tableau' && loc.pileIndex !== undefined) {
        const moved = executeMove(selectedLocation, {
          type: 'tableau',
          pileIndex: loc.pileIndex,
        });
        if (moved) {
          setSelectedLocation(null);
          return;
        }
      }

      // 기초 더미 목적지
      if (loc.type === 'foundation' && loc.suit) {
        const moved = executeMove(selectedLocation, {
          type: 'foundation',
          suit: loc.suit,
        });
        if (moved) {
          setSelectedLocation(null);
          return;
        }
      }
    }

    // 2. 새 카드 선택
    if (card && card.isFaceUp) {
      setSelectedLocation(loc);
    } else {
      setSelectedLocation(null);
    }
  };

  // 빈 열 클릭 처리
  const handleEmptyTableauClick = (colIndex: number) => {
    if (selectedLocation) {
      const moved = executeMove(selectedLocation, {
        type: 'tableau',
        pileIndex: colIndex,
      });
      if (moved) {
        setSelectedLocation(null);
      }
    }
  };

  // 빈 Foundation 클릭 처리
  const handleEmptyFoundationClick = (suit: Suit) => {
    if (selectedLocation) {
      const moved = executeMove(selectedLocation, {
        type: 'foundation',
        suit,
      });
      if (moved) {
        setSelectedLocation(null);
      }
    }
  };

  // Drag and Drop 지원
  const handleDragStart = (e: React.DragEvent, loc: CardLocation) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(loc));
    setSelectedLocation(loc);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnTableau = (e: React.DragEvent, colIndex: number) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('text/plain');
      if (data) {
        const sourceLoc: CardLocation = JSON.parse(data);
        executeMove(sourceLoc, { type: 'tableau', pileIndex: colIndex });
        setSelectedLocation(null);
      }
    } catch {
      // 파싱 실패 무시
    }
  };

  const handleDropOnFoundation = (e: React.DragEvent, suit: Suit) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('text/plain');
      if (data) {
        const sourceLoc: CardLocation = JSON.parse(data);
        executeMove(sourceLoc, { type: 'foundation', suit });
        setSelectedLocation(null);
      }
    } catch {
      // 무시
    }
  };

  // 선택된 카드가 이동 가능한지 하이라이트 여부 판정
  const isTableauValidTarget = (colIndex: number): boolean => {
    if (!selectedLocation) return false;
    const sourceData = getSelectedCards(selectedLocation, gameState);
    if (!sourceData) return false;
    if (selectedLocation.type === 'tableau' && selectedLocation.pileIndex === colIndex) return false;
    return canMoveToTableau(sourceData.cards[0], gameState.tableau[colIndex]);
  };

  const isFoundationValidTarget = (suit: Suit): boolean => {
    if (!selectedLocation) return false;
    const sourceData = getSelectedCards(selectedLocation, gameState);
    if (!sourceData || sourceData.cards.length !== 1) return false;
    return canMoveToFoundation(sourceData.cards[0], gameState.foundations[suit], suit);
  };

  return (
    <div className="min-h-screen bg-emerald-900 text-white flex flex-col select-none">
      {/* 헤더 바 */}
      <header className="bg-emerald-950/80 border-b border-emerald-800/80 px-4 py-3 shadow-md flex items-center justify-between flex-wrap gap-2 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-emerald-900/90 px-3 py-1.5 rounded-lg border border-emerald-700/60 text-sm">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-medium">플레이어:</span>
            {/* 닉네임을 HTML이 아닌 안전한 텍스트로 출력 */}
            <span className="font-bold text-white tracking-wide">{nickname}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-emerald-900/90 px-3 py-1.5 rounded-lg border border-emerald-700/60 text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-emerald-300 font-medium">경과 시간:</span>
            <span className="font-mono font-bold text-amber-300 tracking-wider">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 게임 규칙 버튼 */}
          <button
            onClick={() => setIsRuleOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 active:scale-95 text-xs sm:text-sm font-semibold transition border border-emerald-600/60 flex items-center space-x-1 cursor-pointer text-emerald-200"
            title="게임 규칙 및 방법 확인"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">규칙집</span>
          </button>

          {/* 새 게임 (동일 닉네임) */}
          <button
            onClick={() => {
              setGameState(initializeGame());
              setSelectedLocation(null);
              setIsWon(false);
              startTimeRef.current = Date.now();
              setElapsedSeconds(0);
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-xs sm:text-sm font-semibold transition border border-emerald-600/60 flex items-center space-x-1 cursor-pointer"
            title="카드를 새로 섞고 새 게임 시작"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
            <span>새 게임</span>
          </button>

          {/* 처음으로 (닉네임 초기화 및 시작화면 복귀) */}
          <button
            onClick={onResetToHome}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs sm:text-sm font-bold transition shadow flex items-center space-x-1 cursor-pointer"
            title="닉네임 입력 화면으로 이동"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>처음으로</span>
          </button>
        </div>
      </header>

      {/* 룰 모달 */}
      <RuleModal isOpen={isRuleOpen} onClose={() => setIsRuleOpen(false)} />

      {/* 메인 게임 영역 (반응형 및 가로 스크롤 대응) */}
      <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-x-auto">
        <div className="min-w-[620px] max-w-5xl mx-auto flex flex-col space-y-6">
          {/* 상단 섹션: 뽑기 더미(Stock & Waste) & 기초 더미(Foundations) */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 md:gap-4 items-start">
            {/* 1열: Stock Pile */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-emerald-300/80 mb-1 font-medium">뽑기 더미</span>
              {gameState.stock.length > 0 ? (
                <div
                  onClick={handleStockClick}
                  className="cursor-pointer relative group transition active:scale-95"
                >
                  <CardView card={gameState.stock[gameState.stock.length - 1]} />
                  <span className="absolute -bottom-2 -right-1 bg-emerald-950/90 text-amber-300 text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded-full border border-emerald-600">
                    {gameState.stock.length}
                  </span>
                </div>
              ) : (
                <div
                  onClick={handleStockClick}
                  className="w-14 sm:w-20 md:w-24 h-20 sm:h-28 md:h-36 rounded-lg border-2 border-dashed border-emerald-600/50 bg-emerald-950/30 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400/70 transition p-1 text-center"
                >
                  <RefreshCw className="w-5 h-5 text-emerald-400/70 mb-1" />
                  <span className="text-[10px] text-emerald-300/70 leading-tight">다시 뒤집기</span>
                </div>
              )}
            </div>

            {/* 2열: Waste Pile */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-emerald-300/80 mb-1 font-medium">공개 더미</span>
              {gameState.waste.length > 0 ? (
                <div
                  onDoubleClick={() => {
                    const topWaste = gameState.waste[gameState.waste.length - 1];
                    handleQuickMoveToFoundation(topWaste, { type: 'waste' });
                  }}
                >
                  <CardView
                    card={gameState.waste[gameState.waste.length - 1]}
                    isSelected={selectedLocation?.type === 'waste'}
                    onClick={() =>
                      handleCardClick(
                        { type: 'waste' },
                        gameState.waste[gameState.waste.length - 1]
                      )
                    }
                    onDragStart={(e) => handleDragStart(e, { type: 'waste' })}
                  />
                </div>
              ) : (
                <div className="w-14 sm:w-20 md:w-24 h-20 sm:h-28 md:h-36 rounded-lg border-2 border-dashed border-emerald-700/40 bg-emerald-950/20 flex items-center justify-center">
                  <span className="text-emerald-600/40 text-xs">비어있음</span>
                </div>
              )}
            </div>

            {/* 3열: 구분 공간 */}
            <div className="flex items-center justify-center"></div>

            {/* 4~7열: Foundation Piles (무늬별 기초 더미) */}
            {SUITS.map((suit) => {
              const pile = gameState.foundations[suit];
              const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
              const isValidTarget = isFoundationValidTarget(suit);

              return (
                <div
                  key={suit}
                  className="flex flex-col items-center"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnFoundation(e, suit)}
                  onClick={() => {
                    if (!topCard) {
                      handleEmptyFoundationClick(suit);
                    }
                  }}
                >
                  <span className="text-[11px] text-emerald-300/80 mb-1 font-medium capitalize">
                    {suit === 'hearts' ? '하트' : suit === 'diamonds' ? '다이아' : suit === 'clubs' ? '클로버' : '스페이드'}
                  </span>
                  {topCard ? (
                    <CardView
                      card={topCard}
                      isSelected={
                        selectedLocation?.type === 'foundation' && selectedLocation?.suit === suit
                      }
                      isValidTarget={isValidTarget}
                      onClick={() =>
                        handleCardClick(
                          { type: 'foundation', suit },
                          topCard
                        )
                      }
                      onDragStart={(e) =>
                        handleDragStart(e, { type: 'foundation', suit })
                      }
                    />
                  ) : (
                    <div
                      className={`w-14 sm:w-20 md:w-24 h-20 sm:h-28 md:h-36 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
                        isValidTarget
                          ? 'border-amber-400 bg-amber-400/10 scale-105'
                          : 'border-emerald-700/50 bg-emerald-950/30 hover:border-emerald-500'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl md:text-3xl text-emerald-600/50">
                        {getSuitSymbol(suit)}
                      </span>
                      <span className="text-[10px] text-emerald-500/50 font-bold mt-1">A</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 하단 섹션: 7개 열 (Tableau) */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 md:gap-4 items-start pt-2">
            {gameState.tableau.map((column, colIndex) => {
              const isValidTarget = isTableauValidTarget(colIndex);

              return (
                <div
                  key={colIndex}
                  className="flex flex-col items-center min-h-[300px] sm:min-h-[420px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnTableau(e, colIndex)}
                  onClick={(e) => {
                    // 카드가 없는 빈 열 클릭 처리
                    if (column.length === 0) {
                      handleEmptyTableauClick(colIndex);
                    }
                  }}
                >
                  <span className="text-[11px] text-emerald-400/60 mb-1 font-mono">
                    {colIndex + 1}열
                  </span>

                  {column.length === 0 ? (
                    <div
                      className={`w-14 sm:w-20 md:w-24 h-20 sm:h-28 md:h-36 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
                        isValidTarget
                          ? 'border-amber-400 bg-amber-400/20 scale-105 ring-2 ring-amber-300'
                          : 'border-emerald-800/60 bg-emerald-950/20 hover:border-emerald-600'
                      }`}
                    >
                      <span className="text-emerald-600/60 font-bold text-sm sm:text-base">K</span>
                      <span className="text-[9px] text-emerald-500/40 text-center leading-none mt-0.5">
                        빈 자리
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-14 sm:w-20 md:w-24">
                      {column.map((card, cardIndex) => {
                        const isSelected =
                          selectedLocation?.type === 'tableau' &&
                          selectedLocation?.pileIndex === colIndex &&
                          selectedLocation?.cardIndex !== undefined &&
                          cardIndex >= selectedLocation.cardIndex;

                        const isTargetTop =
                          isValidTarget && cardIndex === column.length - 1;

                        // 세로 오버랩 간격 (모바일/PC 반응형)
                        const offsetPx = cardIndex * (card.isFaceUp ? 26 : 16);

                        return (
                          <div
                            key={card.id}
                            style={{
                              position: cardIndex === 0 ? 'relative' : 'absolute',
                              top: cardIndex === 0 ? 0 : `${offsetPx}px`,
                              left: 0,
                              zIndex: cardIndex + 1,
                            }}
                            onDoubleClick={() => {
                              if (cardIndex === column.length - 1 && card.isFaceUp) {
                                handleQuickMoveToFoundation(card, {
                                  type: 'tableau',
                                  pileIndex: colIndex,
                                  cardIndex,
                                });
                              }
                            }}
                          >
                            <CardView
                              card={card}
                              isSelected={isSelected}
                              isValidTarget={isTargetTop}
                              onClick={() => {
                                handleCardClick(
                                  {
                                    type: 'tableau',
                                    pileIndex: colIndex,
                                    cardIndex,
                                  },
                                  card
                                );
                              }}
                              onDragStart={(e) => {
                                if (card.isFaceUp) {
                                  handleDragStart(e, {
                                    type: 'tableau',
                                    pileIndex: colIndex,
                                    cardIndex,
                                  });
                                }
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 승리 팝업 모달 */}
      {isWon && (
        <WinModal
          nickname={nickname}
          completionTime={completionTime}
          onRestart={onResetToHome}
        />
      )}
    </div>
  );
};
