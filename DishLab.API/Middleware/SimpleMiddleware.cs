namespace DishLab.API.Middleware
{
    public class SimpleMiddleware
    {
        private readonly RequestDelegate _next;

        public SimpleMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Log request
            Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");

            await _next(context);

            // Log response
            Console.WriteLine($"Response: {context.Response.StatusCode}");
        }
    }
}
