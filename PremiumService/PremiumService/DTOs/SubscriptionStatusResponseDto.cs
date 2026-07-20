namespace PremiumService.DTOs
{
    /// <summary>
    /// Response DTO indicating whether a user's subscription has expired.
    /// </summary>
    public class SubscriptionStatusResponseDto
    {
        /// <summary>
        /// User ID.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Indicates whether the subscription has expired.
        /// </summary>
        public bool IsExpired { get; set; }
    }
}
