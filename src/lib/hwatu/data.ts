export interface HwatuCard {
  id: string; // e.g. "month-1-card-1"
  month: number; // 1 ~ 12
  monthName: string; // "1월" ~ "12월"
  symbolName: string; // e.g. "소나무"
  cardIndex: number; // 1 ~ 4 (해당 월 내 4개 카드 구분)
  title: string; // e.g. "송학(학)", "홍단", "소나무 피 1", "소나무 피 2"
  svgType: string; // 렌더링에 사용할 SVG 식별자
}

export interface MonthInfo {
  month: number;
  monthName: string;
  symbol: string;
  description: string;
  accentColor: string;
}

export const MONTH_DATA: MonthInfo[] = [
  { month: 1, monthName: '1월', symbol: '소나무', description: '솔(소나무)과 학, 홍단', accentColor: '#15803d' },
  { month: 2, monthName: '2월', symbol: '매화', description: '매화와 꾀꼬리, 홍단', accentColor: '#e11d48' },
  { month: 3, monthName: '3월', symbol: '벚꽃', description: '벚꽃과 막(커튼), 홍단', accentColor: '#ec4899' },
  { month: 4, monthName: '4월', symbol: '등나무', description: '등나무와 두견새, 초단', accentColor: '#8b5cf6' },
  { month: 5, monthName: '5월', symbol: '난초', description: '창포/난초와 야츠하시 다리, 초단', accentColor: '#059669' },
  { month: 6, monthName: '6월', symbol: '모란', description: '모란과 나비, 청단', accentColor: '#dc2626' },
  { month: 7, monthName: '7월', symbol: '싸리', description: '싸리나무와 멧돼지, 초단', accentColor: '#ca8a04' },
  { month: 8, monthName: '8월', symbol: '공산과 달', description: '억새풀과 보름달, 기러기', accentColor: '#3b82f6' },
  { month: 9, monthName: '9월', symbol: '국화', description: '국화와 술잔, 청단', accentColor: '#ea580c' },
  { month: 10, monthName: '10월', symbol: '단풍', description: '단풍과 사슴, 청단', accentColor: '#b91c1c' },
  { month: 11, monthName: '11월', symbol: '오동', description: '오동나무와 봉황', accentColor: '#6b21a8' },
  { month: 12, monthName: '12월', symbol: '비와 버드나무', description: '버드나무와 비(우산 쓴 선비)', accentColor: '#0284c7' },
];

export function createHwatuDeck(): HwatuCard[] {
  const deck: HwatuCard[] = [];
  const cardNamesByMonth: Record<number, string[]> = {
    1: ['송학 (학)', '홍단', '소나무 초', '소나무 가지'],
    2: ['매화와 새', '홍단', '매화 꽃송이', '매화 가지'],
    3: ['벚꽃 장막', '홍단', '벚꽃 만개', '벚꽃 잎'],
    4: ['등나무와 새', '초단', '등나무 꽃', '등나무 덩굴'],
    5: ['난초와 다리', '초단', '보라 난초', '난초 잎'],
    6: ['모란과 나비', '청단', '붉은 모란', '모란 잎'],
    7: ['싸리와 멧돼지', '초단', '싸리 꽃순', '붉은 싸리'],
    8: ['공산 보름달', '기러기 세 마리', '가을 억새', '억새 언덕'],
    9: ['국화와 술잔', '청단', '황금 국화', '국화 꽃잎'],
    10: ['단풍과 사슴', '청단', '붉은 단풍', '노란 단풍'],
    11: ['오동과 봉황', '오동 잎 1', '오동 잎 2', '오동 잎 3'],
    12: ['비와 우산 선비', '비와 제비', '버드나무 가지', '비 쌍피'],
  };

  MONTH_DATA.forEach((info) => {
    const names = cardNamesByMonth[info.month];
    // 12개 월 각 2장씩 (총 24장, 12쌍)
    for (let i = 1; i <= 2; i++) {
      deck.push({
        id: `m-${info.month}-c-${i}`,
        month: info.month,
        monthName: info.monthName,
        symbolName: info.symbol,
        cardIndex: i,
        title: names[i - 1],
        svgType: `m${info.month}_c${i}`,
      });
    }
  });

  return deck;
}

export function shuffleHwatuDeck(deck: HwatuCard[]): HwatuCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
