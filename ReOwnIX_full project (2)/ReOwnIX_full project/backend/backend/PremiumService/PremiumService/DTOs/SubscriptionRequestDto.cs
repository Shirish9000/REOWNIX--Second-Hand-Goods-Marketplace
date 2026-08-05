using System.ComponentModel.DataAnnotations;

namespace PremiumService.DTOs
{
    /// <summary>
    /// Request DTO used to create a new subscription.
    /// </summary>
    public class SubscriptionRequestDto
    {

        /// <summary>
        /// User ID.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be greater than 0.")]
        public int UserId { get; set; }

        /// <summary>
        /// Plan ID.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "PlanId must be greater than 0.")]
        public int PlanId { get; set; }

        /// <summary>
        /// Indicates whether auto-renew is enabled.
        /// </summary>
        public bool AutoRenew { get; set; }
    }
}
