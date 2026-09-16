using System.Security.Claims;
using DishLab.API.Data;
using DishLab.API.DTOs;
using DishLab.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DishLab.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DishesController : ControllerBase
{
    private readonly DishLabDBContext _context;

    public DishesController(DishLabDBContext context)
    {
        _context = context;
    }

    // Helper-metod för att hämta ID på den inloggade användaren från JWT/Cookie
    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

                
    
                // GET: api/dishes (Hämta alla rätter för den inloggade användaren)
                [HttpGet]
                public async Task<ActionResult<IEnumerable<DishDto>>> GetDishes()
                {
                    var userId = GetUserId();

                    var dishes = await _context.Dishes
                        .Where(d => d.UserId == userId)
                        .Select(d => new DishDto
                        {
                            Id = d.Id,
                            Title = d.Title,
                            Description = d.Description,
                            UserId = d.UserId
                        })
                        .ToListAsync();

                    return Ok(dishes);
                }

                // GET: api/dishes/5 (Hämta en specifik rätt)
                [HttpGet("{id}")]
                public async Task<ActionResult<DishDto>> GetDish(int id)
                {
                    var userId = GetUserId();

                    var dish = await _context.Dishes
                        .Where(d => d.Id == id && d.UserId == userId)
                        .Select(d => new DishDto
                        {
                            Id = d.Id,
                            Title = d.Title,
                            Description = d.Description,
                            UserId = d.UserId
                        })
                        .FirstOrDefaultAsync();

                    if (dish == null)
                    {
                        return NotFound("Rätten hittades inte eller tillhör inte dig.");
                    }

                    return Ok(dish);
                }



                // POST: api/dishes (Skapa en ny rätt)
                [HttpPost]
                public async Task<ActionResult<DishDto>> CreateDish(CreateDishDto dto)
                {
                    var userId = GetUserId();

                    var dish = new Dish
                    {
                        Title = dto.Title,
                        Description = dto.Description,
                        UserId = userId
                    };

                    _context.Dishes.Add(dish);
                    await _context.SaveChangesAsync();

                    var responseDto = new DishDto
                    {
                        Id = dish.Id,
                        Title = dish.Title,
                        Description = dish.Description,
                        UserId = dish.UserId
                    };

                    return CreatedAtAction(nameof(GetDish), new { id = dish.Id }, responseDto);
                }



                // PUT: api/dishes/5 (Uppdatera en befintlig rätt)
                [HttpPut("{id}")]
                public async Task<IActionResult> UpdateDish(int id, CreateDishDto dto)
                {
                    var userId = GetUserId();

                    var dish = await _context.Dishes.FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

                    if (dish == null)
                    {
                        return NotFound("Rätten hittades inte eller tillhör inte dig.");
                    }

                    dish.Title = dto.Title;
                    dish.Description = dto.Description;

                    await _context.SaveChangesAsync();

                    return NoContent();
                }



                // DELETE: api/dishes/5 (Ta bort en rätt)
                [HttpDelete("{id}")]
                public async Task<IActionResult> DeleteDish(int id)
                {
                    var userId = GetUserId();

                    var dish = await _context.Dishes.FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

                    if (dish == null)
                    {
                        return NotFound("Rätten hittades inte eller tillhör inte dig.");
                    }

                    _context.Dishes.Remove(dish);
                    await _context.SaveChangesAsync();

                    return NoContent();
                }
}