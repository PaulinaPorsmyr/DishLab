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
    public class VariationsController : ControllerBase
    {
        private readonly IDishVariationService _variationService;
        private readonly DishLabDBContext _context;

        public VariationsController(IDishVariationService variationService, DishLabDBContext context)
        {
            _variationService = variationService;
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

        [HttpPost("dish/{dishId}")]
        public async Task<IActionResult> Create(int dishId, [FromBody] CreateDishVariationDto dto)
        {
            var userId = GetUserId();
            var result = await _variationService.CreateAsync(dishId, dto, userId);
            if (result == null) return NotFound("Rätten hittades inte eller tillhör inte dig.");

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var success = await _variationService.DeleteAsync(id, userId);
            if (!success) return NotFound();

            return NoContent();
        }

        // GET: api/variations/top
        [HttpGet("top")]
        public async Task<IActionResult> GetTopCookingMethods()
        {
            var userId = GetUserId();

            var topMethods = await _context.DishVariations
                .Where(v => v.Dish.UserId == userId && !string.IsNullOrEmpty(v.CookingMethod))
                .GroupBy(v => v.CookingMethod)
                .Select(g => new
                {
                    Name = g.Key,
                    AverageRating = g.SelectMany(v => v.Ratings).Select(r => (double?)r.Score).Average() ?? 0,
                    Count = g.Count()
                })
                .OrderByDescending(m => m.AverageRating)
                .Take(5)
                .ToListAsync();

            return Ok(topMethods);
        }
    }
}