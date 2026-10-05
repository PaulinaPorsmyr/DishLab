using DishLab.API.Models;

namespace DishLab.API.Repositories;

public interface IRatingRepository
{
    Task<Rating?> GetByIdAsync(int id);
    Task<Rating?> GetByUserAndVariationAsync(int userId, int variationId);
    Task<IEnumerable<Rating>> GetByVariationIdAsync(int variationId);
    Task<Rating> AddAsync(Rating rating);
    Task UpdateAsync(Rating rating);
    Task DeleteAsync(Rating rating);
}