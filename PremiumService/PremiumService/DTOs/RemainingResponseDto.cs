namespace PremiumService.DTOs
{
    /// <summary>
    /// Response DTO containing the remaining product views for a user.
    /// </summary>
    public class RemainingResponseDto
    {
        /// <summary>
        /// User ID.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Remaining number of product views.
        /// </summary>
        public int RemainingProducts { get; set; }
    }
}
