namespace DishLab.API.DTOs
{
    public class DishVariationDto
    {
        public int Id { get; set; }
        public string CookingMethod { get; set; } = string.Empty;
        public string Outcome { get; set; } = string.Empty;
        public List<IngredientDto> Ingredients { get; set; } = new();
        public List<RatingDto> Ratings { get; set; } = new();
    }
}