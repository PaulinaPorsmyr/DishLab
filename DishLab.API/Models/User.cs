using Microsoft.AspNetCore.Identity;
namespace DishLab.API.Models;


    public class User : IdentityUser<int>
{
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();
    //en lista med Dishes så att man enkelt kan hämta alla rätter som tillhör en viss användare
}

