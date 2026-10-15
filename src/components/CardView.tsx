import React from 'react';
import { Card as CardType } from '../lib/solitaire/types';
import { getCardColor, getRankLabel, getSuitSymbol } from '../lib/solitaire/rules';

interface CardViewProps {
  card: CardType;
  isSelected?: boolean;
  isValidTarget?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isSelected = false,
  isValidTarget = false,
  onClick,
  onDragStart,
  className = '',
  style = {},
}) => {
  const isRed = getCardColor(card.suit) === 'red';
  const rankLabel = getRankLabel(card.rank);
  const suitSymbol = getSuitSymbol(card.suit);

  if (!card.isFaceUp) {
    return (
      <div
        className={`w-14 sm:w-20 md:w-24 h-20 sm:h-28 md:h-36 rounded-lg select-none border border-emerald-950/40 shadow-md relative bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 transition-all duration-150 overflow-hidden ${className}`}
        style={style}
        onClick={onClick}
      >
        <div className="absolute inset-1 rounded-md border border-blue-400/30 flex items-center justify-center p-1">
          <div className="w-full h-full border border-blue-300/20 rounded bg-blue-950/40 flex items-center justify-center">
            <span className="text-blue-300/40 text-lg sm:text-2xl font-bold select-none">♠♦♣♥</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable={card.isFaceUp}
      onDragStart={onDragStart}
      onClick={onClick}
      style={style}
      className={`w-14 sm:w-20 md:w-24 h-20 sm:h-28 md:h-36 rounded-lg select-none cursor-pointer border bg-white shadow-md relative flex flex-col justify-between p-1 sm:p-2 transition-all duration-150 ${
        isRed ? 'text-red-600' : 'text-slate-900'
      } ${
        isSelected
          ? 'ring-4 ring-amber-400 shadow-xl -translate-y-1 brightness-105 z-30'
          : isValidTarget
          ? 'ring-2 ring-emerald-400 shadow-md ring-offset-2'
          : 'border-slate-300 hover:shadow-lg'
      } ${className}`}
    >
      {/* Top Left */}
      <div className="flex flex-col items-start leading-none font-bold">
        <span className="text-xs sm:text-base md:text-lg">{rankLabel}</span>
        <span className="text-xs sm:text-sm md:text-base leading-none">{suitSymbol}</span>
      </div>

      {/* Center Symbol */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xl sm:text-3xl md:text-5xl opacity-90">{suitSymbol}</span>
      </div>

      {/* Bottom Right */}
      <div className="flex flex-col items-end leading-none font-bold rotate-180">
        <span className="text-xs sm:text-base md:text-lg">{rankLabel}</span>
        <span className="text-xs sm:text-sm md:text-base leading-none">{suitSymbol}</span>
      </div>
    </div>
  );
};
