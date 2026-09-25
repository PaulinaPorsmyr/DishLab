import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DishList() {
  const [dishes, setDishes] = useState([]);

  async function getDishList() {
    try {
      // Ändrat till /api/Dishes (pluralis)
      const response = await axios.get('https://localhost:7118/api/Dishes');
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dish list:', error);
    }
  }

  useEffect(() => {
    getDishList();
  }, []);

  return (
    <>
      <h1>List of Dishes</h1>
      <ul>
        {dishes.map((dish) => (
          // Ändrat från dish.name till dish.title
          <li key={dish.id}>
            <strong>{dish.title}</strong> - {dish.description}
          </li>
        ))}
      </ul>
    </>
  );
}