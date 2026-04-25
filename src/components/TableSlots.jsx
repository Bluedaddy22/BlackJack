const slots = [0, 1, 2, 3, 4];

function TableSlots() {
  return (
    <div className="table-slots" aria-hidden="true">
      {slots.map((slot) => (
        <div
          key={slot}
          className={`table-slot ${slot === 2 ? 'center active' : ''}`}
        />
      ))}
    </div>
  );
}

export default TableSlots;
