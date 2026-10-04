import api from './api';

export const getIngredientsByVariation = async (variationId) => {
  const response = await api.get(`/variations/${variationId}/ingredients`);
  return response.data;
};

export const addIngredient = async (variationId, ingredientData) => {
  const response = await api.post(`/variations/${variationId}/ingredients`, ingredientData);
  return response.data;
};

export const updateIngredient = async (id, ingredientData) => {
  const response = await api.put(`/ingredients/${id}`, ingredientData);
  return response.data;
};

export const deleteIngredient = async (id) => {
  const response = await api.delete(`/ingredients/${id}`);
  return response.data;
};