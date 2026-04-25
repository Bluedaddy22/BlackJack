import { Fragment } from 'react';
import { dealerUpCards } from '../data/strategyContent.js';

const actionLabels = {
  H: 'Hit',
  S: 'Stand',
  D: 'Double',
  P: 'Split',
};

function StrategyTable({ legend, sections }) {
  return (
    <article className="strategy-sheet">
      <div className="strategy-sheet-meta">
        <div className="strategy-legend strategy-legend-compact" aria-label="Strategy legend">
          {legend.map((item) => (
            <div key={item.code} className={`strategy-legend-chip ${item.className}`}>
              <span>{item.code}</span>
              <strong>
                {item.code} = {item.label}
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div className="strategy-table-scroll">
        <table className="strategy-sheet-table" aria-label="Blackjack basic strategy cheat sheet">
          <thead>
            <tr>
              <th scope="col" className="player-hand-column">
                Player
              </th>
              {dealerUpCards.map((card) => (
                <th key={card} scope="col">
                  {card}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <Fragment key={section.key}>
                <tr className="strategy-section-row">
                  <th colSpan={dealerUpCards.length + 1} scope="colgroup">
                    <span>{section.title}</span>
                  </th>
                </tr>
                {section.rows.map((row) => (
                  <tr key={`${section.key}-${row.label}`}>
                    <th scope="row" className="player-hand-column">
                      {row.label}
                    </th>
                    {row.actions.map((action, index) => (
                      <td
                        key={`${section.key}-${row.label}-${dealerUpCards[index]}`}
                        className={`strategy-sheet-cell action-${action.toLowerCase()}`}
                        aria-label={`${row.label} versus dealer ${dealerUpCards[index]}: ${actionLabels[action]}`}
                      >
                        {action}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default StrategyTable;
