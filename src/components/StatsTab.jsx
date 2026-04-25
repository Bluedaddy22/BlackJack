function StatsTab({ stats, accuracy }) {
  const mistakeRows = Object.entries(stats.mistakesByActionType);

  return (
    <section className="content-tab">
      <div className="tab-hero">
        <p className="panel-kicker">Performance</p>
        <h2>Session results and decision quality</h2>
        <p>Review your accuracy, record, and the decisions that cost the most EV.</p>
      </div>

      <div className="stats-overview">
        <div className="overview-card">
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>
        <div className="overview-card">
          <span>Mistakes</span>
          <strong>{stats.mistakes}</strong>
        </div>
        <div className="overview-card">
          <span>Best Streak</span>
          <strong>{stats.bestStreak}</strong>
        </div>
        <div className="overview-card">
          <span>Hands Played</span>
          <strong>{stats.handsPlayed}</strong>
        </div>
      </div>

      <div className="stats-tab-grid">
        <article className="guide-card">
          <div className="guide-header">
            <div>
              <p className="panel-kicker">Record</p>
              <h3>Win / Loss / Push</h3>
            </div>
            <p>Round outcomes from your current training session.</p>
          </div>
          <div className="record-strip large">
            <div>
              <span>Wins</span>
              <strong>{stats.wins}</strong>
            </div>
            <div>
              <span>Losses</span>
              <strong>{stats.losses}</strong>
            </div>
            <div>
              <span>Pushes</span>
              <strong>{stats.pushes}</strong>
            </div>
          </div>
        </article>

        <article className="guide-card">
          <div className="guide-header">
            <div>
              <p className="panel-kicker">Leaks</p>
              <h3>Mistakes by action type</h3>
            </div>
            <p>See which decisions you’re missing most often.</p>
          </div>

          <div className="mistake-list">
            {mistakeRows.map(([action, count]) => (
              <div key={action} className="mistake-row">
                <span>{action}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default StatsTab;
