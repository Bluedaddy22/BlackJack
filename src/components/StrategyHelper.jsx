const legendItems = [
  { code: 'H', label: 'Hit', className: 'hit' },
  { code: 'S', label: 'Stand', className: 'stand' },
  { code: 'D', label: 'Double', className: 'double' },
  { code: 'P', label: 'Split', className: 'split' },
];

function actionCode(recommendation) {
  if (!recommendation) {
    return '--';
  }

  return recommendation[0];
}

function getSuitClass(suit) {
  if (suit === '♥') {
    return 'suit-heart';
  }

  if (suit === '♦') {
    return 'suit-diamond';
  }

  if (suit === '♣') {
    return 'suit-club';
  }

  return 'suit-spade';
}

function renderCardToken(card) {
  const suitClass = getSuitClass(card.suit);

  return (
    <span key={card.id} className={`coach-card-pill ${suitClass}`}>
      <span className="coach-card-rank">{card.rank}</span>
      <span className={`coach-card-suit ${suitClass}`}>{card.suit}</span>
    </span>
  );
}

function StrategyHelper({ activeHand, dealerUpCard, recommendation, canAct }) {
  return (
    <aside className="side-panel">
      <div className="panel-card strategy-coach">
        <h2 className="side-panel-title">Strategy Coach</h2>

        <div className="coach-callout">
          <span className={`coach-action ${recommendation ? recommendation.toLowerCase() : 'idle'}`}>
            {actionCode(recommendation)}
          </span>
          <div>
            <p>Recommended move</p>
            <strong>{recommendation ?? 'Deal to begin'}</strong>
          </div>
        </div>

        <div className="helper-context">
          <div>
            <span>Player Hand</span>
            <strong className="coach-card-list">
              {canAct && activeHand ? activeHand.cards.map(renderCardToken) : 'Waiting for a hand'}
            </strong>
          </div>
          <div>
            <span>Dealer Up-Card</span>
            <strong className="coach-card-list">
              {dealerUpCard ? renderCardToken(dealerUpCard) : 'Hidden'}
            </strong>
          </div>
        </div>

        <div className="legend-grid">
          {legendItems.map((item) => (
            <div key={item.code} className={`legend-item ${item.className}`}>
              <span>{item.code}</span>
              <strong>{item.label}</strong>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default StrategyHelper;
