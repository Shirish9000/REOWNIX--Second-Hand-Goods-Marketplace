using PremiumService.Interfaces;
using PremiumService.Models;
using Microsoft.Extensions.Logging;

namespace PremiumService.Services
{
    public class PlanService : IPlanService 
    {
        private readonly IPlanRepository _planRepository;
        private readonly ILogger<PlanService> _logger;


        public PlanService(IPlanRepository planRepository, ILogger<PlanService> logger)
        { 
            _planRepository = planRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Plan>> GetAllPlansAsync()
        {
            _logger.LogInformation("Fetching all plans");
            return await _planRepository.GetAllPlansAsync();
        }

        public async Task<Plan?> GetPlanByIdAsync(int id)
        {
            _logger.LogInformation("Fetching plan with ID {PlanId}.", id);
            var plan = await _planRepository.GetPlanByIdAsync(id);

            if (plan == null)
            {
                _logger.LogWarning("Plan {PlanId} not found.", id);
            }

            return plan;
        }

        public async Task AddPlanAsync(Plan plan)
        {
            _logger.LogInformation("Adding new plan: {PlanName}", plan.PlanName);
            await _planRepository.AddPlanAsync(plan);
        }

        public async Task UpdatePlanAsync(Plan plan) 
        {
            _logger.LogInformation("Updating plan with ID {PlanId}.", plan.PlanId);
            await _planRepository.UpdatePlanAsync(plan);
        }

        public async Task DeletePlanAsync(int id)
        {
            _logger.LogInformation("Deleting plan with ID: {PlanId}", id);
            await _planRepository.DeletePlanAsync(id);
        }
    }
    
}

