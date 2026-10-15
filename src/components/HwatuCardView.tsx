import React from 'react';
import { HwatuCard } from '../lib/hwatu/data';
import { CardIllustration } from './CardIllustration';
import { Check } from 'lucide-react';

interface HwatuCardViewProps {
  card: HwatuCard;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const HwatuCardView: React.FC<HwatuCardViewProps> = ({
  card,
  isFlipped,
  isMatched,
  onClick,
  disabled = false,
}) => {
  const showFront = isFlipped || isMatched;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isMatched || isFlipped}
      aria-label={showFront ? `${card.monthName} ${card.symbolName} ${card.title}` : '뒤집힌 화투패'}
      className={`relative w-full aspect-[2/3] rounded-lg sm:rounded-xl select-none transition-all duration-300 transform preserve-3d cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 ${
        isMatched
          ? 'ring-2 ring-emerald-500 shadow-md opacity-90 cursor-default'
          : isFlipped
          ? 'ring-4 ring-amber-400 shadow-xl -translate-y-1 scale-105 z-10'
          : 'hover:scale-[1.03] hover:shadow-lg active:scale-95'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        transform: showFront ? 'rotateY(0deg)' : 'rotateY(180deg)',
      }}
    >
      {/* 1. 앞면 (Front Face) */}
      <div
        className={`absolute inset-0 w-full h-full rounded-lg sm:rounded-xl overflow-hidden border-2 bg-[#fdfbf7] flex flex-col justify-between backface-hidden shadow-sm ${
          isMatched ? 'border-emerald-500 bg-emerald-50/20' : 'border-amber-900/40'
        }`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {/* 상단: 월 표시 및 이름 */}
        <div className="flex items-center justify-between px-1.5 py-0.5 sm:px-2 sm:py-1 bg-amber-950/80 text-amber-100 z-10 border-b border-amber-800/40">
          <span className="text-[10px] sm:text-xs md:text-sm font-extrabold tracking-tight text-amber-300">
            {card.monthName}
          </span>
          <span className="text-[8px] sm:text-[10px] md:text-xs font-medium text-emerald-200/90 truncate max-w-[50px] sm:max-w-[70px]">
            {card.symbolName}
          </span>
        </div>

        {/* 중앙: 자체 제작 화투 SVG 일러스트 */}
        <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-0.5">
          <CardIllustration card={card} />
          {/* 맞춘 카드인 경우 체크 오버레이 */}
          {isMatched && (
            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[0.5px] flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border border-white">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
              </div>
            </div>
          )}
        </div>

        {/* 하단: 세부 카드 칭호 */}
        <div className="px-1 py-0.5 bg-amber-100/90 border-t border-amber-300/40 text-center">
          <span className="text-[8px] sm:text-[9px] md:text-[10px] text-amber-950 font-bold block truncate">
            {card.title}
          </span>
        </div>
      </div>

      {/* 2. 뒷면 (Back Face - 붉은색 고전 화투패 뒷면) */}
      <div
        className="absolute inset-0 w-full h-full rounded-lg sm:rounded-xl overflow-hidden border-2 border-red-950 bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-md backface-hidden flex items-center justify-center p-1.5 sm:p-2.5"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <div className="w-full h-full rounded border-2 border-red-400/40 flex items-center justify-center bg-red-800/40 relative">
          {/* 전통 마름모 패턴 및 문양 */}
          <div className="w-5 h-5 sm:w-7 sm:h-7 border border-red-300/40 rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-red-400/30 rounded-full" />
          </div>
        </div>
      </div>
    </button>
  );
};
