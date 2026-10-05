using DishLab.API.Data;
using DishLab.API.DTO.DishDTOs;
using DishLab.API.Models;
using DishLab.API.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DishLab.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly IDishService _dishService;
    private readonly DishLabDBContext _context;

    public DishesController(IDishService dishService, DishLabDBContext context)
    {
        _dishService = dishService;
        _context = context;
    }

    // Hämtar UserId från den verifierade JWT-token
    private int GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            throw new UnauthorizedAccessException("Giltigt användar-ID saknas i token.");
        }

        return userId;
    }

    // GET: api/Dishes
    [HttpGet]
    public async Task<IActionResult> GetDishes()
    {
        var userId = GetUserId();
        var dishes = await _context.Dishes
            .Where(d => d.UserId == userId)
            .Include(d => d.Ingredients) // <- Lägg till denna!
            .Include(d => d.Variations)
                .ThenInclude(v => v.Ratings)
            .ToListAsync();

        return Ok(dishes);
    }

    // GET: api/Dishes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<DishDto>> GetDish(int id)
    {
        var userId = GetUserId();
        var dish = await _dishService.GetDishByIdAsync(id, userId);

        if (dish == null)
        {
            return NotFound("Rätten hittades inte eller tillhör inte dig.");
        }

        return Ok(dish);
    }

    // POST: api/Dishes
    [HttpPost]
    public async Task<ActionResult<DishDto>> CreateDish(CreateDishDto dto)
    {
        var userId = GetUserId();
        var createdDish = await _dishService.CreateDishAsync(dto, userId);

        return CreatedAtAction(nameof(GetDish), new { id = createdDish.Id }, createdDish);
    }

    // PUT: api/Dishes/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDish(int id, CreateDishDto dto)
    {
        var userId = GetUserId();
        var updated = await _dishService.UpdateDishAsync(id, dto, userId);

        if (!updated)
        {
            return NotFound("Rätten hittades inte eller tillhör inte dig.");
        }

        return NoContent();
    }

    // DELETE: api/Dishes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDish(int id)
    {
        var userId = GetUserId();
        var deleted = await _dishService.DeleteDishAsync(id, userId);

        if (!deleted)
        {
            return NotFound("Rätten hittades inte eller tillhör inte dig.");
        }

        return NoContent();
    }

    // GET: api/Dishes/top
    [HttpGet("top")]
    public async Task<IActionResult> GetTopDishes()
    {
        var userId = GetUserId();

        var topDishes = await _context.Dishes
            .Where(d => d.UserId == userId)
            .Select(d => new
            {
                DishId = d.Id,
                DishName = d.Title,
                AverageRating = d.Variations
                    .SelectMany(v => v.Ratings)
                    .Select(r => (double?)r.Score)
                    .Average() ?? 0,
                TotalRatings = d.Variations.SelectMany(v => v.Ratings).Count()
            })
            .Where(d => d.TotalRatings > 0)
            .OrderByDescending(d => d.AverageRating)
            .Take(5)
            .ToListAsync();

        return Ok(topDishes);
    }


    [HttpPost("{dishId}/ingredients")]
    public async Task<IActionResult> AddIngredientToDish(int dishId, [FromBody] Ingredient ingredient)
    {
        var userId = GetUserId();
        var dish = await _context.Dishes
            .FirstOrDefaultAsync(d => d.Id == dishId && d.UserId == userId);

        if (dish == null)
        {
            return NotFound("Rätten hittades inte.");
        }

        ingredient.DishId = dishId;
        _context.Ingredients.Add(ingredient);
        await _context.SaveChangesAsync();

        return Ok(ingredient);
    }
}