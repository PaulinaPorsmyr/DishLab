using DishLab.API.DTOs;

namespace DishLab.API.Services.IServices
{
    public interface IDishVariationService
    {
        Task<DishVariationDto?> CreateAsync(int dishId, CreateDishVariationDto dto, int userId);
        Task<bool> DeleteAsync(int id, int userId);
    }
}