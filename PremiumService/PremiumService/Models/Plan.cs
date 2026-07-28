using System.ComponentModel.DataAnnotations;

namespace PremiumService.Models
{
    public class Plan
    {
        [Key]
        public int PlanId { get; set; }

        [Required]
        [MaxLength(100)]
        public string PlanName { get; set; } = string.Empty;

        [DataType(DataType.Currency)]
        [Range(typeof(decimal),"0.01", "100000", ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }

        [Range(1,1000, ErrorMessage = "Product Limit must be grater than 0.")]
        public int ProductLimit { get; set; }

        [Range(1, 365, ErrorMessage = "Duration must be at least 1 day.")]
        public int DurationDays { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        //Navigation property
        public ICollection<Subscription> Subscriptions {  get; set; } = new List <Subscription>();
    }
}
