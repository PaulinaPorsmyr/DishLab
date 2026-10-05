using DishLab.API.Models;

namespace DishLab.API.Repositories.IRepositories;

public interface IDishVariationRepository
{
    Task<DishVariation?> GetByIdAsync(int id);
    Task<IEnumerable<DishVariation>> GetByDishIdAsync(int dishId);
    Task<DishVariation> AddAsync(DishVariation variation);
    Task UpdateAsync(DishVariation variation);
    Task DeleteAsync(DishVariation variation);
}