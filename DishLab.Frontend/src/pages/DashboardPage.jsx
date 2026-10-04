import { useState, useEffect } from 'react';
import { getDishes, createDish, deleteDish, updateDish } from '../services/dishService';

export default function DashboardPage() {
  const [dishes, setDishes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Tillstånd för redigering (Update)
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const loadDishes = async () => {
    try {
      const data = await getDishes();
      setDishes(data);
    } catch (err) {
      setError('Kunde inte hämta rätter.');
    }
  };

  useEffect(() => {
    loadDishes();
  }, []);

  // Beräkna statistik för Dashboard-kort
  const totalDishes = dishes.length;
  const latestDish = dishes.length > 0 ? dishes[dishes.length - 1].title || dishes[dishes.length - 1].name : 'Ingen ännu';
  const dishesWithDesc = dishes.filter(d => d.description && d.description.trim() !== '').length;

  // Skapa ny rätt
  const handleCreateDish = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createDish({ title, description });
      setTitle('');
      setDescription('');
      loadDishes();
    } catch (err) {
      const backendError = err.response?.data?.errors?.Title?.[0];
      setError(backendError || 'Kunde inte skapa rätten. Titeln måste ha minst 3 tecken.');
    }
  };

  // Starta redigering
  const handleStartEdit = (dish) => {
    setEditingId(dish.id);
    setEditTitle(dish.title || dish.name || '');
    setEditDescription(dish.description || '');
  };

  // Spara redigering (PUT)
  const handleSaveEdit = async (id) => {
    try {
      await updateDish(id, { title: editTitle, description: editDescription });
      setEditingId(null);
      loadDishes();
    } catch (err) {
      setError('Kunde inte uppdatera rätten.');
    }
  };

  // Ta bort rätt (DELETE)
  const handleDeleteDish = async (id) => {
    if (!window.confirm('Är du säker på att du vill ta bort denna rätt?')) return;
    try {
      await deleteDish(id);
      loadDishes();
    } catch (err) {
      setError('Kunde inte ta bort rätten.');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '8px' }}>DishLab Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>Översikt och hantering av dina Recept & Rätter</p>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* 📊 STATISTIK-KORT (Sammanställer data) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={cardStyle}>
          <span style={cardLabelStyle}>Totalt antal rätter</span>
          <strong style={cardValueStyle}>{totalDishes}</strong>
        </div>
        <div style={cardStyle}>
          <span style={cardLabelStyle}>Senast tillagd</span>
          <strong style={{ ...cardValueStyle, fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {latestDish}
          </strong>
        </div>
        <div style={cardStyle}>
          <span style={cardLabelStyle}>Rätter med beskrivning</span>
          <strong style={cardValueStyle}>{dishesWithDesc} / {totalDishes}</strong>
        </div>
      </div>

      {/* ➕ FORMULÄR: SKAPA RÄTT */}
      <section style={{ marginBottom: '40px', padding: '24px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.25rem' }}>Skapa ny rätt</h2>
        <form onSubmit={handleCreateDish}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="title" style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Titel (3-100 tecken):</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={100}
              placeholder="f.eks. Frasiga Våfflor"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="description" style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Beskrivning:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Kort beskrivning eller tillagningstips..."
              style={inputStyle}
            />
          </div>

          <button type="submit" style={primaryBtnStyle}>Spara rätt</button>
        </form>
      </section>

      {/* 📋 LISTA MED RÄTTER (FULL DOKUMENTERAD CRUD) */}
      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Dina sparade rätter ({totalDishes})</h2>
        {totalDishes === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Inga rätter tillagda än. Skapa en ovan!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dishes.map((dish) => (
              <div key={dish.id} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editingId === dish.id ? (
                  /* Redigeringsvy (Update) */
                  <div style={{ flex: 1, marginRight: '16px' }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ ...inputStyle, marginBottom: '8px' }}
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      style={inputStyle}
                    />
                  </div>
                ) : (
                  /* Standardvisning (Read) */
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{dish.title || dish.name}</h3>
                    {dish.description && <p style={{ margin: '4px 0 0 0', color: '#4b5563', fontSize: '0.95rem' }}>{dish.description}</p>}
                  </div>
                )}

                {/* Åtgärdsknappar */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {editingId === dish.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(dish.id)} style={successBtnStyle}>Spara</button>
                      <button onClick={() => setEditingId(null)} style={secondaryBtnStyle}>Avbryt</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleStartEdit(dish)} style={secondaryBtnStyle}>Redigera</button>
                      <button onClick={() => handleDeleteDish(dish.id)} style={dangerBtnStyle}>Ta bort</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Interne styling-objekt
const cardStyle = {
  backgroundColor: '#f3f4f6',
  padding: '16px 20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const cardLabelStyle = { fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' };
const cardValueStyle = { fontSize: '1.75rem', color: '#111827', fontWeight: '700' };
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' };

const primaryBtnStyle = { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' };
const secondaryBtnStyle = { backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' };
const successBtnStyle = { backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' };
const dangerBtnStyle = { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' };