using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DishLab.API.Migrations
{
    /// <inheritdoc />
    public partial class AddIngredientsToDish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ingredients_DishVariations_DishVariationId",
                table: "Ingredients");

            migrationBuilder.AlterColumn<int>(
                name: "DishVariationId",
                table: "Ingredients",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "DishId",
                table: "Ingredients",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_DishId",
                table: "Ingredients",
                column: "DishId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ingredients_DishVariations_DishVariationId",
                table: "Ingredients",
                column: "DishVariationId",
                principalTable: "DishVariations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Ingredients_Dishes_DishId",
                table: "Ingredients",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ingredients_DishVariations_DishVariationId",
                table: "Ingredients");

            migrationBuilder.DropForeignKey(
                name: "FK_Ingredients_Dishes_DishId",
                table: "Ingredients");

            migrationBuilder.DropIndex(
                name: "IX_Ingredients_DishId",
                table: "Ingredients");

            migrationBuilder.DropColumn(
                name: "DishId",
                table: "Ingredients");

            migrationBuilder.AlterColumn<int>(
                name: "DishVariationId",
                table: "Ingredients",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Ingredients_DishVariations_DishVariationId",
                table: "Ingredients",
                column: "DishVariationId",
                principalTable: "DishVariations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
