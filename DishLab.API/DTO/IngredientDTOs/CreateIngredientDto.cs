using System.ComponentModel.DataAnnotations;

namespace DishLab.API.DTOs
{
    public class CreateIngredientDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Amount { get; set; }

        [Required]
        public string Unit { get; set; } = string.Empty;
    }
}