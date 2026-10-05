import { useState, useEffect } from 'react';
import { 
  getDishes, createDish, deleteDish, updateDish, 
  getTopDishes, getTopCookingMethods, getTopIngredients 
} from '../services/dishService';
import AnalyticsCards from '../components/AnalyticsCards';
import Navbar from '../components/Navbar'; 
import DishCard from '../components/DishCard';

export default function DashboardPage() {
  const [dishes, setDishes] = useState([]);
  const [analytics, setAnalytics] = useState({ dishes: [], methods: [], ingredients: [] });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editData, setEditData] = useState({ id: null, title: '', description: '' });
  const [error, setError] = useState('');

  // Hämtar rätter och analysdata
  const refreshAllData = async () => {
    try {
      const dishesData = await getDishes();
      setDishes(dishesData);
      setError('');
    } catch {
      setError('Kunde inte hämta rätter.');
    }

    try {
      const [topD, topM, topI] = await Promise.all([
        getTopDishes().catch(() => []),
        getTopCookingMethods().catch(() => []),
        getTopIngredients().catch(() => [])
      ]);
      setAnalytics({ dishes: topD, methods: topM, ingredients: topI });
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Skapa ny rätt
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createDish(formData);
      setFormData({ title: '', description: '' });
      refreshAllData();
    } catch (err) { 
      setError(err.response?.data?.errors?.Title?.[0] || 'Fel vid skapande av rätt.'); 
    }
  };

  // Spara redigerad rätt
  const handleSaveEdit = async () => {
    try {
      await updateDish(editData.id, { title: editData.title, description: editData.description });
      setEditData({ id: null, title: '', description: '' });
      refreshAllData();
    } catch { 
      setError('Kunde inte uppdatera rätten.'); 
    }
  };

  // Ta bort rätt
  const handleDelete = async (id) => {
    if (!window.confirm('Vill du verkligen ta bort denna rätt?')) return;
    try { 
      await deleteDish(id); 
      refreshAllData(); 
    } catch { 
      setError('Kunde inte ta bort rätten.'); 
    }
  };

  return (
    <div>
      <Navbar />
      
      <main style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px', fontFamily: 'system-ui' }}>
        <h1>DishLab Dashboard</h1>
        {error && <p style={{ color: '#dc2626', fontWeight: 'bold' }}>{error}</p>}

        {/* 📊 Topplistor */}
        <AnalyticsCards 
          topDishes={analytics.dishes} 
          topMethods={analytics.methods} 
          topIngredients={analytics.ingredients} 
          loading={loadingAnalytics} 
        />

        {/* ➕ Skapa ny rätt */}
        <section style={cardBoxStyle}>
          <h3>Skapa ny rätt</h3>
          <form onSubmit={handleCreate}>
            <input 
              type="text" 
              placeholder="Titel (minst 3 tecken)" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              required 
              minLength={3} 
              style={inputStyle} 
            />
            <textarea 
              placeholder="Beskrivning" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              style={inputStyle} 
            />
            <button type="submit" style={btnPrimary}>Spara rätt</button>
          </form>
        </section>

        {/* 📋 Lista över alla rätter */}
        <section>
          <h3>Dina sparade rätter ({dishes.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dishes.map((dish) => (
              editData.id === dish.id ? (
                /* Redigeringsläge */
                <div key={dish.id} style={cardBoxStyle}>
                  <h4>Redigera rätt</h4>
                  <input 
                    type="text" 
                    value={editData.title} 
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })} 
                    style={inputStyle} 
                  />
                  <textarea 
                    value={editData.description} 
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })} 
                    style={inputStyle} 
                  />
                  <div style={{ marginTop: '8px' }}>
                    <button onClick={handleSaveEdit} style={btnPrimary}>Spara</button>
                    <button onClick={() => setEditData({ id: null, title: '', description: '' })} style={btnSecondary}>Avbryt</button>
                  </div>
                </div>
              ) : (
                /* Vanligt kortläge */
                <DishCard 
                  key={dish.id}
                  dish={dish} 
                  onDelete={handleDelete} 
                  onEdit={(d) => setEditData({ id: d.id, title: d.title || d.name || '', description: d.description || '' })}
                  refreshData={refreshAllData} 
                />
              )
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// Enkla stylingobjekt
const cardBoxStyle = { padding: '16px', background: '#f9fafb', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '24px' };
const inputStyle = { width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };
const btnPrimary = { background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' };
const btnSecondary = { background: '#e5e7eb', color: '#374151', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' };