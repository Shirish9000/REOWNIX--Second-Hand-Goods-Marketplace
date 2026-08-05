using PremiumService.DTOs;
using System.Net;
using System.Text.Json;

namespace PremiumService.Middleware
{
    /// <summary>
    /// Global exception handling middleware.
    /// </summary>
    public class ExceptionMiddleware
    {

        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context) 
        {
            try
            {
                await _next(context);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Unhandled Exception");

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var response = new ApiResponse<object>
                {
                    Success = false,
                    Message = "An unexpected error occurred",
                    Data = null
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }
    }
}
