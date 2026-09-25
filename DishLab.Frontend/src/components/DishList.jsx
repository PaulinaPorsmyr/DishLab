import { useDishes } from '../hooks/useDishes';
import CreateDish from './CreateDish';

export default function DishList() {
  const { dishes, loading, error, refreshDishes, removeDish } = useDishes();

  if (loading) {
    return <div>Laddar rätter...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <CreateDish onDishCreated={refreshDishes} />
      <hr />
      <h2>Mina Rätter</h2>
      {dishes.length === 0 ? (
        <p>Inga rätter hittades.</p>
      ) : (
        <ul>
          {dishes.map((dish) => (
            <li key={dish.id} style={{ marginBottom: '1rem' }}>
              <h3>{dish.title}</h3>
              <p>{dish.description}</p>
              <button onClick={() => removeDish(dish.id)}>Ta bort</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}