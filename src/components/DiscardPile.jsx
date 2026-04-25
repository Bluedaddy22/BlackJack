import { forwardRef } from 'react';

const pileOffsets = [0, 1, 2];

const DiscardPile = forwardRef(function DiscardPile({ count = 0 }, ref) {
  return (
    <div
      ref={ref}
      className={`discard-pile ${count > 0 ? 'has-cards' : 'empty'}`}
      aria-hidden="true"
    >
      <div className="discard-pile__shadow" />
      {pileOffsets.map((offset) => (
        <span
          key={offset}
          className={`discard-pile__card ${offset === pileOffsets.length - 1 ? 'top' : ''}`}
          style={{
            '--discard-offset-x': `${offset * 3}px`,
            '--discard-offset-y': `${offset * 2}px`,
            '--discard-rotate': `${-7 + offset * 2}deg`,
          }}
        />
      ))}
    </div>
  );
});

export default DiscardPile;
