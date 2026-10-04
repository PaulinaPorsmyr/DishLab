using Microsoft.EntityFrameworkCore;
using DishLab.API.Data;
using DishLab.API.DTOs;
using DishLab.API.Models;

namespace DishLab.API.Services.IServices
{
    public class IngredientService : IIngredientService
    {
        private readonly DishLabDBContext _context;

        public IngredientService(DishLabDBContext context)
        {
            _context = context;
        }

        public async Task<IngredientDto?> CreateAsync(int variationId, CreateIngredientDto dto, int userId)
        {
            var variation = await _context.DishVariations
                .Include(v => v.Dish)
                .FirstOrDefaultAsync(v => v.Id == variationId && v.Dish.UserId == userId);

            if (variation == null) return null;

            var ingredient = new Ingredient
            {
                Name = dto.Name,
                Amount = dto.Amount,
                Unit = dto.Unit,
                DishVariationId = variationId
            };

            _context.Ingredients.Add(ingredient);
            await _context.SaveChangesAsync();

            return new IngredientDto
            {
                Id = ingredient.Id,
                Name = ingredient.Name,
                Amount = ingredient.Amount,
                Unit = ingredient.Unit
            };
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var ingredient = await _context.Ingredients
                .Include(i => i.DishVariation)
                .ThenInclude(v => v.Dish)
                .FirstOrDefaultAsync(i => i.Id == id && i.DishVariation.Dish.UserId == userId);

            if (ingredient == null) return false;

            _context.Ingredients.Remove(ingredient);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}