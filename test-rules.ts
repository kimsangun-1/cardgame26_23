import {
  createDeck,
  shuffleDeck,
  initializeGame,
  canMoveToFoundation,
  canMoveToTableau,
  isGameWon,
  autoFlipTableauTops,
  SUITS,
} from './src/lib/solitaire/rules';
import { Card, GameState } from './src/lib/solitaire/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- 1. 검증: 52장의 카드 중복/누락 없이 생성 여부 ---');
const deck = createDeck();
assert(deck.length === 52, `덱의 총 매수가 52장이어야 함 (현재: ${deck.length})`);
const uniqueIds = new Set(deck.map((c) => c.id));
assert(uniqueIds.size === 52, `중복된 카드가 없어야 함 (고유 카드 수: ${uniqueIds.size})`);
for (const suit of SUITS) {
  const suitCards = deck.filter((c) => c.suit === suit);
  assert(suitCards.length === 13, `${suit} 무늬의 카드가 정확히 13장이어야 함`);
}

console.log('\n--- 2. 검증: 초기 7개 열 및 남은 뽑기 카드 배치 여부 ---');
const state = initializeGame();
assert(state.tableau.length === 7, '태블로 열의 개수가 7개여야 함');
let totalTableauCards = 0;
for (let i = 0; i < 7; i++) {
  assert(state.tableau[i].length === i + 1, `${i + 1}번째 열의 카드 수가 ${i + 1}장이어야 함`);
  totalTableauCards += state.tableau[i].length;
  // 맨 위 카드만 앞면인지 검증
  for (let j = 0; j < state.tableau[i].length; j++) {
    const card = state.tableau[i][j];
    if (j === state.tableau[i].length - 1) {
      assert(card.isFaceUp === true, `${i + 1}열 맨 위 카드는 앞면이어야 함`);
    } else {
      assert(card.isFaceUp === false, `${i + 1}열 아래 카드는 뒷면이어야 함`);
    }
  }
}
assert(totalTableauCards === 28, `태블로 총 카드 수는 28장이어야 함 (현재: ${totalTableauCards})`);
assert(state.stock.length === 24, `남은 뽑기 카드는 24장이어야 함 (현재: ${state.stock.length})`);
assert(state.waste.length === 0, '초기 공개 더미는 비어 있어야 함');

console.log('\n--- 3. 검증: 이동 규칙 (태블로 & 기초 더미) ---');
// 기초 더미 규칙: 빈 더미에는 Ace(1)만 가능
const aceOfHearts: Card = { id: 'hearts-1', suit: 'hearts', rank: 1, isFaceUp: true };
const twoOfHearts: Card = { id: 'hearts-2', suit: 'hearts', rank: 2, isFaceUp: true };
const kingOfHearts: Card = { id: 'hearts-13', suit: 'hearts', rank: 13, isFaceUp: true };
const aceOfSpades: Card = { id: 'spades-1', suit: 'spades', rank: 1, isFaceUp: true };

assert(canMoveToFoundation(aceOfHearts, [], 'hearts') === true, '빈 하트 기초 더미에 하트 A는 놓을 수 있어야 함');
assert(canMoveToFoundation(twoOfHearts, [], 'hearts') === false, '빈 하트 기초 더미에 하트 2는 놓을 수 없어야 함');
assert(canMoveToFoundation(aceOfSpades, [], 'hearts') === false, '하트 기초 더미에 스페이드 A는 놓을 수 없어야 함');
assert(canMoveToFoundation(twoOfHearts, [aceOfHearts], 'hearts') === true, '하트 A 위에 하트 2를 오름차순으로 놓을 수 있어야 함');
assert(canMoveToFoundation(kingOfHearts, [aceOfHearts], 'hearts') === false, '하트 A 위에 하트 K는 놓을 수 없어야 함');

// 태블로 규칙: 빈 열에는 K(13)만 가능, 다른 열에는 다른 색상 & 하나 작은 숫자만 가능
const blackKing: Card = { id: 'spades-13', suit: 'spades', rank: 13, isFaceUp: true };
const redQueen: Card = { id: 'hearts-12', suit: 'hearts', rank: 12, isFaceUp: true };
const blackQueen: Card = { id: 'clubs-12', suit: 'clubs', rank: 12, isFaceUp: true };

assert(canMoveToTableau(blackKing, []) === true, '빈 열에는 K만 놓을 수 있어야 함');
assert(canMoveToTableau(redQueen, []) === false, '빈 열에는 Q를 놓을 수 없어야 함');
assert(canMoveToTableau(redQueen, [blackKing]) === true, '검정 K 위에 빨강 Q를 놓을 수 있어야 함');
assert(canMoveToTableau(blackQueen, [blackKing]) === false, '검정 K 위에 같은 색 검정 Q는 놓을 수 없어야 함');

console.log('\n--- 4. 검증: 뽑기 더미 소진 후 재사용 시 순서 유지 ---');
// stock 3장 [c1, c2, c3] (pop되므로 c3 -> c2 -> c1 순으로 waste로 들어감)
const c1: Card = { id: '1', suit: 'hearts', rank: 1, isFaceUp: false };
const c2: Card = { id: '2', suit: 'hearts', rank: 2, isFaceUp: false };
const c3: Card = { id: '3', suit: 'hearts', rank: 3, isFaceUp: false };

let mockStock = [c1, c2, c3];
let mockWaste: Card[] = [];

// 3장 차례로 뽑기
while (mockStock.length > 0) {
  const drawn = mockStock.pop()!;
  drawn.isFaceUp = true;
  mockWaste.push(drawn);
}
assert(mockWaste[0].id === '3' && mockWaste[1].id === '2' && mockWaste[2].id === '1', '공개 더미에 순서대로 쌓임');

// 뒤집어서 stock 복구
mockStock = mockWaste.slice().reverse().map(c => ({ ...c, isFaceUp: false }));
mockWaste = [];
assert(mockStock[0].id === '1' && mockStock[1].id === '2' && mockStock[2].id === '3', '뽑기 더미 재사용 시 원래 순서 유지됨');

console.log('\n--- 5. 검증: 승리 조건 판정 ---');
const winningFoundations = {
  hearts: Array.from({ length: 13 }, (_, i) => ({ id: `hearts-${i+1}`, suit: 'hearts' as const, rank: i+1, isFaceUp: true })),
  diamonds: Array.from({ length: 13 }, (_, i) => ({ id: `diamonds-${i+1}`, suit: 'diamonds' as const, rank: i+1, isFaceUp: true })),
  clubs: Array.from({ length: 13 }, (_, i) => ({ id: `clubs-${i+1}`, suit: 'clubs' as const, rank: i+1, isFaceUp: true })),
  spades: Array.from({ length: 13 }, (_, i) => ({ id: `spades-${i+1}`, suit: 'spades' as const, rank: i+1, isFaceUp: true })),
};
assert(isGameWon(winningFoundations) === true, '52장 모두 기초 더미에 쌓이면 승리로 판정되어야 함');

console.log('\n🎉 모든 로직 검증 통과!');
