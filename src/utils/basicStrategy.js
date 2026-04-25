import { getHandValue, isSoftHand } from './game.js';
import { getCardNumericValue, normalizeRank } from './cards.js';

function fallbackFromDouble(total) {
  return total >= 18 ? 'Stand' : 'Hit';
}

function pairDecision(pairRank, dealerValue) {
  if (pairRank === 'A' || pairRank === '8') {
    return 'Split';
  }

  if (pairRank === '10') {
    return 'Stand';
  }

  if (pairRank === '9') {
    return [2, 3, 4, 5, 6, 8, 9].includes(dealerValue) ? 'Split' : 'Stand';
  }

  if (pairRank === '7') {
    return dealerValue <= 7 ? 'Split' : 'Hit';
  }

  if (pairRank === '6') {
    return dealerValue >= 2 && dealerValue <= 6 ? 'Split' : 'Hit';
  }

  if (pairRank === '5') {
    return dealerValue >= 2 && dealerValue <= 9 ? 'Double' : 'Hit';
  }

  if (pairRank === '4') {
    return dealerValue === 5 || dealerValue === 6 ? 'Split' : 'Hit';
  }

  if (pairRank === '3' || pairRank === '2') {
    return dealerValue >= 2 && dealerValue <= 7 ? 'Split' : 'Hit';
  }

  return 'Hit';
}

function softDecision(total, dealerValue) {
  if (total >= 20) {
    return 'Stand';
  }

  if (total === 19) {
    return dealerValue === 6 ? 'Double' : 'Stand';
  }

  if (total === 18) {
    if (dealerValue >= 3 && dealerValue <= 6) {
      return 'Double';
    }

    if (dealerValue === 2 || dealerValue === 7 || dealerValue === 8) {
      return 'Stand';
    }

    return 'Hit';
  }

  if (total === 17) {
    return dealerValue >= 3 && dealerValue <= 6 ? 'Double' : 'Hit';
  }

  if (total === 16 || total === 15) {
    return dealerValue >= 4 && dealerValue <= 6 ? 'Double' : 'Hit';
  }

  if (total === 14 || total === 13) {
    return dealerValue >= 5 && dealerValue <= 6 ? 'Double' : 'Hit';
  }

  return 'Hit';
}

function hardDecision(total, dealerValue) {
  if (total >= 17) {
    return 'Stand';
  }

  if (total >= 13 && total <= 16) {
    return dealerValue >= 2 && dealerValue <= 6 ? 'Stand' : 'Hit';
  }

  if (total === 12) {
    return dealerValue >= 4 && dealerValue <= 6 ? 'Stand' : 'Hit';
  }

  if (total === 11) {
    return 'Double';
  }

  if (total === 10) {
    return dealerValue <= 9 ? 'Double' : 'Hit';
  }

  if (total === 9) {
    return dealerValue >= 3 && dealerValue <= 6 ? 'Double' : 'Hit';
  }

  return 'Hit';
}

export function getBasicStrategyDecision(playerCards, dealerUpCard, options = {}) {
  const dealerValue = getCardNumericValue(dealerUpCard);
  const total = getHandValue(playerCards);
  const canDouble = Boolean(options.canDouble);
  const canSplit = Boolean(options.canSplit);
  const isPair = playerCards.length === 2 && normalizeRank(playerCards[0].rank) === normalizeRank(playerCards[1].rank);

  let recommendation;

  if (isPair) {
    recommendation = pairDecision(normalizeRank(playerCards[0].rank), dealerValue);
  } else if (isSoftHand(playerCards)) {
    recommendation = softDecision(total, dealerValue);
  } else {
    recommendation = hardDecision(total, dealerValue);
  }

  if (recommendation === 'Split' && !canSplit) {
    return total >= 18 ? 'Stand' : 'Hit';
  }

  if (recommendation === 'Double' && !canDouble) {
    return fallbackFromDouble(total);
  }

  return recommendation;
}
