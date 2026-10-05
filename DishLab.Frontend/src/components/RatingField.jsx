export default function RatingField({ onRate, score }) {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>⭐ Betygsätt:</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          style={{
            background: star <= score ? '#fef3c7' : '#fff',
            border: '1px solid #f59e0b',
            color: '#b45309',
            borderRadius: '4px',
            cursor: 'pointer',
            padding: '2px 8px',
            fontWeight: 'bold'
          }}
        >
          ★ {star}
        </button>
      ))}
    </div>
  );
}