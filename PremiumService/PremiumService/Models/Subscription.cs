using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PremiumService.Models
{
    /// <summary>
    /// Represents a user's purchased subscription plan.
    /// </summary>
    public class Subscription
    {
        /// <summary>
        /// Primary key of the subscription.
        /// </summary>
        [Key]
        public int SubscriptionId { get; set; }

        /// <summary>
        /// ID of the user from the Auth Service.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "User ID must be greater than 0.")]
        public int UserId { get; set; }

        /// <summary>
        /// ID of the subscribed plan.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Plan ID must be greater than 0.")]
        public int PlanId { get; set; }

        /// <summary>
        /// Navigation property for the subscribed plan.
        /// </summary>
        [ForeignKey(nameof(PlanId))]
        public Plan? Plan { get; set; }

        /// <summary>
        /// Subscription start date (UTC).
        /// </summary>
        [Required]
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Subscription expiry date (UTC).
        /// </summary>
        [Required]
        public DateTime EndDate { get; set; }


        /// <summary>
        /// Number of products viewed by the user.
        /// </summary>
        [Range(0, int.MaxValue, ErrorMessage = "Products viewed cannot be negative.")] 
        public int ProductsViewed { get; set; }

        /// <summary>
        /// Remaining product views available in the current subscription.
        /// </summary>
        [Range(0, int.MaxValue, ErrorMessage = "Remaining products cannot be negative.")]
        public int RemainingProducts { get; set; }

        /// <summary>
        /// Current subscription status.
        /// Example: Active, Cancelled.
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Active";

        /// <summary>
        /// Indicates whether the subscription should renew automatically.
        /// </summary>
        public bool AutoRenew { get; set; }

        /// <summary>
        /// Navigation property for the payment associated with this subscription.
        /// </summary>
        [JsonIgnore]
        public Payment? Payment { get; set; }
    }
}
