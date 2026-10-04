using DishLab.API.DTOs;
using DishLab.API.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DishLab.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class VariationsController : ControllerBase
    {
        private readonly IDishVariationService _variationService;

        public VariationsController(IDishVariationService variationService)
        {
            _variationService = variationService;
        }

        [HttpPost("dish/{dishId}")]
        public async Task<IActionResult> Create(int dishId, [FromBody] CreateDishVariationDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _variationService.CreateAsync(dishId, dto, userId);
            if (result == null) return NotFound("Rätten hittades inte eller tillhör inte dig.");

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var success = await _variationService.DeleteAsync(id, userId);
            if (!success) return NotFound();

            return NoContent();
        }
    }
}