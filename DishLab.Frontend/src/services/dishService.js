import api from '../api/axios';

export async function getDishes() {
  const response = await api.get('/Dishes');
  return response.data;
}

export async function getDishById(id) {
  const response = await api.get(`/Dishes/${id}`);
  return response.data;
}

export async function createDish(dishData) {
  const response = await api.post('/Dishes', dishData);
  return response.data;
}

export async function updateDish(id, dishData) {
  const response = await api.put(`/Dishes/${id}`, dishData);
  return response.data;
}

export async function deleteDish(id) {
  const response = await api.delete(`/Dishes/${id}`);
  return response.data;
}