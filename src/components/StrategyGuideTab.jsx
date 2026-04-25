import StrategyTable from './StrategyTable.jsx';
import { strategyLegend, strategyTableSections } from '../data/strategyContent.js';

function StrategyGuideTab() {
  return (
    <section className="content-tab strategy-guide-tab">
      <div className="tab-hero strategy-guide-hero">
        <p className="panel-kicker">Strategy Guide</p>
        <h2>Basic strategy cheat sheet</h2>
        <p>Read across from your hand to the dealer up-card and use the action letter in each cell.</p>
      </div>

      <StrategyTable legend={strategyLegend} sections={strategyTableSections} />
    </section>
  );
}

export default StrategyGuideTab;
