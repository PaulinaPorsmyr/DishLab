using DishLab.API.DTOs;

namespace DishLab.API.DTO.DishDTOs;

public class DishDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int UserId { get; set; }

    public List<DishVariationDto> Variations { get; set; } = new();
}

//DishDto = beskriver vilken information API:t skickar tillbaka när du hämtar en rätt.