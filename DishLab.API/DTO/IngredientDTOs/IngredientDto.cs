namespace DishLab.API.DTOs
{
    public class IngredientDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
    }
}