import api from './api';

export const getRatingsByVariation = async (variationId) => {
  const response = await api.get(`/variations/${variationId}/ratings`);
  return response.data;
};

export const addRating = async (variationId, ratingData) => {
  const response = await api.post(`/variations/${variationId}/ratings`, ratingData);
  return response.data;
};

export const updateRating = async (id, ratingData) => {
  const response = await api.put(`/ratings/${id}`, ratingData);
  return response.data;
};

export const deleteRating = async (id) => {
  const response = await api.delete(`/ratings/${id}`);
  return response.data;
};