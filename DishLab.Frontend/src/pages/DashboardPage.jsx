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
    <div className="container py-4">
      <h1 className="mb-4">Mina Maträtter</h1>

      <DashboardSummary dishes={dishes} />

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h3 className="card-title h5 mb-3">Skapa ny rätt</h3>
          <form onSubmit={handleCreateDish} className="row g-2">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Rättens namn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Beskrivning"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Spara rätt
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        {dishes.map((dish) => (
          <div key={dish.id} className="col-12">
            <DishCard
              dish={dish}
              onDelete={handleDeleteDish}
              onRefresh={fetchDishes}
            />
          </div>
        ))}
      </div>
    </div>
  );
}