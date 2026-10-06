using System.ComponentModel.DataAnnotations;

namespace DishLab.API.DTOs
{
    public class CreateIngredientDto
    {
        [Required(ErrorMessage = "Ingrediensens namn är obligatoriskt.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Namnet måste vara mellan 1 och 100 tecken.")]
        public string Name { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Mängden måste vara minst 1.")]
        public int Amount { get; set; }

        [Required(ErrorMessage = "Enhet är obligatorisk (t.ex. g, ml, st).")]
        public string Unit { get; set; } = string.Empty;
    }
}