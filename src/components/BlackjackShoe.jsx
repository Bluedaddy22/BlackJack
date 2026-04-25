import { forwardRef } from 'react';

const cardOffsets = [0, 1, 2, 3];

const BlackjackShoe = forwardRef(function BlackjackShoe({ remainingCards }, ref) {
  return (
    <div ref={ref} className="blackjack-shoe" aria-label="Blackjack card shoe">
      <div className="blackjack-shoe__shadow" aria-hidden="true" />
      <div className="blackjack-shoe__body" aria-hidden="true">
        <div className="blackjack-shoe__top" />
        <div className="blackjack-shoe__side" />
        <div className="blackjack-shoe__trim blackjack-shoe__trim--top" />
        <div className="blackjack-shoe__trim blackjack-shoe__trim--side" />
        <div className="blackjack-shoe__cards">
          {cardOffsets.map((offset) => (
            <span
              key={offset}
              className="blackjack-shoe__card"
              style={{
                '--shoe-card-offset': `${offset * 6}px`,
                '--shoe-card-depth': `${offset * 2}px`,
                '--shoe-card-rise': `${offset * 1.5}px`,
              }}
            />
          ))}
        </div>
        <div className="blackjack-shoe__opening">
          <div className="blackjack-shoe__opening-lip" />
        </div>
      </div>
      <div className="blackjack-shoe__count">{remainingCards}</div>
    </div>
  );
});

export default BlackjackShoe;
