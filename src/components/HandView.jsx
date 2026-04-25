import PlayingCard from './PlayingCard.jsx';
import { getHandTotalsLabel } from '../utils/game.js';

function getFanStyle(index, count, seat) {
  const spread = seat === 'dealer' ? Math.max(5, 10 - count) : Math.max(6, 12 - count);
  const offset = index - (count - 1) / 2;
  const rotation = offset * spread;
  const lift = Math.abs(offset) * (seat === 'dealer' ? 4 : 5);
  const shift = offset * (seat === 'dealer' ? 6 : 8);

  return {
    '--card-rotation': `${rotation}deg`,
    '--card-lift': `${lift}px`,
    '--card-shift': `${shift}px`,
    zIndex: index + 1,
  };
}

function getRowStyle(count, seat) {
  const overlap =
    seat === 'dealer'
      ? count <= 2
        ? 0
        : count <= 4
          ? 12
          : 20
      : count <= 2
        ? 0
        : count <= 4
          ? 10
          : 18;

  return {
    '--card-overlap': `${overlap}px`,
  };
}

function HandView({
  title,
  subtitle,
  cards,
  totalLabel,
  isDealer = false,
  isActive = false,
  badge,
  note,
  seat = 'player',
  showHeader = true,
  handLabel,
  showInlineSummary = false,
  hiddenCardIds = [],
}) {
  const resolvedTotalLabel = totalLabel ?? getHandTotalsLabel(cards);

  return (
    <article className={`hand-panel ${isDealer ? 'dealer' : 'player'} ${seat} ${isActive ? 'active' : ''} ${showHeader ? '' : 'headerless'} ${showInlineSummary ? 'inline-summary' : ''}`}>
      {showHeader ? (
        <div className="hand-header">
          <div>
            {subtitle ? <p className="panel-kicker">{subtitle}</p> : null}
            <h3>{title}</h3>
          </div>
          <div className="hand-meta">
            <span className="total-chip">Total {resolvedTotalLabel}</span>
            {badge ? <span className="badge-chip">{badge}</span> : null}
          </div>
        </div>
      ) : null}

      {showInlineSummary ? (
        <div className="hand-inline-summary">
          <div className="hand-inline-heading">
            {handLabel ? <span className="hand-inline-label">{handLabel}</span> : null}
            {isActive ? <span className="hand-inline-active">Active</span> : null}
          </div>
          <div className="hand-inline-meta">
            <span className="total-chip">Total {resolvedTotalLabel}</span>
            {badge ? <span className="badge-chip">{badge}</span> : null}
          </div>
        </div>
      ) : null}

      <div className={`cards-row ${seat}`} style={getRowStyle(cards.length, seat)}>
        {cards.map((card, index) => {
          const isCardHidden = hiddenCardIds.includes(card.id);

          return (
            <PlayingCard
              key={card.id}
              card={card}
              className={`playing-card ${isCardHidden ? 'is-hidden' : ''}`}
              style={getFanStyle(index, cards.length, seat)}
            />
          );
        })}
      </div>

      {badge || note ? (
        <div className="hand-footer">
          {note ? <p className="hand-note">{note}</p> : null}
        </div>
      ) : null}
    </article>
  );
}

export default HandView;
