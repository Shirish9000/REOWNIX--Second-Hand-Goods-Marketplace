namespace PremiumService.DTOs
{
    /// <summary>
    /// Standard API response wrapper used across all endpoints.
    /// </summary>
    /// <typeparam name="T">Type of response data.</typeparam>
    public class ApiResponse<T>
    {
        /// <summary>
        /// Indicates whether the API request was successful.
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Response message describing the result.
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Response payload.
        /// </summary>
        public T? Data { get; set; }
    }
}
