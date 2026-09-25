using DishLab.API.DTOs;
using DishLab.API.Models;
using DishLab.API.Repositories.IRepositories;
using DishLab.API.Services.IServices;

namespace DishLab.API.Services;

public class DishService : IDishService
{
    private readonly IDishRepository _dishRepository;

    public DishService(IDishRepository dishRepository)
    {
        _dishRepository = dishRepository;
    }

    public async Task<IEnumerable<DishDto>> GetAllDishesForUserAsync(int userId)
    {
        var dishes = await _dishRepository.GetAllByUserIdAsync(userId);
        return dishes.Select(d => new DishDto
        {
            Id = d.Id,
            Title = d.Title,
            Description = d.Description,
            UserId = d.UserId
        });
    }

    public async Task<DishDto?> GetDishByIdAsync(int id, int userId)
    {
        var dish = await _dishRepository.GetByIdAsync(id, userId);
        if (dish == null) return null;

        return new DishDto
        {
            Id = dish.Id,
            Title = dish.Title,
            Description = dish.Description,
            UserId = dish.UserId
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

        await _dishRepository.CreateAsync(dish);

        return new DishDto
        {
            Id = dish.Id,
            Title = dish.Title,
            Description = dish.Description,
            UserId = dish.UserId
        };
    }

    public async Task<bool> UpdateDishAsync(int id, CreateDishDto dto, int userId)
    {
        var dish = await _dishRepository.GetByIdAsync(id, userId);
        if (dish == null) return false;

        dish.Title = dto.Title;
        dish.Description = dto.Description;

        await _dishRepository.UpdateAsync(dish);
        return true;
    }

    public async Task<bool> DeleteDishAsync(int id, int userId)
    {
        var dish = await _dishRepository.GetByIdAsync(id, userId);
        if (dish == null) return false;

        await _dishRepository.DeleteAsync(dish);
        return true;
    }
}