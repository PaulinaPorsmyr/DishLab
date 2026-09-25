using DishLab.API.Models;

namespace DishLab.API.Repositories.IRepositories;

public interface IDishRepository
{
    Task<IEnumerable<Dish>> GetAllByUserIdAsync(int userId);
    Task<Dish?> GetByIdAsync(int id, int userId);
    Task CreateAsync(Dish dish);
    Task UpdateAsync(Dish dish);
    Task DeleteAsync(Dish dish);
}