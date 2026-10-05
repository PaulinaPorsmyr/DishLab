import api from './api';

// --- Rätter (CRUD) ---

// Hämta alla rätter
export const getDishes = async () => {
  const response = await api.get('/dishes');
  return response.data;
};

// Skapa ny rätt
export const createDish = async (dishData) => {
  const response = await api.post('/dishes', dishData);
  return response.data;
};

// Uppdatera rätt
export const updateDish = async (id, dishData) => {
  const response = await api.put(`/dishes/${id}`, dishData);
  return response.data;
};

// Ta bort rätt
export const deleteDish = async (id) => {
  const response = await api.delete(`/dishes/${id}`);
  return response.data;
};

// ingredienser
export async function createDishIngredient(dishId, ingredientData) {
  const response = await api.post(`/dishes/${dishId}/ingredients`, ingredientData);
  return response.data;
}

// Topplistor ---

// Hämta mest populära tillagningssätt
export const getTopCookingMethods = async () => {
  const response = await api.get('/variations/top');
  return response.data;
};

// Hämta populäraste rätterna
export const getTopDishes = async () => {
  const response = await api.get('/dishes/top');
  return response.data;
};

// Hämta populäraste ingredienserna
export const getTopIngredients = async () => {
  const response = await api.get('/ingredients/top');
  return response.data;
};