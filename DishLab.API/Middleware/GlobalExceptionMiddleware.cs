using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DishLab.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate next;

        public GlobalExceptionMiddleware(RequestDelegate _next)
        {
            this.next = _next;
        }

        public async Task InvokeAsync(HttpContext context)
        {

            //await next(context);

            // Denna gör att vi kan gå vidare i request pipeline även om det är ett fel som kastas. Vi kan då hantera felet här istället för att låta det bubbla upp.
            //Det som står innan next(context) är det som händer innan vi går vidare i pipeline, och det som står efter är det som händer efter.

            try
            {
                await next(context);
            }
            catch (Exception)
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                var problemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Internal Server Error",
                    Detail = "An unexpected error occurred. Please try again later or contact support if the problem persists."
                };

                await context.Response.WriteAsJsonAsync(problemDetails);

                //WriteAsJsonAsync är en extension method som gör att vi kan skriva ut ett objekt som JSON till response. 
                //Vi kan då skicka med ett ProblemDetails-objekt som innehåller information om felet.
            }
        }
    }
}
