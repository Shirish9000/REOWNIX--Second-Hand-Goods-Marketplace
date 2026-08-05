namespace PremiumService.DTOs
{
    /// <summary>
    /// Response indicating whether a user is allowed to view another product.
    /// </summary>
    public class CanViewResponseDto
    {
        /// <summary>
        /// User ID.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Indicates whether the user can view another product.
        /// </summary>
        public bool CanView { get; set; }
    }
}
