using System.ComponentModel.DataAnnotations;

namespace PremiumService.Models
{
    /// <summary>
    /// Represents the one-time free trial provided to a user.
    /// Users can view up to 10 products before purchasing a subscription.
    /// </summary>
    public class FreeTrial
    {
        /// <summary>
        /// Primary key of the free trial.
        /// </summary>
        [Key]
        public int FreeTrialId { get; set; }

        /// <summary>
        /// ID of the user from the Auth Service.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage ="UserId must be greater than 0.")]
        public int UserId { get; set; }

        /// <summary>
        /// Number of products viewed during the free trial.
        /// Maximum allowed is 10.
        /// </summary>
        [Range(0, 10, ErrorMessage = "Products viewed must be between 0 and 10.")]
        public int ProductsViewed {  get; set; }

        /// <summary>
        /// Indicates whether the free trial has been fully consumed.
        /// </summary>
        public bool IsConsumed { get; set; }

        /// <summary>
        /// Date and time when the free trial was created (UTC).
        /// </summary>
        [Required]
        public DateTime CreatedDate { get; set; }
    }
}
