using System.ComponentModel.DataAnnotations;

namespace PremiumService.DTOs
{
    /// <summary>
    /// Request DTO used to generate an invoice for a payment.
    /// </summary>
    public class InvoiceRequestDto
    {
        /// <summary>
        /// Payment ID for which the invoice is generated.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Payment ID must be greater than 0.")]
        public int PaymentId { get; set; }
    }
}
