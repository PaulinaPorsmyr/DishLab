import { useState } from 'react';

export default function CreateDishVariationDialog({ isOpen, onClose, onSubmit, dishId }) {
  const [cookingMethod, setCookingMethod] = useState('');
  const [outcome, setOutcome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Vänta tills API-anropet i DishCard är färdigt
      await onSubmit(dishId, { cookingMethod, outcome });
      setCookingMethod('');
      setOutcome('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h3>Skapa ny variant</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Tillagningssätt (ex. Stekt, Grillad)"
            value={cookingMethod}
            onChange={(e) => setCookingMethod(e.target.value)}
            required
            disabled={isSubmitting}
            style={styles.input}
          />
          <input
            placeholder="Resultat / Outcome (ex. Saftig, Frasig)"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            required
            disabled={isSubmitting}
            style={styles.input}
          />
          <div style={styles.actions}>
            <button type="button" onClick={onClose} disabled={isSubmitting} style={styles.btnSec}>
              Avbryt
            </button>
            <button type="submit" disabled={isSubmitting} style={styles.btnPrimary}>
              {isSubmitting ? 'Sparar...' : 'Spara variant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  dialog: { background: '#fff', padding: '20px', borderRadius: '8px', width: '350px' },
  input: { width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' },
  btnPrimary: { background: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' },
  btnSec: { background: '#e5e7eb', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }
};