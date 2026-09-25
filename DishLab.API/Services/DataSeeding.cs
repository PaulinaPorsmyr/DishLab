using Microsoft.AspNetCore.Identity;
using DishLab.API.Models;

namespace DishLab.API.Service

{
    public static class DataSeeding
    {
        public static async Task SeedAdminUser(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();

            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            var admin = await userManager.FindByEmailAsync("admin@example.com");

            if (admin != null)
            {
                // Admin user already exists
                return;
            }

            admin = new User
            {
                UserName = "admin@example.com",
                Email = "admin@example.com",
                EmailConfirmed = true
            };

            await userManager.CreateAsync(admin, "Admin@123"); // Set a strong password

            await userManager.AddToRoleAsync(admin, "Admin"); // Assign the admin role

        }
    }
}
