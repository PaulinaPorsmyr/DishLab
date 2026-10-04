using System.ComponentModel.DataAnnotations;

namespace DishLab.API.DTOs
{
    public class CreateRatingDto
    {
        [Range(1, 5)]
        public int Score { get; set; }

        public string? Comment { get; set; }
    }
}