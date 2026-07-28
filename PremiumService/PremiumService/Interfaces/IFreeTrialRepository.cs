using PremiumService.Models;

namespace PremiumService.Interfaces
{
    public interface IFreeTrialRepository
    {
        Task<FreeTrial?> GetFreeTrialByUserIdAsync(int userId);

        Task AddFreeTrialAsync(FreeTrial freeTrial);

        Task UpdateFreeTrialAsync(FreeTrial freeTrial);

        Task<bool> FreeTrialExistsAsync(int userId);
    }
}
