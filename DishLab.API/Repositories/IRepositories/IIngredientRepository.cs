using DishLab.API.Models;

namespace DishLab.API.Repositories.IRepositories;

public interface IIngredientRepository
{
    Task<Ingredient?> GetByIdAsync(int id);
    Task<IEnumerable<Ingredient>> GetByVariationIdAsync(int variationId);
    Task<Ingredient> AddAsync(Ingredient ingredient);
    Task UpdateAsync(Ingredient ingredient);
    Task DeleteAsync(Ingredient ingredient);
}