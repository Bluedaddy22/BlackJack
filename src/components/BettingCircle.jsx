function BettingCircle({ className = '', label = 'BET' }) {
  return (
    <div className={`betting-circle ${className}`.trim()} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}

export default BettingCircle;
