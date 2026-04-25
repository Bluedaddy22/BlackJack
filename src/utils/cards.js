const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const cardValues = {
  A: 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 10,
  Q: 10,
  K: 10,
};

export function createShoe(deckCount = 6) {
  const cards = [];

  for (let deck = 0; deck < deckCount; deck += 1) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({
          id: `${deck}-${suit}-${rank}-${crypto.randomUUID()}`,
          suit,
          rank,
          value: cardValues[rank],
        });
      }
    }
  }

  return shuffle(cards);
}

export function shuffle(cards) {
  const next = [...cards];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

export function drawCard(shoe) {
  return {
    card: shoe[0],
    shoe: shoe.slice(1),
  };
}

export function cardLabel(card) {
  return `${card.rank}${card.suit}`;
}

export function getCardNumericValue(card) {
  return card.value;
}

export function normalizeRank(rank) {
  if (['10', 'J', 'Q', 'K'].includes(rank)) {
    return '10';
  }

  return rank;
}
