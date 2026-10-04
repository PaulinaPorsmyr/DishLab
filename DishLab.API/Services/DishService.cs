using DishLab.API.Data;
using DishLab.API.DTO.DishDTOs;
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
                    Description = d.Description
                })
                .ToListAsync();
        }

        public async Task<DishDto?> GetDishByIdAsync(int id, int userId)
        {
            var dish = await _context.Dishes
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (dish == null) return null;

            return new DishDto
            {
                Id = dish.Id,
                Title = dish.Title,
                Description = dish.Description
            };
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
                Description = dish.Description
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