using PremiumService.Models;

namespace PremiumService.Interfaces
{
    public interface IPlanRepository
    {
        Task<IEnumerable<Plan>> GetAllPlansAsync();

        Task<Plan?> GetPlanByIdAsync(int id);

        Task AddPlanAsync(Plan plan);

        Task UpdatePlanAsync(Plan plan);    

        Task DeletePlanAsync(int planId);

        Task<bool> PlanExistsAsync(int id);
    }
}
