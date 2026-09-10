using Microsoft.AspNetCore.Identity;
namespace DishLab.API.Models


{
    public class Rating
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public string? Comment { get; set; }
       
        public int DishVariationId { get; set; }
        public DishVariation DishVariation { get; set; } = null!;


        //Koppling till Identity User måste vara string eftersom IdentityUser.Id är en string
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
    }
}
