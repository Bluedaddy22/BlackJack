import { forwardRef } from 'react';

const stackOffsets = [0, 1, 2];

const DeckStack = forwardRef(function DeckStack(_props, ref) {
  return (
    <div ref={ref} className="deck-stack" aria-label="Card deck">
      <div className="deck-stack__shadow" aria-hidden="true" />
      <div className="deck-stack__pile" aria-hidden="true">
        {stackOffsets.map((offset) => (
          <span
            key={offset}
            className={`deck-stack__card ${offset === stackOffsets.length - 1 ? 'top' : ''}`}
            style={{
              '--deck-offset-x': `${offset * 4}px`,
              '--deck-offset-y': `${offset * 3}px`,
              '--deck-rotate': `${-8 + offset * 2}deg`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default DeckStack;
