namespace DishLab.API.Models
{
    public class Dish
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Koppling till användaren som äger rätten
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;

        //En rätt har flera variationer, men en variation tillhör bara en rätt.
        public ICollection<DishVariation> Variations { get; set; } = new List<DishVariation>();

    }
}
