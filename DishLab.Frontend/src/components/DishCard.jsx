import { useState } from 'react';
import { createVariation, deleteVariation, createIngredient, createRating } from '../services/variationService';
import CreateDishVariationDialog from './CreateDishVariationDialog';
import { createDishIngredient } from '../services/dishService';

export default function DishCard({ dish, onDelete, onEdit, refreshData }) {
  const [open, setOpen] = useState(false);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const [dishIngInput, setDishIngInput] = useState({ name: '', amount: '', unit: '' });

  const handleInputChange = (varId, field, value) => {
    setInputs(prev => ({
      ...prev,
      [varId]: { ...prev[varId], [field]: value }
    }));
  };

  // Skapa Variant
  const handleAddVariation = async (dishId, variationData) => {
    try {
      await createVariation(dishId, variationData);
      if (refreshData) await refreshData();
    } catch (err) {
      console.error('Fel vid skapande av variant:', err);
      throw err;
    }
  };

  // Skapa Ingrediens på VARIANT
  const handleAddIngredientToVariation = async (varId) => {
    const varInput = inputs[varId] || {};
    const name = varInput.ingName?.trim();
    const amount = Number(varInput.ingAmount);
    const unit = varInput.ingUnit?.trim();

    if (!name || !amount || !unit) {
      alert('Fyll i Mängd (heltal), Enhet och Namn.');
      return;
    }

    try {
      await createIngredient(varId, { name, amount, unit });
      handleInputChange(varId, 'ingName', '');
      handleInputChange(varId, 'ingAmount', '');
      handleInputChange(varId, 'ingUnit', '');
      if (refreshData) await refreshData();
    } catch (err) {
      console.error('Ingrediensfel:', err);
      alert('Kunde inte spara ingrediens.');
    }
  };


const handleAddIngredientToDish = async () => {
  const { name, amount, unit } = dishIngInput;
  if (!name.trim() || !amount || !unit.trim()) {
    alert('Fyll i Mängd, Enhet och Namn för rättens ingrediens.');
    return;
  }

  try {
    // Spara ingrediensen till databasen
    await createDishIngredient(dish.id || dish.Id, { 
      name: name.trim(), 
      amount: Number(amount), 
      unit: unit.trim() 
    });

    setDishIngInput({ name: '', amount: '', unit: '' });
    if (refreshData) await refreshData(); // Ladda om rätterna
  } catch (err) {
    console.error('Fel vid tillägg av ingrediens på rätt:', err);
    alert('Kunde inte spara ingrediens på rätten.');
  }
};

  // Skapa Betyg
  const handleRate = async (varId, score) => {
    const comment = inputs[varId]?.comment?.trim() || null;
    try {
      await createRating({ dishVariationId: varId, score, comment });
      handleInputChange(varId, 'comment', '');
      if (refreshData) await refreshData();
    } catch (err) {
      console.error('Betygsfel:', err);
    }
  };

  const getAverageRating = (ratings = []) => {
    if (!ratings || ratings.length === 0) return null;
    const sum = ratings.reduce((acc, r) => acc + (r.score || r.Score), 0);
    return (sum / ratings.length).toFixed(1);
  };

  const variationsList = dish.variations || dish.Variations || [];
  const dishIngredients = dish.ingredients || dish.Ingredients || [];

  return (
    <div style={styles.card}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h3 style={{ margin: 0 }}>{dish.title || dish.Title || dish.name}</h3>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '0.9rem' }}>{dish.description || dish.Description}</p>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button onClick={() => setOpen(!open)} style={styles.btnSec}>
            {open ? 'Dölj detaljer' : `Detaljer & Varianter (${variationsList.length})`}
          </button>
          <button onClick={() => onEdit(dish)} style={styles.btnSec}>Redigera</button>
          <button onClick={() => onDelete(dish.id || dish.Id)} style={styles.btnDanger}>Ta bort</button>
        </div>
      </div>

      {/* EXPANDERAT INNEHÅLL */}
      {open && (
        <div style={styles.body}>
          
          {/* SEKTION 1: INGREDIENSER PÅ RÄTTEN */}
          <div style={styles.sectionBox}>
            <h4 style={{ margin: '0 0 8px 0' }}>🌿 Huvudingredienser (Rätt)</h4>
            <div style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ color: '#4b5563' }}>
                {dishIngredients.length > 0 
                  ? dishIngredients.map(i => `${i.amount || i.Amount} ${i.unit || i.Unit} ${i.name || i.Name}`).join(', ')
                  : 'Inga huvudingredienser tillagda.'}
              </span>
            </div>

            {/* Formular för att lägga till ingrediens på rätten */}
            <div style={styles.row}>
              <input 
                placeholder="Mängd" 
                type="number"
                value={dishIngInput.amount} 
                onChange={e => setDishIngInput({ ...dishIngInput, amount: e.target.value })} 
                style={{ ...styles.input, width: '80px' }}
              />
              <input 
                placeholder="Enhet" 
                value={dishIngInput.unit} 
                onChange={e => setDishIngInput({ ...dishIngInput, unit: e.target.value })} 
                style={{ ...styles.input, width: '80px' }}
              />
              <input 
                placeholder="Ingrediens" 
                value={dishIngInput.name} 
                onChange={e => setDishIngInput({ ...dishIngInput, name: e.target.value })} 
                style={{ ...styles.input, flex: 1 }}
              />
              <button onClick={handleAddIngredientToDish} style={styles.btnSec}>+ Lägg till på rätt</button>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />

          {/* SEKTION 2: VARIANTER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}>Varianter</h4>
            <button onClick={() => setIsVariationModalOpen(true)} style={styles.btnPrimary}>
              + Ny Variant
            </button>
          </div>

          <CreateDishVariationDialog 
            isOpen={isVariationModalOpen}
            onClose={() => setIsVariationModalOpen(false)}
            onSubmit={handleAddVariation}
            dishId={dish.id || dish.Id}
          />

          {variationsList.map(v => {
            const vId = v.id || v.Id;
            const cookingMethod = v.cookingMethod || v.CookingMethod;
            const outcome = v.outcome || v.Outcome;
            const ingredients = v.ingredients || v.Ingredients || [];
            const ratings = v.ratings || v.Ratings || [];
            const avgRating = getAverageRating(ratings);
            const varInput = inputs[vId] || {};

            return (
              <div key={vId} style={styles.varBox}>
                <div style={styles.header}>
                  <div>
                    <strong>🔥 {cookingMethod}</strong>
                    <span style={{ marginLeft: '8px', color: '#666', fontSize: '0.9rem' }}>({outcome})</span>
                    {avgRating && <span style={styles.avgBadge}>⭐ {avgRating} / 5</span>}
                  </div>
                  <button onClick={async () => { await deleteVariation(vId); refreshData(); }} style={styles.btnText}>
                    ✖
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem' }}>
                  <strong>🌿 Variantens ingredienser: </strong>
                  <span style={{ color: '#4b5563' }}>
                    {ingredients.length > 0 
                      ? ingredients.map(i => `${i.amount || i.Amount} ${i.unit || i.Unit} ${i.name || i.Name}`).join(', ')
                      : 'Inga extra ingredienser'}
                  </span>
                </div>

                <div style={styles.row}>
                  <input 
                    placeholder="Mängd" 
                    type="number"
                    value={varInput.ingAmount || ''} 
                    onChange={e => handleInputChange(vId, 'ingAmount', e.target.value)} 
                    style={{ ...styles.input, width: '80px' }}
                  />
                  <input 
                    placeholder="Enhet" 
                    value={varInput.ingUnit || ''} 
                    onChange={e => handleInputChange(vId, 'ingUnit', e.target.value)} 
                    style={{ ...styles.input, width: '80px' }}
                  />
                  <input 
                    placeholder="Ingrediens" 
                    value={varInput.ingName || ''} 
                    onChange={e => handleInputChange(vId, 'ingName', e.target.value)} 
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <button onClick={() => handleAddIngredientToVariation(vId)} style={styles.btnSec}>+ Ingrediens</button>
                </div>

                <div style={styles.ratingBox}>
                  <input 
                    placeholder="Kommentar..." 
                    value={varInput.comment || ''} 
                    onChange={e => handleInputChange(vId, 'comment', e.target.value)} 
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => handleRate(vId, star)} style={styles.starBtn}>
                        ★ {star}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { padding: '16px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', marginBottom: '12px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  body: { marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' },
  sectionBox: { background: '#f3f4f6', padding: '12px', borderRadius: '6px' },
  varBox: { padding: '12px', background: '#f9f9f9', borderRadius: '6px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #eaeaea' },
  row: { display: 'flex', gap: '6px', alignItems: 'center' },
  ratingBox: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', paddingTop: '6px', borderTop: '1px dashed #ddd' },
  input: { padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' },
  starBtn: { border: '1px solid #f59e0b', background: '#fffbe8', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#b45309' },
  avgBadge: { marginLeft: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' },
  btnPrimary: { background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
  btnSec: { background: '#e5e7eb', color: '#374151', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
  btnDanger: { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
  btnText: { color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }
};