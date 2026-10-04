using DishLab.API.DTOs;


namespace DishLab.API.Services.IServices
{
    public interface IIngredientService
    {
        Task<IngredientDto?> CreateAsync(int variationId, CreateIngredientDto dto, int userId);
        Task<bool> DeleteAsync(int id, int userId);
    }
}