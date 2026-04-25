function TopNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="top-nav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

export default TopNav;
