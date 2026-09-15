using DishLab.API.Data;
using DishLab.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Registrera DbContext med SQL Server
builder.Services.AddDbContext<DishLabDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registrera Identity för User
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<DishLabDBContext>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    //27 augusti tid 02.18

    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
    Console.WriteLine($"Response: {context.Response.StatusCode}");
});

// Mappa inbyggda Identity Endpoints (Register, Login m.m.)
app.MapGroup("/auth").MapIdentityApi<User>();

app.MapControllers();

app.Run();