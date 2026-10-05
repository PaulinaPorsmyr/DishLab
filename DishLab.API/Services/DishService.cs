using DishLab.API.Data;
using DishLab.API.DTO.DishDTOs;
using DishLab.API.DTOs;
using DishLab.API.Models;
using DishLab.API.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace DishLab.API.Services
{
    public class DishService : IDishService
    {
        private readonly DishLabDBContext _context;

        public DishService(DishLabDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DishDto>> GetDishesAsync(int userId)
        {
            return await _context.Dishes
                .Where(d => d.UserId == userId)
                .Select(d => new DishDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    Description = d.Description,
                    UserId = d.UserId,
                    // HÄMTAR VARIANTER, INGREDIENSER OCH BETYG:
                    Variations = d.Variations.Select(v => new DishVariationDto
                    {
                        Id = v.Id,
                        CookingMethod = v.CookingMethod,
                        Outcome = v.Outcome,
                        Ingredients = v.Ingredients.Select(i => new IngredientDto
                        {
                            Id = i.Id,
                            Name = i.Name,
                            Amount = i.Amount,
                            Unit = i.Unit
                        }).ToList(),
                        Ratings = v.Ratings.Select(r => new RatingDto
                        {
                            Id = r.Id,
                            Score = r.Score,
                            Comment = r.Comment
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<DishDto?> GetDishByIdAsync(int id, int userId)
        {
            var dish = await _context.Dishes
                .Where(d => d.Id == id && d.UserId == userId)
                .Select(d => new DishDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    Description = d.Description,
                    UserId = d.UserId,
                    Variations = d.Variations.Select(v => new DishVariationDto
                    {
                        Id = v.Id,
                        CookingMethod = v.CookingMethod,
                        Outcome = v.Outcome,
                        Ingredients = v.Ingredients.Select(i => new IngredientDto
                        {
                            Id = i.Id,
                            Name = i.Name,
                            Amount = i.Amount,
                            Unit = i.Unit
                        }).ToList(),
                        Ratings = v.Ratings.Select(r => new RatingDto
                        {
                            Id = r.Id,
                            Score = r.Score,
                            Comment = r.Comment
                        }).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return dish;
        }

        public async Task<DishDto> CreateDishAsync(CreateDishDto dto, int userId)
        {
            var dish = new Dish
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = userId
            };

            _context.Dishes.Add(dish);
            await _context.SaveChangesAsync();

            return new DishDto
            {
                Id = dish.Id,
                Title = dish.Title,
                Description = dish.Description,
                UserId = dish.UserId,
                Variations = new List<DishVariationDto>()
            };
        }

        public async Task<bool> UpdateDishAsync(int id, CreateDishDto dto, int userId)
        {
            var dish = await _context.Dishes
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (dish == null) return false;

            dish.Title = dto.Title;
            dish.Description = dto.Description;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDishAsync(int id, int userId)
        {
            var dish = await _context.Dishes
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (dish == null) return false;

            _context.Dishes.Remove(dish);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}