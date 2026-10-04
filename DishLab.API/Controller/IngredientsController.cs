using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using DishLab.API.Services.IServices;
using DishLab.API.DTOs;

namespace DishLab.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IngredientsController : ControllerBase
    {
        private readonly IIngredientService _ingredientService;

        public IngredientsController(IIngredientService ingredientService)
        {
            _ingredientService = ingredientService;
        }

        [HttpPost("variation/{variationId}")]
        public async Task<IActionResult> Create(int variationId, [FromBody] CreateIngredientDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _ingredientService.CreateAsync(variationId, dto, userId);
            if (result == null) return NotFound("Variationen hittades inte eller tillhör inte dig.");

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var success = await _ingredientService.DeleteAsync(id, userId);
            if (!success) return NotFound();

            return NoContent();
        }
    }
}