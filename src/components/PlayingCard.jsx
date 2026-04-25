import { cardLabel } from '../utils/cards.js';

const pipLayouts = {
  A: ['center'],
  '2': ['top-center', 'bottom-center'],
  '3': ['top-center', 'center', 'bottom-center'],
  '4': ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  '5': ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
  '6': ['col-top-left', 'col-top-right', 'col-center-left', 'col-center-right', 'col-bottom-left', 'col-bottom-right'],
  '7': ['col-top-left', 'col-top-right', 'col-upper-left', 'col-upper-right', 'upper-center', 'col-bottom-left', 'col-bottom-right'],
  '8': ['col-top-left', 'col-top-right', 'col-upper-left', 'col-upper-right', 'col-lower-left', 'col-lower-right', 'col-bottom-left', 'col-bottom-right'],
  '9': ['col-top-left', 'col-top-right', 'col-upper-left', 'col-upper-right', 'col-lower-left', 'col-lower-right', 'col-bottom-left', 'col-bottom-right', 'center'],
  '10': ['col-top-left', 'col-top-right', 'col-upper-left', 'col-upper-right', 'col-center-left', 'col-center-right', 'col-lower-left', 'col-lower-right', 'col-bottom-left', 'col-bottom-right'],
};

function isRedSuit(suit) {
  return suit === '♥' || suit === '♦';
}

function isFaceCard(rank) {
  return rank === 'J' || rank === 'Q' || rank === 'K';
}

function renderCardFace(card, redSuit) {
  if (card.rank === 'A' || isFaceCard(card.rank)) {
    return (
      <div
        className={`card-ace ${isFaceCard(card.rank) ? 'face-card' : ''} ${redSuit ? 'red' : 'black'}`}
        aria-hidden="true"
      >
        {card.suit}
      </div>
    );
  }

  return (
    <div className={`card-pips ${redSuit ? 'red' : 'black'}`} aria-hidden="true">
      {pipLayouts[card.rank].map((position, index) => (
        <span
          key={`${card.id}-${position}-${index}`}
          className={`card-pip pip-${position} ${position.startsWith('bottom') || position.startsWith('lower') ? 'mirrored' : ''}`}
        >
          {card.suit}
        </span>
      ))}
    </div>
  );
}

function PlayingCard({ card, className = '', style }) {
  const redSuit = isRedSuit(card.suit);

  return (
    <div
      className={`${className} ${card.isFaceDown ? 'face-down' : ''}`.trim()}
      style={style}
    >
      {card.isFaceDown ? (
        <span className="face-down-copy">Hidden</span>
      ) : (
        <>
          <div className={`card-corner top-corner ${redSuit ? 'red' : 'black'}`}>
            <span className="rank corner-rank">{card.rank}</span>
            <span className="suit corner-suit">{card.suit}</span>
          </div>
          {renderCardFace(card, redSuit)}
          <div className={`card-corner mirrored bottom-corner ${redSuit ? 'red' : 'black'}`}>
            <span className="rank corner-rank">{card.rank}</span>
            <span className="suit corner-suit">{card.suit}</span>
          </div>
          <span className="sr-only">{cardLabel(card)}</span>
        </>
      )}
    </div>
  );
}

export default PlayingCard;
