using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PremiumService.Models
{
    /// <summary>
    /// Represents an invoice generated after a successful payment.
    /// </summary>
    public class Invoice
    {
        /// <summary>
        /// Primary key of the invoice.
        /// </summary>
        [Key]
        public int InvoiceId { get; set; }

        /// <summary>
        /// Payment associated with this invoice.
        /// </summary>
        [Required]
        [Range(1,int.MaxValue, ErrorMessage ="Payment must be greater tahn 0.")]
        public int PaymentId { get; set; }

        /// <summary>
        /// Navigation property for the payment.
        /// </summary>

        [ForeignKey("PaymentId")]
        public Payment? Payment { get; set; }

        /// <summary>
        /// Navigation property for the payment.
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string InvoiceNumber { get; set; } = string.Empty;

        /// <summary>
        /// Date and time when the invoice was generated (UTC).
        /// </summary>
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
    }
}

