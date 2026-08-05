using PremiumService.Models;

namespace PremiumService.Interfaces
{
    public interface ISubscriptionService
    {
        Task<bool> CanViewProductAsync(int userId);
        Task<bool> PurchasePlanAsync(int userId, int planId);
        Task<int> GetRemainingProductsAsync(int userId);
        Task<bool> IsSubscriptionExpiredAsync(int userId);

        Task<bool> RecordProductViewAsync(int userId);

        Task<Subscription?> GetSubscriptionByUserIdAsync(int userId);

        Task<bool> RenewSubscriptionAsync(int userId);

        Task<bool> CancelSubscriptionAsync(int userId);
    }
}
