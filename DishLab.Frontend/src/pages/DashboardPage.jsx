import { useEffect, useState } from 'react';
import { getDishes, createDish, deleteDish } from '../services/dishService';
import DishCard from '../components/DishCard';
import DashboardSummary from '../components/DashboardSummary';

export default function DashboardPage() {
  const [dishes, setDishes] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchDishes = async () => {
    const data = await getDishes();
    setDishes(data);
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleCreateDish = async (e) => {
    e.preventDefault();
    await createDish({ name, description });
    setName('');
    setDescription('');
    fetchDishes();
  };

  const handleDeleteDish = async (id) => {
    await deleteDish(id);
    fetchDishes();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mina Maträtter</h1>

      <DashboardSummary dishes={dishes} />

      <form onSubmit={handleCreateDish} style={{ marginBottom: '20px' }}>
        <h3>Skapa ny rätt</h3>
        <input
          type="text"
          placeholder="Rättens namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Beskrivning"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Spara rätt</button>
      </form>

      {dishes.map((dish) => (
        <DishCard
          key={dish.id}
          dish={dish}
          onDelete={handleDeleteDish}
          onRefresh={fetchDishes}
        />
      ))}
    </div>
  );
}