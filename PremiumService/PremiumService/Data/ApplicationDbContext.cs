using Microsoft.EntityFrameworkCore;
using PremiumService.Models;

namespace PremiumService.Data
{
    /// <summary>
    /// Database context for PremiumService.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of ApplicationDbContext.
        /// </summary>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Subscription plans.
        /// </summary>
        public DbSet<Plan> Plans { get; set; }

        /// <summary>
        /// User subscriptions.
        /// </summary>
        public DbSet<Subscription> Subscriptions { get; set; }

        /// <summary>
        /// Payments.
        /// </summary>
        public DbSet<Payment> Payments { get; set; }

        /// <summary>
        /// Invoices.
        /// </summary>
        public DbSet<Invoice> Invoices { get; set; }

        /// <summary>
        /// Free trial records.
        /// </summary>
        public DbSet<FreeTrial> FreeTrials { get; set; }

        /// <summary>
        /// Configures entities and seeds initial data.
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // One-to-One Relationship
            modelBuilder.Entity<Payment>()
               .HasOne(p => p.Invoice)
               .WithOne(i => i.Payment)
               .HasForeignKey<Invoice>(i => i.PaymentId)
               .OnDelete(DeleteBehavior.Cascade);

            // Seed Plans
            modelBuilder.Entity<Plan>().HasData(

                new Plan
                {
                    PlanId = 1,
                    PlanName = "Own",
                    Price = 799,
                    ProductLimit = 50,
                    DurationDays = 30,
                    Description = "Browse up to 50 products",
                    IsActive = true
                },

                new Plan
                {
                    PlanId = 2,
                    PlanName = "ReOwn",
                    Price = 999,
                    ProductLimit = 75,
                    DurationDays = 30,
                    Description = "Browse up to 75 products",
                    IsActive = true
                },

                new Plan
                {
                    PlanId = 3,
                    PlanName = "ReOwn Max",
                    Price = 1399,
                    ProductLimit = 100,
                    DurationDays = 30,
                    Description = "Browse up to 100 products",
                    IsActive = true
                }

            );

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Invoice)
                .WithOne(i => i.Payment)
                .HasForeignKey<Invoice>(i => i.PaymentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}