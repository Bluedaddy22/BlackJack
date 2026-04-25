import { createShoe, drawCard, getCardNumericValue } from './cards.js';

const MINIMUM_CARDS_BEFORE_RESUFFLE = 60;

export function getHandValue(cards) {
  // Aces start as 11 and are downgraded to 1 as needed to avoid busting.
  let total = cards.reduce((sum, card) => sum + getCardNumericValue(card), 0);
  let aceCount = cards.filter((card) => card.rank === 'A').length;

  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount -= 1;
  }

  return total;
}

export function isSoftHand(cards) {
  const total = getHandValue(cards);
  const hardTotal = cards.reduce(
    (sum, card) => sum + (card.rank === 'A' ? 1 : getCardNumericValue(card)),
    0,
  );
  return cards.some((card) => card.rank === 'A') && total !== hardTotal;
}

export function isBlackjack(cards) {
  return cards.length === 2 && getHandValue(cards) === 21;
}

export function canSplitHand(cards) {
  if (cards.length !== 2) {
    return false;
  }

  return getCardNumericValue(cards[0]) === getCardNumericValue(cards[1]);
}

function makePlayerHand(cards, overrides = {}) {
  return {
    handId: crypto.randomUUID(),
    cards,
    bet: 1,
    hasActed: false,
    isBusted: getHandValue(cards) > 21,
    isStanding: false,
    isDoubled: false,
    isSplitHand: false,
    outcome: null,
    payout: 0,
    ...overrides,
  };
}

function ensurePlayableShoe(currentShoe) {
  return currentShoe.length < MINIMUM_CARDS_BEFORE_RESUFFLE ? createShoe(6) : currentShoe;
}

export function createInitialRoundState(currentShoe) {
  let shoe = ensurePlayableShoe(currentShoe);

  const playerOne = drawCard(shoe);
  shoe = playerOne.shoe;
  const dealerOne = drawCard(shoe);
  shoe = dealerOne.shoe;
  const playerTwo = drawCard(shoe);
  shoe = playerTwo.shoe;
  const dealerTwo = drawCard(shoe);
  shoe = dealerTwo.shoe;

  const dealerHand = [dealerOne.card, dealerTwo.card];
  const playerHand = makePlayerHand([playerOne.card, playerTwo.card]);
  const dealerBlackjack = isBlackjack(dealerHand);
  const playerBlackjack = isBlackjack(playerHand.cards);

  // Opening blackjacks skip the action phase and resolve immediately.
  if (dealerBlackjack || playerBlackjack) {
    const completedHand = resolveOpeningBlackjack(playerHand, dealerHand);
    return {
      shoe,
      dealerHand,
      playerHands: [completedHand],
      status: 'round-over',
    };
  }

  return {
    shoe,
    dealerHand,
    playerHands: [playerHand],
    status: 'player-turn',
  };
}

function resolveOpeningBlackjack(playerHand, dealerHand) {
  if (isBlackjack(playerHand.cards) && isBlackjack(dealerHand)) {
    return { ...playerHand, outcome: 'push', payout: 0, isStanding: true };
  }

  if (isBlackjack(playerHand.cards)) {
    return { ...playerHand, outcome: 'blackjack', payout: 1.5, isStanding: true };
  }

  return { ...playerHand, outcome: 'loss', payout: -1, isStanding: true };
}

export function drawIntoHand(shoe, hand) {
  const drawn = drawCard(shoe);
  const nextCards = [...hand.cards, drawn.card];
  const total = getHandValue(nextCards);

  return {
    shoe: drawn.shoe,
    hand: {
      ...hand,
      cards: nextCards,
      isBusted: total > 21,
      isStanding: total >= 21,
    },
  };
}

export function shouldAutoStand(hand) {
  return getHandValue(hand.cards) === 21;
}

export function hasAvailableDecision(hand) {
  return !hand.isBusted && !hand.isStanding;
}

export function moveToNextHand(playerHands, currentIndex) {
  const nextIndex = playerHands.findIndex((hand, index) => index > currentIndex && hasAvailableDecision(hand));

  return {
    playerHands,
    nextHandIndex: nextIndex,
  };
}

export function playDealerHand(initialDealerHand, currentShoe) {
  const { dealerHand, shoe } = playDealerHandDetailed(initialDealerHand, currentShoe);
  return { dealerHand, shoe };
}

export function playDealerHandDetailed(initialDealerHand, currentShoe) {
  let dealerHand = [...initialDealerHand];
  let shoe = currentShoe;
  const drawnCards = [];

  // Standard H17 rule: the dealer continues drawing on soft 17.
  while (getHandValue(dealerHand) < 17 || (getHandValue(dealerHand) === 17 && isSoftHand(dealerHand))) {
    const drawn = drawCard(shoe);
    dealerHand = [...dealerHand, drawn.card];
    shoe = drawn.shoe;
    drawnCards.push(drawn.card);
  }

  return { dealerHand, shoe, drawnCards };
}

export function resolveCompletedRound(dealerHand, playerHands) {
  const dealerTotal = getHandValue(dealerHand);
  const dealerBust = dealerTotal > 21;

  // Each player hand is settled independently so split hands can finish differently.
  return playerHands.map((hand) => {
    const playerTotal = getHandValue(hand.cards);

    if (hand.outcome === 'blackjack') {
      return hand;
    }

    if (hand.isBusted) {
      return { ...hand, outcome: 'loss', payout: -hand.bet };
    }

    if (isBlackjack(hand.cards) && !hand.isSplitHand) {
      return { ...hand, outcome: 'blackjack', payout: hand.bet * 1.5 };
    }

    if (dealerBust || playerTotal > dealerTotal) {
      return { ...hand, outcome: 'win', payout: hand.bet };
    }

    if (playerTotal < dealerTotal) {
      return { ...hand, outcome: 'loss', payout: -hand.bet };
    }

    return { ...hand, outcome: 'push', payout: 0 };
  });
}

export function getVisibleDealerHand(dealerHand) {
  return dealerHand.map((card, index) => (index === 1 ? { ...card, isFaceDown: true } : card));
}

export function getDealerDisplayTotal(dealerHand, phase) {
  if (phase === 'round-over') {
    return getHandValue(dealerHand);
  }

  return dealerHand.length > 0 ? getHandValue([dealerHand[0]]) : 0;
}

export function getHandTotalsLabel(cards) {
  const total = getHandValue(cards);
  return isSoftHand(cards) ? `${total} (soft)` : `${total}`;
}

export function formatOutcomeLabel(outcome) {
  if (outcome === 'blackjack') {
    return 'Blackjack';
  }

  if (outcome === 'win') {
    return 'Win';
  }

  if (outcome === 'loss') {
    return 'Loss';
  }

  if (outcome === 'push') {
    return 'Push';
  }

  return '';
}
