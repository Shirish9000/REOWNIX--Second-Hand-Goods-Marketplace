using Microsoft.EntityFrameworkCore;
using PremiumService.Data;
using PremiumService.Interfaces;
using PremiumService.Models;
using Microsoft.Extensions.Logging;

namespace PremiumService.Repositories
{
    public class FreeTrialRepository : IFreeTrialRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FreeTrialRepository> _logger;

        public FreeTrialRepository(ApplicationDbContext context, ILogger<FreeTrialRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<FreeTrial?> GetFreeTrialByUserIdAsync(int userId)
        {
            _logger.LogInformation("Fetching free trial for User ID {UserId}.",userId);
            return await _context.FreeTrials.FirstOrDefaultAsync(f => f.UserId == userId);
        }

        public async Task AddFreeTrialAsync(FreeTrial freeTrial)
        {
            _logger.LogInformation("Creating free trial for User ID {UserId}.",freeTrial.UserId);
            await _context.FreeTrials.AddAsync(freeTrial);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Free trial created successfully for User ID {UserId}.",freeTrial.UserId);
        }

        public async Task UpdateFreeTrialAsync(FreeTrial freeTrial)
        {
            _logger.LogInformation("Updating free trial for User ID {UserId}.",freeTrial.UserId);

            _context.FreeTrials.Update(freeTrial);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Free trial updated successfully for User ID {UserId}.",freeTrial.UserId);
        }

        public async Task<bool> FreeTrialExistsAsync(int userId)
        {
            _logger.LogInformation("Checking if free trial exists for User ID {UserId}.",userId);
            return await _context.FreeTrials.AnyAsync(f => f.UserId == userId);
        }
    }
}


