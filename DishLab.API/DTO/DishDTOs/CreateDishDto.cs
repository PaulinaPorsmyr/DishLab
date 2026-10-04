using System.ComponentModel.DataAnnotations;

namespace DishLab.API.DTO.DishDTOs;

public class CreateDishDto
{
    [Required]

    // Data annotations används för att ange regler för validering av data.
    // Title måste vara mellan 3 och 100 tecken långt.

    [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters.")]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}

//CreateDishDto = beskriver vilken information API:t vill ta emot när en ny rätt ska skapas.