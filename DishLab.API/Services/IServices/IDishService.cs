using DishLab.API.DTO.DishDTOs;

namespace DishLab.API.Services.IServices
{
    public interface IDishService
    {
        Task<IEnumerable<DishDto>> GetDishesAsync(int userId);
        Task<DishDto?> GetDishByIdAsync(int id, int userId);
        Task<DishDto> CreateDishAsync(CreateDishDto dto, int userId);
        Task<bool> UpdateDishAsync(int id, CreateDishDto dto, int userId);
        Task<bool> DeleteDishAsync(int id, int userId);
    }
}