using System.ComponentModel.DataAnnotations;

namespace PremiumService.DTOs
{
    /// <summary>
    /// Request DTO used to process a payment for a subscription plan.
    /// </summary>
    public class PaymentRequestDto
    {
        /// <summary>
        /// User ID.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "UserId must be greater than 0.")]
        public int UserId { get; set; }

        /// <summary>
        /// Selected plan ID.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "PlanId must be greater than 0.")]
        public int PlanId { get; set; }

        /// <summary>
        /// Amount to be paid.
        /// </summary>
        [Required]
        [Range(typeof(decimal), "0.01", "1000000", ErrorMessage = "Amount must be greater than 0.")]
        [DataType(DataType.Currency)]
        public decimal Amount   { get; set; }

        /// <summary>
        /// Payment method.
        /// Example: UPI, Credit Card, Debit Card, Net Banking.
        /// </summary>
        [Required(ErrorMessage = "Payment Method is required.")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Payment Method cannot exceed 30 characters.")]
        public string PaymentMethod { get; set; } = string.Empty;
    }
}

