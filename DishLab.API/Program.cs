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
builder.Services.AddIdentityApiEndpoints<User>(options =>
{
    options.User.RequireUniqueEmail = true;

}).AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<DishLabDBContext>();


builder.Services.AddControllers();
builder.Services.AddOpenApi();


builder.Services.AddAuthorization();

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();

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
app.MapIdentityApi<User>();

app.MapControllers();

app.Run();