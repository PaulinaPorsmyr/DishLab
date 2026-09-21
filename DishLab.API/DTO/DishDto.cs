namespace DishLab.API.DTOs;

public class DishDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int UserId { get; set; } 
}

//DishDto = beskriver vilken information API:t skickar tillbaka när du hämtar en rätt.