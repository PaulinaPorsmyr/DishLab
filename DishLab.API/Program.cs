using DishLab.API.Data;
using DishLab.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DishLab.API.Middleware;
using Scalar.AspNetCore;

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
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<SimpleMiddleware>();

// Mappa inbyggda Identity Endpoints (Register, Login m.m.)
app.MapGroup("/auth").MapIdentityApi<User>();

app.MapControllers();

app.Run();