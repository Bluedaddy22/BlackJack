const cardBackOptions = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'black', label: 'Black' },
];

function CardBackSelector({ selectedColor, onSelect }) {
  return (
    <aside className="side-panel">
      <div className="panel-card card-back-selector">
        <h2 className="side-panel-title">Card Back Color</h2>

        <div className="card-back-selector-grid" role="radiogroup" aria-label="Card back color">
          {cardBackOptions.map((option) => {
            const isSelected = option.value === selectedColor;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`card-back-option ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(option.value)}
              >
                <span
                  className={`card-back-preview card-back-theme-${option.value}`}
                  aria-hidden="true"
                />
                <span className="card-back-option-label">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default CardBackSelector;
