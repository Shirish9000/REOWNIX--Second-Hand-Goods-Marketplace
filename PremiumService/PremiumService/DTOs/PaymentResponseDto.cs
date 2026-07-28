namespace PremiumService.DTOs
{
    /// <summary>
    /// Response DTO containing payment details.
    /// </summary>
    public class PaymentResponseDto
    {
        /// <summary>
        /// Payment ID.
        /// </summary>
        public int PaymentId { get; set; }

        /// <summary>
        /// Subscription ID associated with the payment.
        /// </summary>
        public int SubscriptionId { get; set; }

        /// <summary>
        /// Amount paid.
        /// </summary>
        public decimal Amount { get; set; }

        /// <summary>
        /// Payment method used.
        /// </summary>
        public string PaymentMethod { get; set; } = string.Empty;

        /// <summary>
        /// Payment gateway transaction ID.
        /// </summary>
        public string? TransactionId { get; set; } = string.Empty;

        /// <summary>
        /// Payment status.
        /// Example: Pending, Success, Failed.
        /// </summary>
        public string PaymentStatus { get; set; } = string.Empty;

        /// <summary>
        /// Date and time when the payment was completed (UTC).
        /// </summary>
        public DateTime PaymentDate { get; set; }
    }
}
