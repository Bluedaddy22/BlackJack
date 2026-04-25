import { forwardRef } from 'react';

const DeckShoe = forwardRef(function DeckShoe({ remainingCards }, ref) {
  return (
    <div ref={ref} className="deck-shoe" aria-label="Card shoe">
      <div className="shoe-body">
        <div className="shoe-stack" />
        <div className="shoe-stack mid" />
        <div className="shoe-stack front" />
      </div>
      <div className="shoe-mouth" />
      <div className="shoe-count">{remainingCards}</div>
    </div>
  );
});

export default DeckShoe;
