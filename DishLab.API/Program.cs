using DishLab.API.Data;
using DishLab.API.Middleware;
using DishLab.API.Models;
using DishLab.API.Repositories;
using DishLab.API.Repositories.IRepositories;
using DishLab.API.Services;
using DishLab.API.Services.IServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Databas
builder.Services.AddDbContext<DishLabDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentityApiEndpoints<User>(options =>
{
    options.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole<int>>()
.AddEntityFrameworkStores<DishLabDBContext>();

// Repositories
builder.Services.AddScoped<IDishRepository, DishRepository>();

// Services (Registrera alla tre servicat här)
builder.Services.AddScoped<IDishService, DishService>();
builder.Services.AddScoped<IIngredientService, IngredientService>();
builder.Services.AddScoped<IDishVariationService, DishVariationService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddAuthorization();

// CORS för React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseCors("FrontendDev");

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<SimpleMiddleware>();

app.MapGroup("/auth").MapIdentityApi<User>();
app.MapControllers();

app.Run();