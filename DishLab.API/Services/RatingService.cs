using DishLab.API.DTOs;
using DishLab.API.Models;
using DishLab.API.Repositories;
using DishLab.API.Services.IServices;

namespace DishLab.API.Services;

public class RatingService : IRatingService
{
    private readonly IRatingRepository _ratingRepository;

    public RatingService(IRatingRepository ratingRepository)
    {
        _ratingRepository = ratingRepository;
    }

    public async Task<RatingDto> AddOrUpdateRatingAsync(CreateRatingDto dto, int userId)
    {
        var existing = await _ratingRepository.GetByUserAndVariationAsync(userId, dto.DishVariationId);

        if (existing != null)
        {
            existing.Score = dto.Score;
            existing.Comment = dto.Comment;
            await _ratingRepository.UpdateAsync(existing);

            return new RatingDto
            {
                Id = existing.Id,
                Score = existing.Score,
                Comment = existing.Comment,
                DishVariationId = existing.DishVariationId,
                UserId = existing.UserId
            };
        }

        var rating = new Rating
        {
            Score = dto.Score,
            Comment = dto.Comment,
            DishVariationId = dto.DishVariationId,
            UserId = userId
        };

        var created = await _ratingRepository.AddAsync(rating);

        return new RatingDto
        {
            Id = created.Id,
            Score = created.Score,
            Comment = created.Comment,
            DishVariationId = created.DishVariationId,
            UserId = created.UserId
        };
    }

    public async Task<IEnumerable<RatingDto>> GetRatingsForVariationAsync(int variationId)
    {
        var ratings = await _ratingRepository.GetByVariationIdAsync(variationId);
        return ratings.Select(r => new RatingDto
        {
            Id = r.Id,
            Score = r.Score,
            Comment = r.Comment,
            DishVariationId = r.DishVariationId,
            UserId = r.UserId
        });
    }

    public async Task<bool> DeleteRatingAsync(int ratingId, int userId)
    {
        var rating = await _ratingRepository.GetByIdAsync(ratingId);
        if (rating == null || rating.UserId != userId) return false;

        await _ratingRepository.DeleteAsync(rating);
        return true;
    }
}