import DeckStack from './DeckStack.jsx';
import DealAnimationLayer from './DealAnimationLayer.jsx';
import DiscardPile from './DiscardPile.jsx';
import HandView from './HandView.jsx';
import { formatOutcomeLabel, getHandTotalsLabel } from '../utils/game.js';

function BlackjackTable({
  tableRef,
  shoeRef,
  discardPileRef,
  dealerTargetRef,
  playerTargetRef,
  remainingCards,
  discardPileCount,
  dealerCards,
  dealerTotalLabel,
  playerHands,
  activeHandIndex,
  phase,
  roundResult,
  animations,
  isDiscarding,
  hiddenCardIds,
  isSplitAnimating,
  cardBackColor,
}) {
  const highlightedPlayerHand = playerHands[activeHandIndex] ?? playerHands[0] ?? null;
  const hasDealerCards = dealerCards.length > 0;
  const hasPlayerCards = Boolean(highlightedPlayerHand?.cards?.length);
  const playerTotalLabel = hasPlayerCards ? getHandTotalsLabel(highlightedPlayerHand.cards) : null;
  const hasSplitHands = playerHands.length > 1;

  const shouldShowActiveHand = phase === 'player-turn' && !isSplitAnimating;

  return (
    <section className={`blackjack-table card-back-theme-${cardBackColor} ${isDiscarding ? 'discarding' : ''}`}>
      <div className="table-rim">
        <div className="table-felt" ref={tableRef}>
          <div className="discard-pile-anchor">
            <DiscardPile ref={discardPileRef} count={discardPileCount} />
          </div>
          <div className="table-seat-stack dealer">
            <div className="table-seat-label">Dealer</div>
            {hasDealerCards ? <div className="table-seat-total">Total {dealerTotalLabel}</div> : null}
          </div>
          <DeckStack ref={shoeRef} remainingCards={remainingCards} />

          <div ref={dealerTargetRef} className="dealer-hand-anchor">
            <HandView
              cards={dealerCards}
              isDealer
              seat="dealer"
              showHeader={false}
            />
          </div>

          {roundResult ? <div className="result-banner">{roundResult}</div> : null}

          <div className="table-seat-stack player">
            <div className="table-seat-label">Player</div>
            {!hasSplitHands && playerTotalLabel ? <div className="table-seat-total">Total {playerTotalLabel}</div> : null}
          </div>

          <div className="player-zone" ref={playerTargetRef}>
            <div className={`player-hands ${hasSplitHands ? 'split-layout' : 'single-layout'}`}>
              {playerHands.length === 0 ? (
                phase === 'idle' ? <div className="empty-state">Deal a hand to begin your training session.</div> : null
              ) : (
                playerHands.map((hand, index) => (
                  <HandView
                    key={hand.handId}
                    cards={hand.cards}
                    isActive={shouldShowActiveHand && index === activeHandIndex}
                    badge={hand.outcome ? formatOutcomeLabel(hand.outcome) : null}
                    note={hand.isDoubled ? 'Doubled' : ''}
                    seat="player"
                    showHeader={false}
                    handLabel={hasSplitHands ? `Hand ${index + 1}` : null}
                    showInlineSummary={hasSplitHands}
                    hiddenCardIds={hiddenCardIds}
                  />
                ))
              )}
            </div>
          </div>

          <DealAnimationLayer animations={animations} />
        </div>
      </div>
    </section>
  );
}

export default BlackjackTable;
