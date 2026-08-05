namespace PremiumService.DTOs
{
    /// <summary>
    /// Response DTO containing subscription information.
    /// </summary>
    public class SubscriptionResponseDto
    {
        /// <summary>
        /// Subscription ID.
        /// </summary>
        public int SubscriptionId { get; set; }

        /// <summary>
        /// User ID.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Plan ID.
        /// </summary>
        public int PlanId { get; set; }

        /// <summary>
        /// Subscription start date (UTC).
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Subscription expiry date (UTC).
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Number of products viewed.
        /// </summary>
        public int ProductsViewed { get; set; }

        /// <summary>
        /// Remaining product views.
        /// </summary>
        public int RemainingProducts { get; set; }

        /// <summary>
        /// Current subscription status.
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Indicates whether auto-renew is enabled.
        /// </summary>
        public bool AutoRenew { get; set; }
    }
}
