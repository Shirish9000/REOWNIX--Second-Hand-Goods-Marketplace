using Microsoft.EntityFrameworkCore;
using PremiumService.Data;
using PremiumService.Interfaces;
using PremiumService.Models;
using Microsoft.Extensions.Logging;

namespace PremiumService.Repositories
{
    public class PlanRepository : IPlanRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PlanRepository> _logger;


        public PlanRepository(ApplicationDbContext context, ILogger<PlanRepository> logger)
        { 
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Plan>> GetAllPlansAsync()
        {
            _logger.LogInformation("Fetching all plans from database.");
            return await _context.Plans.AsNoTracking().ToListAsync();
        }


        public async Task<Plan?> GetPlanByIdAsync(int id)
        {
            _logger.LogInformation("Fetching plan with ID {PlanId} from database.", id);
            return await _context.Plans.FindAsync(id);
        }

        public async Task AddPlanAsync(Plan plan)
        {
            _logger.LogInformation("Adding plan {PlanName} to database.", plan.PlanName);
            await _context.Plans.AddAsync(plan);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Plan {PlanName} added successfully.", plan.PlanName);

        }

        public async Task UpdatePlanAsync(Plan plan)
        {
            _logger.LogInformation("Updating plan ID {PlanId}.", plan.PlanId);
            _context.ChangeTracker.Clear();
            _context.Plans.Update(plan);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Plan ID {PlanId} updated successfully.", plan.PlanId);
        }

        public async Task DeletePlanAsync(int id)
        {
            _logger.LogInformation("Deleting plan ID {PlanId}.", id);
            var plan = await _context.Plans.FindAsync(id);

            if (plan != null)
            { 
                _context.Plans.Remove(plan);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Plan ID {PlanId} deleted successfully.",id);
            }
            else
            {
                _logger.LogWarning(
                    "Plan ID {PlanId} not found.",
                    id);
            }
        }

        public async Task<bool> PlanExistsAsync(int id)
        {
            _logger.LogInformation( "Checking existence of plan ID {PlanId}.",id);
            return await _context.Plans.AnyAsync(x => x.PlanId == id);
        }
    }
}
