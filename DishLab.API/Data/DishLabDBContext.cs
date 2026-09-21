using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using DishLab.API.Models;
namespace DishLab.API.Data

{
    public class DishLabDBContext : IdentityDbContext<User, IdentityRole<int>, int>

    {

        public DishLabDBContext(DbContextOptions<DishLabDBContext> options) : base(options)
        {
        }


        public DbSet<Dish> Dishes { get; set; }
        public DbSet<DishVariation> DishVariations { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole<int>>().HasData(
                new IdentityRole<int> 
                { 
                    Id = 1, 
                    Name = "Admin", 
                    NormalizedName = "ADMIN" 

                });



            // Bryt kaskadraderingscykeln för Rating -> User
            builder.Entity<Rating>()
                .HasOne(r => r.User)
                .WithMany(u => u.Ratings)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Ändrat till Restrict
        }
    }


}
