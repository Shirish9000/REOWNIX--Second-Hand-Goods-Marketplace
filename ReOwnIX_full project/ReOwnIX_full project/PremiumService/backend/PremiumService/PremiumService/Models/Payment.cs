using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PremiumService.Models
{
    /// <summary>
    /// Represents a payment made by a user for purchasing a subscription plan.
    /// </summary>
    public class Payment
    {
        /// <summary>
        /// Primary key of the payment.
        /// </summary>
        [Key]
        public int PaymentId { get; set; }

        /// <summary>
        /// Subscription associated with this payment.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage ="SubscriptionId must be graeter tahn 0.")]
        public int SubscriptionId { get; set; }

        /// <summary>
        /// Navigation property for the subscription.
        /// </summary>
        [ForeignKey("SubscriptionId")]
        public Subscription? Subscription { get; set; }

        /// <summary>
        /// Amount paid by the user.
        /// </summary>
        [Required]
        [Range(typeof(decimal), "0.01", "100000", ErrorMessage = "Amount must be greater than 0.")]
        [DataType(DataType.Currency)]
        public decimal Amount { get; set; }

        /// <summary>
        /// Payment method used.
        /// Example: UPI, Credit Card, Debit Card, Net Banking.
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        /// <summary>
        /// Unique transaction identifier returned by the payment gateway.
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string TransactionId { get; set; } = string.Empty;

        /// <summary>
        /// Current payment status.
        /// Example: Pending, Success, Failed.
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string PaymentStatus { get; set; } = "Pending";

        /// <summary>
        /// Date and time when the payment was made (UTC).
        /// </summary>
        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Navigation property for the generated invoice.
        /// </summary>
        [JsonIgnore]
        public Invoice? Invoice { get; set; }

    }
}
