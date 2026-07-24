using PremiumService.DTOs;
using PremiumService.Models;

namespace PremiumService.Interfaces
{
    public interface IPlanService
    {
        Task<IEnumerable<Plan>> GetAllPlansAsync();
        Task<Plan?> GetPlanByIdAsync(int planId);
        Task AddPlanAsync(Plan plan);
        Task UpdatePlanAsync(Plan plan);
        Task DeletePlanAsync(int planId);

    }
}
