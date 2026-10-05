using DishLab.API.Data;
using DishLab.API.Models;
using DishLab.API.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace DishLab.API.Repositories;

public class DishVariationRepository : IDishVariationRepository
{
    private readonly DishLabDBContext _context;

    public DishVariationRepository(DishLabDBContext context)
    {
        _context = context;
    }

    public async Task<DishVariation?> GetByIdAsync(int id)
    {
        return await _context.DishVariations
            .Include(v => v.Ingredients)
            .Include(v => v.Ratings)
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<IEnumerable<DishVariation>> GetByDishIdAsync(int dishId)
    {
        return await _context.DishVariations
            .Include(v => v.Ingredients)
            .Include(v => v.Ratings)
            .Where(v => v.DishId == dishId)
            .ToListAsync();
    }

    public async Task<DishVariation> AddAsync(DishVariation variation)
    {
        _context.DishVariations.Add(variation);
        await _context.SaveChangesAsync();
        return variation;
    }

    public async Task UpdateAsync(DishVariation variation)
    {
        _context.DishVariations.Update(variation);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(DishVariation variation)
    {
        _context.DishVariations.Remove(variation);
        await _context.SaveChangesAsync();
    }
}