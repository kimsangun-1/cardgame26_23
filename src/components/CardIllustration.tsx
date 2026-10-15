import React from 'react';
import { HwatuCard } from '../lib/hwatu/data';

interface CardIllustrationProps {
  card: HwatuCard;
}

export const CardIllustration: React.FC<CardIllustrationProps> = ({ card }) => {
  const { month, cardIndex } = card;

  // 월별 색상 팔레트 및 전용 SVG 그래픽 구성
  switch (month) {
    case 1: // 1월: 소나무 (솔)
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          {/* 하늘/배경 */}
          <rect width="100" height="130" fill="#fdfbf7" />
          {/* 태양 (학 카드인 경우 붉은 해) */}
          <circle cx="50" cy="40" r={cardIndex === 1 ? '24' : '18'} fill="#ef4444" />
          {/* 소나무 솔잎들 */}
          <path d="M 10 130 Q 30 70 50 130" fill="#15803d" />
          <path d="M 50 130 Q 70 65 90 130" fill="#166534" />
          <path d="M 25 130 Q 50 80 75 130" fill="#14532d" />
          {/* 1번 카드: 두루미(학) */}
          {cardIndex === 1 && (
            <g>
              <ellipse cx="50" cy="55" rx="8" ry="14" fill="#ffffff" />
              <circle cx="50" cy="38" r="5" fill="#ffffff" />
              <circle cx="50" cy="35" r="2" fill="#ef4444" /> {/* 학 정수리 붉은점 */}
              <line x1="50" y1="38" x2="40" y2="40" stroke="#ca8a04" strokeWidth="2" />
              <line x1="48" y1="68" x2="46" y2="85" stroke="#1f2937" strokeWidth="1.5" />
              <line x1="52" y1="68" x2="54" y2="85" stroke="#1f2937" strokeWidth="1.5" />
            </g>
          )}
          {/* 2번 카드: 홍단 띠 */}
          {cardIndex === 2 && (
            <g>
              <rect x="25" y="45" width="50" height="12" rx="2" fill="#dc2626" />
              <line x1="28" y1="51" x2="72" y2="51" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" />
            </g>
          )}
        </svg>
      );

    case 2: // 2월: 매화
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#fff7ed" />
          {/* 매화 나무 가지 */}
          <path d="M 90 130 Q 60 80 30 40 Q 15 20 10 10" stroke="#78350f" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 50 65 Q 70 50 85 45" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* 매화 붉은 꽃들 */}
          <circle cx="30" cy="40" r="8" fill="#e11d48" />
          <circle cx="28" cy="38" r="2" fill="#fef08a" />
          <circle cx="70" cy="50" r="7" fill="#f43f5e" />
          <circle cx="68" cy="48" r="2" fill="#fef08a" />
          <circle cx="50" cy="90" r="6" fill="#fb7185" />
          {/* 1번 카드: 꾀꼬리 새 */}
          {cardIndex === 1 && (
            <g transform="translate(15, 10)">
              <ellipse cx="30" cy="30" rx="9" ry="6" fill="#eab308" />
              <circle cx="23" cy="27" r="4" fill="#ca8a04" />
              <polygon points="18,27 14,28 18,30" fill="#78350f" />
              <path d="M 35 30 Q 45 35 48 40" stroke="#a16207" strokeWidth="3" fill="none" />
            </g>
          )}
          {/* 2번 카드: 홍단 띠 */}
          {cardIndex === 2 && (
            <rect x="25" y="25" width="50" height="12" rx="2" fill="#dc2626" />
          )}
        </svg>
      );

    case 3: // 3월: 벚꽃
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#fdf2f8" />
          {/* 벚꽃 커튼 장막 (1번) */}
          {cardIndex === 1 && (
            <g>
              <rect x="15" y="70" width="70" height="40" fill="#f43f5e" rx="3" />
              <rect x="25" y="75" width="50" height="30" fill="#fb7185" rx="2" />
              <circle cx="50" cy="90" r="6" fill="#ffffff" />
            </g>
          )}
          {/* 벚꽃 가지와 풍성한 꽃잎 */}
          <path d="M 10 10 Q 50 20 90 10" stroke="#78350f" strokeWidth="4" fill="none" />
          <circle cx="30" cy="25" r="9" fill="#f472b6" />
          <circle cx="45" cy="35" r="11" fill="#ec4899" />
          <circle cx="65" cy="25" r="10" fill="#f472b6" />
          <circle cx="50" cy="15" r="8" fill="#fbcfe8" />
          {/* 2번 카드: 홍단 띠 */}
          {cardIndex === 2 && (
            <rect x="25" y="45" width="50" height="12" rx="2" fill="#dc2626" />
          )}
          {/* 꽃잎 흩날림 */}
          <circle cx="20" cy="65" r="3" fill="#f472b6" opacity="0.8" />
          <circle cx="80" cy="55" r="4" fill="#ec4899" opacity="0.8" />
          <circle cx="40" cy="95" r="3" fill="#fbcfe8" />
        </svg>
      );

    case 4: // 4월: 등나무
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#faf5ff" />
          {/* 등나무 덩굴 */}
          <path d="M 0 0 Q 50 15 100 5" stroke="#581c87" strokeWidth="4" fill="none" />
          {/* 주렁주렁 매달린 보라 등나무꽃 */}
          <g fill="#a855f7">
            <ellipse cx="25" cy="30" rx="7" ry="14" />
            <ellipse cx="25" cy="45" rx="5" ry="10" />
            <ellipse cx="50" cy="25" rx="8" ry="15" fill="#9333ea" />
            <ellipse cx="50" cy="45" rx="6" ry="12" fill="#7e22ce" />
            <ellipse cx="75" cy="30" rx="7" ry="14" />
            <ellipse cx="75" cy="45" rx="5" ry="10" />
          </g>
          {/* 1번 카드: 두견새 */}
          {cardIndex === 1 && (
            <g transform="translate(10, 60)">
              <ellipse cx="40" cy="35" rx="10" ry="7" fill="#6b7280" />
              <circle cx="32" cy="32" r="5" fill="#4b5563" />
              <polygon points="26,32 20,33 26,35" fill="#ca8a04" />
              <polygon points="46,33 60,37 46,39" fill="#374151" />
            </g>
          )}
          {/* 2번 카드: 초단 띠 */}
          {cardIndex === 2 && (
            <rect x="25" y="65" width="50" height="12" rx="2" fill="#dc2626" />
          )}
        </svg>
      );

    case 5: // 5월: 난초 (창포)
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#f0fdf4" />
          {/* 난초 잎들 (푸른 녹색) */}
          <path d="M 20 130 Q 30 50 15 20" stroke="#16a34a" strokeWidth="4" fill="none" />
          <path d="M 35 130 Q 40 40 30 10" stroke="#15803d" strokeWidth="4" fill="none" />
          <path d="M 65 130 Q 60 45 70 15" stroke="#15803d" strokeWidth="4" fill="none" />
          <path d="M 80 130 Q 70 55 85 25" stroke="#16a34a" strokeWidth="4" fill="none" />
          {/* 보라색 창포꽃 */}
          <ellipse cx="25" cy="30" rx="7" ry="9" fill="#8b5cf6" />
          <ellipse cx="75" cy="35" rx="7" ry="9" fill="#7c3aed" />
          {/* 1번 카드: 야츠하시 다리 */}
          {cardIndex === 1 && (
            <g>
              <polygon points="10,105 90,85 90,98 10,118" fill="#ca8a04" />
              <line x1="30" y1="100" x2="30" y2="125" stroke="#854d0e" strokeWidth="3" />
              <line x1="70" y1="90" x2="70" y2="120" stroke="#854d0e" strokeWidth="3" />
            </g>
          )}
          {/* 2번 카드: 초단 띠 */}
          {cardIndex === 2 && (
            <rect x="25" y="55" width="50" height="12" rx="2" fill="#dc2626" />
          )}
        </svg>
      );

    case 6: // 6월: 모란
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#fef2f2" />
          {/* 모란 잎줄기 */}
          <path d="M 50 130 Q 50 80 50 50" stroke="#15803d" strokeWidth="4" fill="none" />
          <ellipse cx="30" cy="90" rx="12" ry="7" fill="#16a34a" />
          <ellipse cx="70" cy="85" rx="12" ry="7" fill="#16a34a" />
          {/* 크고 화려한 모란 꽃 */}
          <circle cx="50" cy="50" r="22" fill="#dc2626" />
          <circle cx="50" cy="50" r="15" fill="#ef4444" />
          <circle cx="50" cy="50" r="8" fill="#f87171" />
          <circle cx="50" cy="50" r="4" fill="#fef08a" />
          {/* 1번 카드: 나비 */}
          {cardIndex === 1 && (
            <g transform="translate(15, 10)">
              <circle cx="55" cy="20" r="2" fill="#1e293b" />
              <ellipse cx="50" cy="16" rx="6" ry="4" fill="#3b82f6" />
              <ellipse cx="60" cy="16" rx="6" ry="4" fill="#3b82f6" />
              <ellipse cx="51" cy="23" rx="4" ry="3" fill="#60a5fa" />
              <ellipse cx="59" cy="23" rx="4" ry="3" fill="#60a5fa" />
            </g>
          )}
          {/* 2번 카드: 청단 띠 */}
          {cardIndex === 2 && (
            <rect x="25" y="90" width="50" height="12" rx="2" fill="#2563eb" />
          )}
        </svg>
      );

    case 7: // 7월: 싸리 (홍싸리/흑싸리)
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#fefce8" />
          {/* 싸리 덤불 가지 */}
          <path d="M 50 130 Q 20 80 15 30" stroke="#854d0e" strokeWidth="2.5" fill="none" />
          <path d="M 50 130 Q 50 70 50 20" stroke="#854d0e" strokeWidth="2.5" fill="none" />
          <path d="M 50 130 Q 80 80 85 30" stroke="#854d0e" strokeWidth="2.5" fill="none" />
          {/* 싸리 꽃 알갱이들 */}
          <g fill="#dc2626">
            <circle cx="15" cy="35" r="4" />
            <circle cx="22" cy="50" r="4" />
            <circle cx="50" cy="30" r="4" />
            <circle cx="46" cy="45" r="4" />
            <circle cx="85" cy="35" r="4" />
            <circle cx="78" cy="50" r="4" />
          </g>
          {/* 1번 카드: 멧돼지 */}
          {cardIndex === 1 && (
            <g transform="translate(10, 60)">
              <ellipse cx="40" cy="35" rx="16" ry="11" fill="#78350f" />
              <circle cx="26" cy="32" r="7" fill="#5c2607" />
              <polygon points="18,33 24,30 24,36" fill="#fde047" /> {/* 어금니 */}
              <circle cx="24" cy="30" r="1.5" fill="#fef08a" />
              <rect x="30" y="44" width="4" height="8" fill="#5c2607" />
              <rect x="46" y="44" width="4" height="8" fill="#5c2607" />
            </g>
          )}
          {/* 2번 카드: 초단 띠 */}
          {cardIndex === 2 && (
            <rect x="25" y="70" width="50" height="12" rx="2" fill="#dc2626" />
          )}
        </svg>
      );

    case 8: // 8월: 공산과 달
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          {/* 붉은 하늘과 둥근 언덕 */}
          <rect width="100" height="130" fill="#f87171" />
          <ellipse cx="50" cy="140" rx="55" ry="50" fill="#1e1b4b" />
          {/* 1번 카드: 밝고 커다란 보름달 */}
          {cardIndex === 1 && (
            <circle cx="50" cy="45" r="22" fill="#ffffff" />
          )}
          {/* 2번 카드: 기러기 3마리 */}
          {cardIndex === 2 && (
            <g stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M 25 35 Q 30 30 35 35 Q 40 30 45 35" />
              <path d="M 45 48 Q 50 43 55 48 Q 60 43 65 48" />
              <path d="M 65 32 Q 70 27 75 32 Q 80 27 85 32" />
            </g>
          )}
          {/* 3, 4번 카드: 억새풀 */}
          {(cardIndex === 3 || cardIndex === 4) && (
            <g stroke="#ffffff" strokeWidth="1.5" opacity="0.8">
              <line x1="30" y1="95" x2="20" y2="70" />
              <line x1="50" y1="90" x2="50" y2="60" />
              <line x1="70" y1="95" x2="80" y2="70" />
            </g>
          )}
        </svg>
      );

    case 9: // 9월: 국화
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#fffbeb" />
          {/* 국화 줄기 */}
          <path d="M 50 130 Q 40 90 50 60" stroke="#15803d" strokeWidth="3.5" fill="none" />
          <ellipse cx="35" cy="95" rx="8" ry="5" fill="#16a34a" />
          <ellipse cx="65" cy="85" rx="8" ry="5" fill="#16a34a" />
          {/* 탐스러운 노란/붉은 국화 */}
          <circle cx="50" cy="50" r="20" fill="#f59e0b" />
          <circle cx="50" cy="50" r="14" fill="#fbbf24" />
          <circle cx="50" cy="50" r="7" fill="#d97706" />
          {/* 1번 카드: 목숨 수(壽) 술잔 */}
          {cardIndex === 1 && (
            <g transform="translate(15, 65)">
              <ellipse cx="35" cy="40" rx="16" ry="8" fill="#dc2626" />
              <ellipse cx="35" cy="38" rx="12" ry="5" fill="#fef08a" />
              <text x="35" y="41" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#dc2626">壽</text>
            </g>
          )}
          {/* 2번 카드: 청단 띠 */}
          {cardIndex === 2 && (
            <rect x="25" y="85" width="50" height="12" rx="2" fill="#2563eb" />
          )}
        </svg>
      );

    case 10: // 10월: 단풍
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#fff1f2" />
          {/* 단풍 나무 가지와 잎들 */}
          <path d="M 10 10 Q 50 30 90 20" stroke="#78350f" strokeWidth="4" fill="none" />
          <polygon points="30,20 35,35 45,30 38,40 45,50 32,45 25,55 25,42 15,45 22,35" fill="#dc2626" />
          <polygon points="70,25 75,40 85,35 78,45 85,55 72,50 65,60 65,47 55,50 62,40" fill="#ea580c" />
          {/* 1번 카드: 사슴 */}
          {cardIndex === 1 && (
            <g transform="translate(10, 50)">
              <ellipse cx="40" cy="40" rx="14" ry="9" fill="#b45309" />
              <circle cx="28" cy="32" r="6" fill="#92400e" />
              {/* 뿔 */}
              <line x1="26" y1="28" x2="22" y2="18" stroke="#78350f" strokeWidth="2" />
              <line x1="24" y1="23" x2="20" y2="24" stroke="#78350f" strokeWidth="1.5" />
              <rect x="32" y="47" width="3" height="15" fill="#92400e" />
              <rect x="46" y="47" width="3" height="15" fill="#92400e" />
            </g>
          )}
          {/* 2번 카드: 청단 띠 */}
          {cardIndex === 2 && (
            <rect x="25" y="65" width="50" height="12" rx="2" fill="#2563eb" />
          )}
        </svg>
      );

    case 11: // 11월: 오동
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#f3e8ff" />
          {/* 오동나무 넓은 잎 3개 */}
          <ellipse cx="25" cy="80" rx="16" ry="24" fill="#0f766e" />
          <ellipse cx="50" cy="70" rx="18" ry="26" fill="#115e59" />
          <ellipse cx="75" cy="80" rx="16" ry="24" fill="#0f766e" />
          {/* 꽃대 노란 알갱이 */}
          <circle cx="50" cy="35" r="4" fill="#eab308" />
          <circle cx="50" cy="25" r="3" fill="#ca8a04" />
          {/* 1번 카드: 봉황 */}
          {cardIndex === 1 && (
            <g transform="translate(10, 10)">
              <circle cx="40" cy="25" r="7" fill="#dc2626" />
              <polygon points="34,25 26,27 34,29" fill="#eab308" />
              <path d="M 46 25 Q 65 30 75 15" stroke="#ef4444" strokeWidth="3" fill="none" />
              <path d="M 46 28 Q 65 40 75 35" stroke="#f59e0b" strokeWidth="3" fill="none" />
            </g>
          )}
        </svg>
      );

    case 12: // 12월: 비와 버드나무
      return (
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <rect width="100" height="130" fill="#f0f9ff" />
          {/* 버드나무 축 늘어진 가지 */}
          <path d="M 0 0 Q 30 20 20 80" stroke="#15803d" strokeWidth="2.5" fill="none" />
          <path d="M 30 0 Q 60 30 50 90" stroke="#16a34a" strokeWidth="2.5" fill="none" />
          <path d="M 70 0 Q 95 30 85 85" stroke="#15803d" strokeWidth="2.5" fill="none" />
          {/* 빗줄기 */}
          <line x1="20" y1="10" x2="10" y2="40" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="60" y1="20" x2="50" y2="50" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="85" y1="30" x2="75" y2="60" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* 1번 카드: 우산 쓴 선비 (오노노 토후풍) */}
          {cardIndex === 1 && (
            <g transform="translate(20, 60)">
              {/* 우산 */}
              <ellipse cx="30" cy="20" rx="20" ry="7" fill="#dc2626" />
              {/* 사람 몸체와 갓 */}
              <circle cx="30" cy="27" r="5" fill="#1e293b" />
              <rect x="25" y="32" width="10" height="18" fill="#1e293b" rx="2" />
              <ellipse cx="12" cy="45" rx="5" ry="3" fill="#16a34a" /> {/* 개구리 */}
            </g>
          )}
          {/* 2번 카드: 제비 */}
          {cardIndex === 2 && (
            <g transform="translate(25, 45)">
              <polygon points="25,20 15,10 35,15" fill="#1e293b" />
              <polygon points="25,20 30,30 20,25" fill="#ef4444" />
            </g>
          )}
        </svg>
      );

    default:
      return <div className="w-full h-full bg-slate-100" />;
  }
};
