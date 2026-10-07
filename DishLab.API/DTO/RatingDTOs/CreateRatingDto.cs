namespace DishLab.API.DTOs
{
    public class CreateRatingDto
    {
        public int DishVariationId { get; set; }
        public int Score { get; set; }
        public string? Comment { get; set; }
    }
}