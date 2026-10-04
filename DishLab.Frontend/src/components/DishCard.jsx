import { useState } from 'react';
import { createVariation } from '../services/variationService';
import { addIngredient } from '../services/ingredientService';
import { addRating } from '../services/ratingService';

export default function DishCard({ dish, onDelete, onRefresh }) {
  const [cookingMethod, setCookingMethod] = useState('');
  const [outcome, setOutcome] = useState('');

  const [ingName, setIngName] = useState('');
  const [ingAmount, setIngAmount] = useState(1);
  const [ingUnit, setIngUnit] = useState('');

  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  const [selectedVariationId, setSelectedVariationId] = useState(null);

  const handleAddVariation = async (e) => {
    e.preventDefault();
    await createVariation(dish.id, { cookingMethod, outcome });
    setCookingMethod('');
    setOutcome('');
    onRefresh();
  };

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
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="h4 m-0">{dish.name}</h2>
          <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(dish.id)}>
            Ta bort rätt
          </button>
        </div>
        <p className="text-muted">{dish.description}</p>

        <hr />

        <h3 className="h5 mb-3">Variationer</h3>
        {dish.variations && dish.variations.map((v) => (
          <div key={v.id} className="card bg-light mb-3">
            <div className="card-body">
              <p className="mb-1"><strong>Metod:</strong> {v.cookingMethod}</p>
              <p className="mb-2"><strong>Resultat:</strong> {v.outcome}</p>

              <div className="row">
                <div className="col-md-6">
                  <strong>Ingredienser:</strong>
                  <ul className="list-unstyled ms-2">
                    {v.ingredients && v.ingredients.map((i) => (
                      <li key={i.id}>• {i.amount} {i.unit} {i.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <strong>Betyg:</strong>
                  <ul className="list-unstyled ms-2">
                    {v.ratings && v.ratings.map((r) => (
                      <li key={r.id}>★ {r.score}/5 {r.comment && `- ${r.comment}`}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                className="btn btn-outline-primary btn-sm mt-2" 
                onClick={() => setSelectedVariationId(v.id)}
              >
                Lägg till ingrediens/betyg här
              </button>

              {selectedVariationId === v.id && (
                <div className="border rounded p-3 bg-white mt-3">
                  <h4 className="h6">Ny ingrediens</h4>
                  <form onSubmit={handleAddIngredient} className="row g-2 mb-3">
                    <div className="col-md-4">
                      <input className="form-control form-control-sm" placeholder="Namn" value={ingName} onChange={(e) => setIngName(e.target.value)} required />
                    </div>
                    <div className="col-md-3">
                      <input className="form-control form-control-sm" type="number" value={ingAmount} onChange={(e) => setIngAmount(e.target.value)} required />
                    </div>
                    <div className="col-md-3">
                      <input className="form-control form-control-sm" placeholder="Enhet (g, msk)" value={ingUnit} onChange={(e) => setIngUnit(e.target.value)} required />
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-success btn-sm w-100">Spara</button>
                    </div>
                  </form>

                  <h4 className="h6">Nytt betyg</h4>
                  <form onSubmit={handleAddRating} className="row g-2 mb-2">
                    <div className="col-md-3">
                      <select className="form-select form-select-sm" value={score} onChange={(e) => setScore(e.target.value)}>
                        <option value="5">5 ★</option>
                        <option value="4">4 ★</option>
                        <option value="3">3 ★</option>
                        <option value="2">2 ★</option>
                        <option value="1">1 ★</option>
                      </select>
                    </div>
                    <div className="col-md-7">
                      <input className="form-control form-control-sm" placeholder="Kommentar" value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-success btn-sm w-100">Spara</button>
                    </div>
                  </form>

                  <button className="btn btn-link btn-sm text-secondary p-0" onClick={() => setSelectedVariationId(null)}>
                    Stäng
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="border-top pt-3 mt-3">
          <h4 className="h6">Skapa ny variation</h4>
          <form onSubmit={handleAddVariation} className="row g-2">
            <div className="col-md-5">
              <input className="form-control form-control-sm" placeholder="Tillagningssätt" value={cookingMethod} onChange={(e) => setCookingMethod(e.target.value)} required />
            </div>
            <div className="col-md-5">
              <input className="form-control form-control-sm" placeholder="Resultat" value={outcome} onChange={(e) => setOutcome(e.target.value)} required />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-secondary btn-sm w-100">Spara variation</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}