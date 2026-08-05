using System.ComponentModel.DataAnnotations;

namespace PremiumService.DTOs
{
    /// <summary>
    /// Request DTO used to create or update a subscription plan.
    /// </summary>
    public class PlanRequestDto
    {
        /// <summary>
        /// Name of the subscription plan.
        /// </summary>
        [Required(ErrorMessage = "Plan Name is required")]
        [StringLength(50, ErrorMessage = "Plan Name cannot exceed 50 characters.")]
        public string PlanName { get; set; } = string.Empty;

        /// <summary>
        /// Price of the plan.
        /// </summary>
        [Required]
        [Range(typeof(decimal), "0.01", "100000", ErrorMessage = "Price must be greater than 0.")]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }

        /// <summary>
        /// Maximum number of products the user can view.
        /// </summary>
        [Required]
        [Range(1, 1000, ErrorMessage = "Product limit must be greater than 0.")]
        public int ProductLimit { get; set; }

        /// <summary>
        /// Duration of the subscription in days.
        /// </summary>
        [Required]
        [Range(1, 365, ErrorMessage = "Duration must be between 1 and 365 days.")]
        public int DurationDays { get; set; }

        /// <summary>
        /// Optional plan description.
        /// </summary>
        [StringLength(200)]
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Indicates whether the plan is active.
        /// </summary>
        public bool IsActive { get; set; } = true;
    }
}
