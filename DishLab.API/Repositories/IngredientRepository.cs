using DishLab.API.Data;
using DishLab.API.Models;
using DishLab.API.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace DishLab.API.Repositories;

public class IngredientRepository : IIngredientRepository
{
    private readonly DishLabDBContext _context;

    public IngredientRepository(DishLabDBContext context)
    {
        _context = context;
    }

    public async Task<Ingredient?> GetByIdAsync(int id)
    {
        return await _context.Ingredients
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<IEnumerable<Ingredient>> GetByVariationIdAsync(int variationId)
    {
        return await _context.Ingredients
            .Where(i => i.DishVariationId == variationId)
            .ToListAsync();
    }

    public async Task<Ingredient> AddAsync(Ingredient ingredient)
    {
        _context.Ingredients.Add(ingredient);
        await _context.SaveChangesAsync();
        return ingredient;
    }

    public async Task UpdateAsync(Ingredient ingredient)
    {
        _context.Ingredients.Update(ingredient);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Ingredient ingredient)
    {
        _context.Ingredients.Remove(ingredient);
        await _context.SaveChangesAsync();
    }
}