using DishLab.API.Data;
using DishLab.API.DTOs;
using DishLab.API.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DishLab.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IngredientsController : ControllerBase
    {
        private readonly IIngredientService _ingredientService;
        private readonly DishLabDBContext _context;

        public IngredientsController(IIngredientService ingredientService, DishLabDBContext context)
        {
            _ingredientService = ingredientService;
            _context = context;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("Giltigt användar-ID saknas i token.");
            }
            return userId;
        }

        [HttpPost("variation/{variationId}")]
        public async Task<IActionResult> Create(int variationId, [FromBody] CreateIngredientDto dto)
        {
            var userId = GetUserId();
            var result = await _ingredientService.CreateAsync(variationId, dto, userId);
            if (result == null) return NotFound("Variationen hittades inte eller tillhör inte dig.");

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var success = await _ingredientService.DeleteAsync(id, userId);
            if (!success) return NotFound();

            return NoContent();
        }

        // GET: api/ingredients/top
        [HttpGet("top")]
        public async Task<IActionResult> GetTopIngredients()
        {
            var userId = GetUserId();

            var topIngredients = await _context.Ingredients
                .Where(i => i.DishVariation.Dish.UserId == userId)
                .GroupBy(i => i.Name)
                .Select(g => new
                {
                    Name = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(i => i.Count)
                .Take(5)
                .ToListAsync();

            return Ok(topIngredients);
        }
    }
}