function BettingSpot() {
  return (
    <div className="betting-spot">
      <div className="betting-circle">
        <span>Main Bet</span>
      </div>
      <div className="chip-stack">
        <div className="chip gold">$100</div>
        <div className="chip red">$25</div>
        <div className="chip blue">$10</div>
      </div>
    </div>
  );
}

export default BettingSpot;
