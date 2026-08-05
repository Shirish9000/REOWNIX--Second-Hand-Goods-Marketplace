namespace PremiumService.DTOs
{
    /// <summary>
    /// Response DTO containing plan details.
    /// </summary>
    public class PlanResponseDto
    {
        /// <summary>
        /// Plan ID.
        /// </summary>
        public int PlanId { get; set; }

        /// <summary>
        /// Plan name.
        /// </summary>
        public string PlanName { get; set; } = string.Empty;

        /// <summary>
        /// Plan price.
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// Maximum number of products allowed.
        /// </summary>
        public int ProductLimit { get; set; }

        /// <summary>
        /// Plan duration in days.
        /// </summary>
        public int DurationDays { get; set; }

        /// <summary>
        /// Plan description.
        /// </summary>
        public string? Description { get; set; } = string.Empty;

        /// <summary>
        /// Indicates whether the plan is active.
        /// </summary>
        public bool IsActive { get; set; }
    }
}
