import api from './api';

export const getVariationsByDish = async (dishId) => {
  const response = await api.get(`/dishes/${dishId}/variations`);
  return response.data;
};

export const createVariation = async (dishId, variationData) => {
  const response = await api.post(`/dishes/${dishId}/variations`, variationData);
  return response.data;
};

export const updateVariation = async (id, variationData) => {
  const response = await api.put(`/variations/${id}`, variationData);
  return response.data;
};

export const deleteVariation = async (id) => {
  const response = await api.delete(`/variations/${id}`);
  return response.data;
};