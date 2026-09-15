using System.ComponentModel.DataAnnotations;

namespace DishLab.API.DTOs;

public class CreateDishDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}