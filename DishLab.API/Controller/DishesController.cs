using DishLab.API.DTOs;
using DishLab.API.Services;
using DishLab.API.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DishLab.API.Controllers;

// [Authorize] // Ta bort kommentarstecknen när inloggningen i frontend är klar!
[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly IDishService _dishService;

    // Injecta IDishService istället för DbContext
    public DishesController(IDishService dishService)
    {
        _dishService = dishService;
    }

    // Säker hämtning av UserId (sätter dummy-id 1 om inte inloggad vid testning)
    private int GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }

        // Tillfällig fallback under testfasen om [Authorize] är avstängt
        return 1;
    }

    // GET: api/Dishes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DishDto>>> GetDishes()
    {
        var userId = GetUserId();
        var dishes = await _dishService.GetAllDishesAsync(userId);
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
}