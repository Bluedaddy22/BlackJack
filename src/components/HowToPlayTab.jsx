import { howToPlaySections } from '../data/strategyContent.js';

function HowToPlayTab() {
  return (
    <section className="content-tab">
      <div className="tab-hero">
        <p className="panel-kicker">How To Play</p>
        <h2>Blackjack rules made simple</h2>
        <p>Learn the core rules, actions, and dealer behavior before you drill strategy.</p>
      </div>

      <div className="guide-sections">
        {howToPlaySections.map((section) => (
          <article key={section.title} className="guide-card">
            <div className="guide-header">
              <div>
                <p className="panel-kicker">{section.kicker}</p>
                <h3>{section.title}</h3>
              </div>
            </div>
            <div className="explanation-list">
              {section.items.map((item) => (
                <div key={item.term} className="explanation-row">
                  <strong>{item.term}</strong>
                  <p>{item.copy}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HowToPlayTab;
