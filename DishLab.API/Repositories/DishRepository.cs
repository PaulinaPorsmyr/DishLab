using DishLab.API.Data;
using DishLab.API.Models;
using DishLab.API.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace DishLab.API.Repositories;

public class DishRepository : IDishRepository
{
    private readonly DishLabDBContext _context;

    public DishRepository(DishLabDBContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Dish>> GetAllByUserIdAsync(int userId) =>
        await _context.Dishes.Where(d => d.UserId == userId).ToListAsync();

    public async Task<Dish?> GetByIdAsync(int id, int userId) =>
        await _context.Dishes.FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

    public async Task CreateAsync(Dish dish)
    {
        _context.Dishes.Add(dish);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Dish dish)
    {
        _context.Dishes.Update(dish);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Dish dish)
    {
        _context.Dishes.Remove(dish);
        await _context.SaveChangesAsync();
    }
}