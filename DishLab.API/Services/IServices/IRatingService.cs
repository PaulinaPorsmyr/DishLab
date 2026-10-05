
using DishLab.API.DTOs;

namespace DishLab.API.Services.IServices;

public interface IRatingService
{
    Task<RatingDto> AddOrUpdateRatingAsync(CreateRatingDto dto, int userId);
    Task<IEnumerable<RatingDto>> GetRatingsForVariationAsync(int variationId);
    Task<bool> DeleteRatingAsync(int ratingId, int userId);
}