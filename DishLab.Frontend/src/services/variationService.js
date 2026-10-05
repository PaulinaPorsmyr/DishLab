import api from './api';

// 1. VARIATIONER -> matcher CreateDishVariationDto (CookingMethod, Outcome)
export const createVariation = async (dishId, variationData) => {
  const payload = {
    CookingMethod: variationData.cookingMethod || variationData.CookingMethod,
    Outcome: variationData.outcome || variationData.Outcome
  };

  const response = await api.post(`/variations/dish/${dishId}`, payload);
  return response.data;
};

export const deleteVariation = async (id) => {
  const response = await api.delete(`/variations/${id}`);
  return response.data;
};

// 2. INGREDIENSER -> matcher CreateIngredientDto (Name, Amount (heltal!), Unit)
export const createIngredient = async (variationId, ingredientData) => {
  const payload = {
    Name: ingredientData.name,
    Amount: Math.round(Number(ingredientData.amount)), // Måste vara heltals-int för [Range(1, int.MaxValue)]
    Unit: ingredientData.unit
  };

  const response = await api.post(`/ingredients/variation/${variationId}`, payload);
  return response.data;
};

// 3. BETYG -> matcher CreateRatingDto (DishVariationId, Score, Comment)
export const createRating = async (ratingData) => {
  const payload = {
    DishVariationId: Number(ratingData.dishVariationId),
    Score: Number(ratingData.score),
    Comment: ratingData.comment || null
  };

  const response = await api.post('/ratings', payload);
  return response.data;
};