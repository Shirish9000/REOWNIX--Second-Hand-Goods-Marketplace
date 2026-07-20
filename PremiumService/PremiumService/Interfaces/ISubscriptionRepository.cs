using PremiumService.Models;

namespace PremiumService.Interfaces
{
    public interface ISubscriptionRepository
    {
        Task<Subscription?> GetSubscriptionByUserIdAsync(int userId);

        Task AddSubscriptionAsync(Subscription subscription);

        Task UpdateSubscriptionAsync(Subscription subscription);

        Task<bool> SubscriptionExistsAsync(int userId);
    }
}
