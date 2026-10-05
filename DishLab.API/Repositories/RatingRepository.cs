using DishLab.API.Data;
using DishLab.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DishLab.API.Repositories;

public class RatingRepository : IRatingRepository
{
    private readonly DishLabDBContext _context;

    public RatingRepository(DishLabDBContext context)
    {
        _context = context;
    }

    public async Task<Rating?> GetByIdAsync(int id)
    {
        return await _context.Ratings
            .Include(r => r.DishVariation)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Rating?> GetByUserAndVariationAsync(int userId, int variationId)
    {
        return await _context.Ratings
            .FirstOrDefaultAsync(r => r.UserId == userId && r.DishVariationId == variationId);
    }

    public async Task<IEnumerable<Rating>> GetByVariationIdAsync(int variationId)
    {
        return await _context.Ratings
            .Where(r => r.DishVariationId == variationId)
            .ToListAsync();
    }

    public async Task<Rating> AddAsync(Rating rating)
    {
        _context.Ratings.Add(rating);
        await _context.SaveChangesAsync();
        return rating;
    }

    public async Task UpdateAsync(Rating rating)
    {
        _context.Ratings.Update(rating);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Rating rating)
    {
        _context.Ratings.Remove(rating);
        await _context.SaveChangesAsync();
    }
}