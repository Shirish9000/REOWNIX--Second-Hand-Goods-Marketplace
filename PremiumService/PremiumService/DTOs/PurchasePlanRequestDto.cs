using System.ComponentModel.DataAnnotations;

namespace PremiumService.DTOs
{
    /// <summary>
    /// Request DTO used to purchase a subscription plan.
    /// </summary>
    public class PurchasePlanRequestDto
    {
        /// <summary>
        /// User ID.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "UserId must be greater than 0.")]
        public int UserId { get; set; }

        /// <summary>
        /// Plan ID to purchase.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "PlanId must be greater than 0.")]
        public int PlanId { get; set; }
    }
}
