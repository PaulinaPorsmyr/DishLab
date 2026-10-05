export default function AnalyticsCards({ topDishes, topMethods, topIngredients, loading }) {
  if (loading) return <p style={{ color: '#666' }}>Laddar analysdata...</p>;

  const renderList = (items, keyProp, labelProp, unit = 'st', icon = '🔥') => {
    if (!items || items.length === 0) return <p style={{ color: '#999', fontSize: '0.85rem' }}>Ingen data än.</p>;
    
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, idx) => {
          // Namnet på objektet (stöder varianter från backend)
          const name = item[labelProp] || item.name || item.Name || item.dishName || item.DishName;
          
          // Om objektet har ett betyg (som rätter)
          const rating = item.averageRating ?? item.AverageRating;
          
          // Om objektet har en räknare (som tillagningssätt & ingredienser)
          const count = item.count ?? item.Count;

          return (
            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
              <span><strong>{name}</strong></span>
              <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '10px', fontSize: '0.8rem' }}>
                {rating !== undefined ? (
                  `⭐ ${Number(rating).toFixed(1)}`
                ) : (
                  `${icon} ${count ?? 0} ${unit}`
                )}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>⭐ Rätter med högst betyg</h3>
        {renderList(topDishes, 'dishName', 'dishName')}
      </div>
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>🔥 Mest populära varianten</h3>
        {renderList(topMethods, 'cookingMethod', 'cookingMethod', 'st', '🔥')}
      </div>
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>🌿 Mest använda Ingredienser</h3>
        {renderList(topIngredients, 'ingredientName', 'ingredientName', 'ggr', '🌿')}
      </div>
    </div>
  );
}

const cardStyle = { background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' };