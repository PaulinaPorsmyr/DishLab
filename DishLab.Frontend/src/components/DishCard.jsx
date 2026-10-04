import { useState } from 'react';
import { createVariation } from '../services/variationService';
import { addIngredient } from '../services/ingredientService';
import { addRating } from '../services/ratingService';

export default function DishCard({ dish, onDelete, onRefresh }) {
  // Variation state
  const [cookingMethod, setCookingMethod] = useState('');
  const [outcome, setOutcome] = useState('');

  // Ingrediens state
  const [ingName, setIngName] = useState('');
  const [ingAmount, setIngAmount] = useState(1);
  const [ingUnit, setIngUnit] = useState('');

  // Betyg state
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  // Vilken variation vi lägger till ingrediens/betyg på
  const [selectedVariationId, setSelectedVariationId] = useState(null);

  // Skapa ny variation
  const handleAddVariation = async (e) => {
    e.preventDefault();
    await createVariation(dish.id, { cookingMethod, outcome });
    setCookingMethod('');
    setOutcome('');
    onRefresh();
  };

  // Lägg till ingrediens på valt ID
  const handleAddIngredient = async (e) => {
    e.preventDefault();
    await addIngredient(selectedVariationId, { 
      name: ingName, 
      amount: Number(ingAmount), 
      unit: ingUnit 
    });
    setIngName('');
    setIngAmount(1);
    setIngUnit('');
    setSelectedVariationId(null);
    onRefresh();
  };

  // Sätt betyg på valt ID
  const handleAddRating = async (e) => {
    e.preventDefault();
    await addRating(selectedVariationId, { 
      score: Number(score), 
      comment 
    });
    setComment('');
    setSelectedVariationId(null);
    onRefresh();
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px 0' }}>
      <h2>{dish.name}</h2>
      <p>{dish.description}</p>
      <button onClick={() => onDelete(dish.id)}>Ta bort rätt</button>

      <hr />

      <h3>Variationer</h3>
      {dish.variations && dish.variations.map((v) => (
        <div key={v.id} style={{ background: '#f9f9f9', padding: '8px', marginBottom: '8px' }}>
          <p><strong>Metod:</strong> {v.cookingMethod}</p>
          <p><strong>Resultat:</strong> {v.outcome}</p>

          <p><strong>Ingredienser:</strong></p>
          <ul>
            {v.ingredients && v.ingredients.map((i) => (
              <li key={i.id}>{i.amount} {i.unit} {i.name}</li>
            ))}
          </ul>

          <p><strong>Betyg:</strong></p>
          <ul>
            {v.ratings && v.ratings.map((r) => (
              <li key={r.id}>{r.score}/5 - {r.comment}</li>
            ))}
          </ul>

          <button onClick={() => setSelectedVariationId(v.id)}>
            Lägg till ingrediens/betyg här
          </button>

          {/* Form för att lägga till ingrediens eller betyg på just denna variation */}
          {selectedVariationId === v.id && (
            <div style={{ border: '1px dashed gray', padding: '10px', marginTop: '10px' }}>
              <h4>Ny ingrediens</h4>
              <form onSubmit={handleAddIngredient}>
                <input placeholder="Namn" value={ingName} onChange={(e) => setIngName(e.target.value)} required />
                <input type="number" value={ingAmount} onChange={(e) => setIngAmount(e.target.value)} required />
                <input placeholder="Enhet (g, msk)" value={ingUnit} onChange={(e) => setIngUnit(e.target.value)} required />
                <button type="submit">Spara ingrediens</button>
              </form>

              <h4>Nytt betyg</h4>
              <form onSubmit={handleAddRating}>
                <select value={score} onChange={(e) => setScore(e.target.value)}>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
                <input placeholder="Kommentar" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button type="submit">Spara betyg</button>
              </form>
              
              <button onClick={() => setSelectedVariationId(null)}>Stäng</button>
            </div>
          )}
        </div>
      ))}

      <h4>Skapa ny variation</h4>
      <form onSubmit={handleAddVariation}>
        <input placeholder="Tillagningssätt" value={cookingMethod} onChange={(e) => setCookingMethod(e.target.value)} required />
        <input placeholder="Resultat" value={outcome} onChange={(e) => setOutcome(e.target.value)} required />
        <button type="submit">Spara variation</button>
      </form>
    </div>
  );
}