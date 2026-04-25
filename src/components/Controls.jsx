const buttonDetails = [
  { key: 'Deal', label: 'Deal', tone: 'deal' },
  { key: 'Hit', label: 'Hit', tone: 'action' },
  { key: 'Stand', label: 'Stand', tone: 'action' },
  { key: 'Double', label: 'Double', tone: 'action' },
  { key: 'Split', label: 'Split', tone: 'action' },
];

function Controls({
  canDeal,
  canHit,
  canStand,
  canDouble,
  canSplit,
  onDeal,
  onHit,
  onStand,
  onDouble,
  onSplit,
  autoDeal,
  onToggleAutoDeal,
  showStrategyCoach,
  onToggleStrategyCoach,
}) {
  const config = {
    Deal: { enabled: canDeal, onClick: onDeal },
    Hit: { enabled: canHit, onClick: onHit },
    Stand: { enabled: canStand, onClick: onStand },
    Double: { enabled: canDouble, onClick: onDouble },
    Split: { enabled: canSplit, onClick: onSplit },
  };

  return (
    <section className="controls-panel">
      <div className="controls-header">
        <h2 className="side-panel-title">Actions</h2>
      </div>

      <div className="controls-toggles">
        <button type="button" className="toggle-button" onClick={onToggleStrategyCoach}>
          {showStrategyCoach ? 'Hide Strategy Coach' : 'Show Strategy Coach'}
        </button>
        <button
          type="button"
          className={`toggle-button ${autoDeal ? 'active' : ''}`}
          onClick={onToggleAutoDeal}
        >
          Auto Deal: {autoDeal ? 'On' : 'Off'}
        </button>
      </div>

      <div className="controls-grid">
        {buttonDetails.map((button) => (
          <button
            key={button.key}
            type="button"
            className={`action-button ${button.tone}`}
            onClick={config[button.key].onClick}
            disabled={!config[button.key].enabled}
          >
            <span className="action-button-label">{button.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Controls;
