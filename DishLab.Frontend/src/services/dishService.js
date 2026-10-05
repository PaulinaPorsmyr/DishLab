import api from './api';

export const getDishes = async () => {
  const response = await api.get('/dishes');
  return response.data;
};

export const getDishById = async (id) => {
  const response = await api.get(`/dishes/${id}`);
  return response.data;
};

export const createDish = async (dishData) => {
  const response = await api.post('/dishes', dishData);
  return response.data;
};

export const updateDish = async (id, dishData) => {
  const response = await api.put(`/dishes/${id}`, dishData);
  return response.data;
};

export const deleteDish = async (id) => {
  const response = await api.delete(`/dishes/${id}`);
  return response.data;
};

export const getTopDishes = async () => {
  const response = await api.get('/dishes/top');
  return response.data;
};