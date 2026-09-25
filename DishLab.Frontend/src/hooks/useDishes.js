import { useState, useEffect, useCallback } from 'react';
import { getDishes, createDish, deleteDish } from '../services/dishService';

export function useDishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDishes = useCallback(async () => {
    setError(null);
    try {
      const data = await getDishes();
      setDishes(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Kunde inte hämta rätter.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const addDish = async (dishData) => {
    try {
      const newDish = await createDish(dishData);
      setDishes((prev) => [...prev, newDish]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Kunde inte skapa rätt.',
      };
    }
  };

  const removeDish = async (id) => {
    try {
      await deleteDish(id);
      setDishes((prev) => prev.filter((dish) => dish.id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Kunde inte ta bort rätt.',
      };
    }
  };

  return { dishes, loading, error, refreshDishes: fetchDishes, addDish, removeDish };
}