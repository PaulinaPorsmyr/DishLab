using System.ComponentModel.DataAnnotations;

namespace DishLab.API.DTOs
{
    public class CreateDishVariationDto
    {
        [Required]
        public string CookingMethod { get; set; } = string.Empty;

        [Required]
        public string Outcome { get; set; } = string.Empty;
    }
}