using DishLab.API.DTOs;
using DishLab.API.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DishLab.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingsController(IRatingService ratingService)
    {
        _ratingService = ratingService;
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

    // POST: api/Ratings
    [HttpPost]
    public async Task<ActionResult<RatingDto>> AddOrUpdateRating(CreateRatingDto dto)
    {
        var userId = GetUserId();
        var result = await _ratingService.AddOrUpdateRatingAsync(dto, userId);
        return Ok(result);
    }

    // GET: api/Ratings/variation/5
    [HttpGet("variation/{variationId}")]
    public async Task<ActionResult<IEnumerable<RatingDto>>> GetRatingsForVariation(int variationId)
    {
        var ratings = await _ratingService.GetRatingsForVariationAsync(variationId);
        return Ok(ratings);
    }

    // DELETE: api/Ratings/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRating(int id)
    {
        var userId = GetUserId();
        var deleted = await _ratingService.DeleteRatingAsync(id, userId);

        if (!deleted)
        {
            return NotFound("Betyget hittades inte eller tillhör inte dig.");
        }

        return NoContent();
    }
}