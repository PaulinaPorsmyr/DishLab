import { useState } from 'react';

export default function DishCard({ dish, onDelete }) {
  const [showVariations, setShowVariations] = useState(false);

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>{dish.title}</h3>
          <p>{dish.description}</p>
        </div>
        <div>
          <button onClick={() => setShowVariations(!showVariations)}>
            {showVariations ? 'Dölj variationer' : `Visa variationer (${dish.variations?.length || 0})`}
          </button>
          <button onClick={() => onDelete(dish.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>
            Ta bort
          </button>
        </div>
      </div>

      {showVariations && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
          <h4>Variationer & Experiment</h4>
          {!dish.variations || dish.variations.length === 0 ? (
            <p>Inga variationer registrerade än.</p>
          ) : (
            dish.variations.map((variation) => (
              <div key={variation.id} style={{ background: '#f9f9f9', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                <p><strong>Tillagningsmetod:</strong> {variation.cookingMethod}</p>
                <p><strong>Resultat:</strong> {variation.outcome}</p>

                {variation.ingredients && variation.ingredients.length > 0 && (
                  <div>
                    <strong>Ingredienser:</strong>
                    <ul>
                      {variation.ingredients.map((ing) => (
                        <li key={ing.id}>
                          {ing.name} – {ing.amount} {ing.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {variation.ratings && variation.ratings.length > 0 && (
                  <div>
                    <strong>Betyg:</strong>
                    <ul>
                      {variation.ratings.map((rating) => (
                        <li key={rating.id}>
                          {rating.score}/5 {rating.comment ? `- "${rating.comment}"` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}