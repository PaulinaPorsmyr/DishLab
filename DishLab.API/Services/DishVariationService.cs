using Microsoft.EntityFrameworkCore;
using DishLab.API.Data;
using DishLab.API.DTOs;
using DishLab.API.Models;
using DishLab.API.Services.IServices;

namespace DishLab.API.Services
{
    public class DishVariationService : IDishVariationService
    {
        private readonly DishLabDBContext _context;

        public DishVariationService(DishLabDBContext context)
        {
            _context = context;
        }

        public async Task<DishVariationDto?> CreateAsync(int dishId, CreateDishVariationDto dto, int userId)
        {
            var dish = await _context.Dishes
                .FirstOrDefaultAsync(d => d.Id == dishId && d.UserId == userId);

            if (dish == null) return null;

            var variation = new DishVariation
            {
                CookingMethod = dto.CookingMethod,
                Outcome = dto.Outcome,
                DishId = dishId
            };

            _context.DishVariations.Add(variation);
            await _context.SaveChangesAsync();

            return new DishVariationDto
            {
                Id = variation.Id,
                CookingMethod = variation.CookingMethod,
                Outcome = variation.Outcome
            };
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var variation = await _context.DishVariations
                .Include(v => v.Dish)
                .FirstOrDefaultAsync(v => v.Id == id && v.Dish.UserId == userId);

            if (variation == null) return false;

            _context.DishVariations.Remove(variation);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}