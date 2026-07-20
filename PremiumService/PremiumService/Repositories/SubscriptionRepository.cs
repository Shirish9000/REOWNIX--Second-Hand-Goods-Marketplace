using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PremiumService.Data;
using PremiumService.Interfaces;
using PremiumService.Models;
using Microsoft.Extensions.Logging;

namespace PremiumService.Repositories
{
    public class SubscriptionRepository : ISubscriptionRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SubscriptionRepository> _logger;

        public SubscriptionRepository(ApplicationDbContext context,ILogger<SubscriptionRepository> logger)
        { 
            _context = context;
            _logger = logger;
        }

        public async Task<Subscription?> GetSubscriptionByUserIdAsync(int userId)
        {
            _logger.LogInformation("Fetching active subscription for User ID {UserId}.",userId);
            return await _context.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.UserId == userId &&
                            s.Status == "Active" &&
                            s.EndDate > DateTime.UtcNow)
                .OrderByDescending(s => s.StartDate)
                .FirstOrDefaultAsync();
        }

        public async Task UpdateSubscriptionAsync(Subscription subscription)
        {
            _logger.LogInformation("Updating subscription ID {SubscriptionId}.",subscription.SubscriptionId);
            _context.Subscriptions.Update(subscription);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Subscription ID {SubscriptionId} updated successfully.",subscription.SubscriptionId);
        }  

     

        public async Task<bool> SubscriptionExistsAsync(int userId)
        {
            _logger.LogInformation("Checking subscription existence for User ID {UserId}.",userId);
            return await _context.Subscriptions.AnyAsync(s => s.UserId == userId);
        }

        public async Task AddSubscriptionAsync(Subscription subscription)
        {
            _logger.LogInformation("Creating subscription for User ID {UserId}.",subscription.UserId);
            await _context.Subscriptions.AddAsync(subscription);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Subscription created successfully. Subscription ID {SubscriptionId}.",subscription.SubscriptionId);
        }

    }
}