namespace PremiumService.DTOs
{
    /// <summary>
    /// Response DTO containing invoice details.
    /// </summary>
    public class InvoiceResponseDto
    {
        /// <summary>
        /// Invoice ID.
        /// </summary>
        public int InvoiceId { get; set; }

        /// <summary>
        /// Associated Payment ID.
        /// </summary>
        public int PaymentId { get; set; }

        /// <summary>
        /// Unique invoice number.
        /// </summary>
        public string InvoiceNumber { get; set; } = string.Empty;

        /// <summary>
        /// Date and time when the invoice was generated (UTC).
        /// </summary>
        public DateTime InvoiceDate { get; set; }
    }
}
