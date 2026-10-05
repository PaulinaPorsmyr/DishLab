namespace DishLab.API.Models
{
    public class Ingredient
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Amount { get; set; }
        public string Unit { get; set; } = string.Empty;

        public int? DishVariationId { get; set; }
        public DishVariation? DishVariation { get; set; }

        
        public int? DishId { get; set; }
        public Dish? Dish { get; set; }
    }
}