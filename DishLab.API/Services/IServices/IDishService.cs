using DishLab.API.DTOs;

namespace DishLab.API.Services.IServices;

public interface IDishService
{
    Task<IEnumerable<DishDto>> GetAllDishesForUserAsync(int userId);
    Task<DishDto?> GetDishByIdAsync(int id, int userId);
    Task<DishDto> CreateDishAsync(CreateDishDto dto, int userId);
    Task<bool> UpdateDishAsync(int id, CreateDishDto dto, int userId);
    Task<bool> DeleteDishAsync(int id, int userId);
}