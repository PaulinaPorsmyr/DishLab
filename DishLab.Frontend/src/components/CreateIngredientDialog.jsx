import { useState } from 'react';

export default function CreateIngredientDialog({ isOpen, onClose, onSubmit, variationId }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(variationId, { name, amount: Number(amount), unit });
    setName('');
    setAmount('');
    setUnit('');
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h3>Lägg till ingrediens</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Mängd (ex. 200)"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={styles.input}
          />
          <input
            placeholder="Enhet (ex. g, ml, st)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
            style={styles.input}
          />
          <input
            placeholder="Ingrediensnamn (ex. Kycklingfilé)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.btnSec}>Avbryt</button>
            <button type="submit" style={styles.btnPrimary}>Spara ingrediens</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dialog: { background: '#fff', padding: '20px', borderRadius: '8px', width: '350px' },
  input: { width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' },
  btnPrimary: { background: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' },
  btnSec: { background: '#e5e7eb', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }
};