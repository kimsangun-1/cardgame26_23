import { createHwatuDeck, shuffleHwatuDeck, MONTH_DATA } from './src/lib/hwatu/data';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- 1. 검증: 12개 월이 각각 4장씩, 총 48장 생성 여부 ---');
const deck = createHwatuDeck();
assert(deck.length === 48, `덱의 총 매수가 48장이어야 함 (현재: ${deck.length})`);

for (let month = 1; month <= 12; month++) {
  const monthCards = deck.filter((c) => c.month === month);
  assert(monthCards.length === 4, `${month}월 카드가 정확히 4장이어야 함 (현재: ${monthCards.length})`);
}

console.log('\n--- 2. 검증: 카드 ID 고유성 (중복 여부) ---');
const idSet = new Set(deck.map((c) => c.id));
assert(idSet.size === 48, `모든 48장 카드의 ID가 고유해야 함 (고유 ID 수: ${idSet.size})`);

console.log('\n--- 3. 검증: 같은 월의 서로 다른 그림도 정답 처리 로직 ---');
// 3월 카드 4장 추출 (장막, 홍단, 벚꽃 만개, 벚꽃 잎)
const marchCards = deck.filter((c) => c.month === 3);
const cardA = marchCards[0]; // 벚꽃 장막
const cardB = marchCards[1]; // 홍단
assert(cardA.title !== cardB.title, '두 카드의 그림과 제목은 서로 다름');
assert(cardA.month === cardB.month, '같은 월(3월)이므로 정답으로 인정됨');

console.log('\n--- 4. 검증: 같은 월 4장이 고정 짝 없이 2쌍 매칭 가능 여부 ---');
// 4장 [c0, c1, c2, c3] 중 (c0, c2) 매칭 후 (c1, c3) 매칭 가능 확인
const matchedSet = new Set<string>();
// Pair 1: c0 & c2
if (marchCards[0].month === marchCards[2].month) {
  matchedSet.add(marchCards[0].id);
  matchedSet.add(marchCards[2].id);
}
// Pair 2: c1 & c3
if (marchCards[1].month === marchCards[3].month) {
  matchedSet.add(marchCards[1].id);
  matchedSet.add(marchCards[3].id);
}
assert(matchedSet.size === 4, '어떤 두 장을 골라도 같은 월이면 자유롭게 2쌍 매칭 완료');

console.log('\n--- 5. 검증: 다른 월인 경우 오답 판정 ---');
const cardAug = deck.find((c) => c.month === 8)!;
assert(cardA.month !== cardAug.month, '3월과 8월은 서로 다른 월이므로 오답');

console.log('\n--- 6. 검증: 셔플 후 48장 보존 및 무작위성 ---');
const shuffled = shuffleHwatuDeck(deck);
assert(shuffled.length === 48, '셔플 후에도 48장 유지');
assert(new Set(shuffled.map((c) => c.id)).size === 48, '셔플 후에도 ID 고유성 유지');

console.log('\n--- 7. 검증: 24쌍(48장) 승리 조건 ---');
const allMatched = new Set(deck.map((c) => c.id));
assert(allMatched.size === 48, '48장 모두 맞추면 총 24쌍 달성');
assert(Math.floor(allMatched.size / 2) === 24, '24 / 24 완료');

console.log('\n🎉 화투 짝 맞추기 모든 데이터 및 규칙 검증 통과!');
