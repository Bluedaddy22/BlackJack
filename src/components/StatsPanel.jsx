function StatsPanel({ stats, accuracy, onReset }) {
  return (
    <aside className="side-panel">
      <div className="panel-card">
        <h2 className="side-panel-title">Session Stats</h2>

        <div className="metric-grid">
          <div className="metric-card">
            <span>Hands Played</span>
            <strong>{stats.handsPlayed}</strong>
          </div>
          <div className="metric-card">
            <span>Correct Decisions</span>
            <strong>{stats.correctDecisions}</strong>
          </div>
          <div className="metric-card">
            <span>Accuracy</span>
            <strong>{accuracy}%</strong>
          </div>
          <div className="metric-card">
            <span>Current Streak</span>
            <strong>{stats.currentStreak}</strong>
          </div>
        </div>

        <div className="record-strip">
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

        <button type="button" className="secondary-button" onClick={onReset}>
          Reset Session
        </button>
      </div>
    </aside>
  );
}

export default StatsPanel;
