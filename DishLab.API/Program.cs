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
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<DishLabDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddIdentityApiEndpoints<User>(options =>
{
    options.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole<int>>()
.AddEntityFrameworkStores<DishLabDBContext>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});


builder.Services.AddScoped<IDishRepository, DishRepository>();
builder.Services.AddScoped<IDishVariationRepository, DishVariationRepository>();
builder.Services.AddScoped<IIngredientRepository, IngredientRepository>();
builder.Services.AddScoped<IRatingRepository, RatingRepository>();

builder.Services.AddScoped<IDishService, DishService>();
builder.Services.AddScoped<IIngredientService, IngredientService>();
builder.Services.AddScoped<IDishVariationService, DishVariationService>();
builder.Services.AddScoped<IRatingService, RatingService>();


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddOpenApi();
builder.Services.AddAuthorization();


var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? new[]
{
    "http://localhost:5173",
    "https://dishlab-frontend-hyabdycravejayb5.norwayeast-01.azurewebsites.net"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<SimpleMiddleware>();

// Aktivera Scalar i både Dev och Azure 
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseCors("FrontendDev");

app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("/auth").MapIdentityApi<User>();
app.MapControllers();

app.Run();
