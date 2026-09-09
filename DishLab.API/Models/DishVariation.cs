namespace DishLab.API.Models
{
    public class DishVariation
    {
        public int Id { get; set; }
        public string CookingMethod { get; set; } = string.Empty;
        public string Outcome { get; set; } = string.Empty;


        // Koppling till huvudrätt (Dish)
        public int DishId { get; set; }
        public Dish Dish { get; set; } = null!;

        // En variation har egna ingredienser och betyg
        public ICollection<Ingredient> Ingredients { get; set; } = new List<Ingredient>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }
}
