import { Card, CardColor, FoundationPiles, GameState, Suit } from './types';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

export function getCardColor(suit: Suit): CardColor {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}

export function getRankLabel(rank: number): string {
  switch (rank) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return rank.toString();
  }
}

export function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case 'hearts':
      return '♥';
    case 'diamonds':
      return '♦';
    case 'clubs':
      return '♣';
    case 'spades':
      return '♠';
  }
}

// 52장의 카드 생성
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        isFaceUp: false,
      });
    }
  }
  return deck;
}

// Fisher-Yates 카드 셔플
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 게임 초기 상태 생성 (7개 열 배치 + 남은 카드 stock)
export function initializeGame(preShuffledDeck?: Card[]): GameState {
  const deck = preShuffledDeck ? [...preShuffledDeck] : shuffleDeck(createDeck());
  const tableau: Card[][] = Array.from({ length: 7 }, () => []);

  // 1~7개씩 배치
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck.pop()!;
      // 각 열의 맨 위 카드만 앞면 공개
      card.isFaceUp = row === col;
      tableau[col].push(card);
    }
  }

  return {
    stock: deck, // 나머지 24장
    waste: [],
    foundations: {
      hearts: [],
      diamonds: [],
      clubs: [],
      spades: [],
    },
    tableau,
  };
}

// 기초 더미(Foundation)에 놓을 수 있는지 판정
export function canMoveToFoundation(card: Card, foundationPile: Card[], targetSuit: Suit): boolean {
  if (card.suit !== targetSuit) return false;
  if (foundationPile.length === 0) {
    return card.rank === 1; // Ace만 가능
  }
  const topCard = foundationPile[foundationPile.length - 1];
  return card.rank === topCard.rank + 1;
}

// 태블로(Tableau)에 카드(또는 묶음의 첫 카드)를 놓을 수 있는지 판정
export function canMoveToTableau(movingCard: Card, targetColumn: Card[]): boolean {
  if (targetColumn.length === 0) {
    return movingCard.rank === 13; // K만 놓을 수 있음
  }
  const topCard = targetColumn[targetColumn.length - 1];
  if (!topCard.isFaceUp) return false;

  const differentColor = getCardColor(movingCard.suit) !== getCardColor(topCard.suit);
  const oneRankLower = movingCard.rank === topCard.rank - 1;

  return differentColor && oneRankLower;
}

// 승리 판정 (52장 모두 기초 더미에 쌓임)
export function isGameWon(foundations: FoundationPiles): boolean {
  const totalInFoundation =
    foundations.hearts.length +
    foundations.diamonds.length +
    foundations.clubs.length +
    foundations.spades.length;
  return totalInFoundation === 52;
}

// 뒷면 카드가 맨 위로 드러나면 자동으로 앞면으로 전환
export function autoFlipTableauTops(tableau: Card[][]): Card[][] {
  return tableau.map((column) => {
    if (column.length === 0) return column;
    const lastIndex = column.length - 1;
    if (!column[lastIndex].isFaceUp) {
      const newCol = [...column];
      newCol[lastIndex] = { ...newCol[lastIndex], isFaceUp: true };
      return newCol;
    }
    return column;
  });
}
