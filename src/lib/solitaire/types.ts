export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardColor = 'red' | 'black';

export interface Card {
  id: string; // e.g. "hearts-1"
  suit: Suit;
  rank: number; // 1 (Ace) to 13 (King)
  isFaceUp: boolean;
}

export type FoundationPiles = {
  hearts: Card[];
  diamonds: Card[];
  clubs: Card[];
  spades: Card[];
};

export interface GameState {
  stock: Card[]; // 남은 뽑기 카드 (뒤집힌 카드)
  waste: Card[]; // 뽑힌 공개 카드 더미
  foundations: FoundationPiles; // 4개 무늬별 기초 더미
  tableau: Card[][]; // 7개 열
}

export interface CardLocation {
  type: 'waste' | 'tableau' | 'foundation';
  pileIndex?: number; // tableau 열 번호 (0~6)
  suit?: Suit; // foundation의 경우
  cardIndex?: number; // tableau 내부의 인덱스
}
