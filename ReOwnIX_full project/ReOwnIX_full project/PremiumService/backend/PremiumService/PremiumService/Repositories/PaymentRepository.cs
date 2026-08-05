using Microsoft.EntityFrameworkCore;
using PremiumService.Data;
using PremiumService.Interfaces;
using PremiumService.Models;
using Microsoft.Extensions.Logging;

namespace PremiumService.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PaymentRepository> _logger;

        public PaymentRepository(ApplicationDbContext context, ILogger<PaymentRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Payment>> GetAllPaymentsAsync()
        {
            _logger.LogInformation("Fetching all payments from database.");
            return await _context.Payments.AsNoTracking().Include(p => p.Subscription).ToListAsync();
        }

        public async Task<Payment?> GetPaymentByIdAsync(int paymentId)
        {
            _logger.LogInformation("Fetching payment ID {PaymentId} from database.",paymentId);
            return await _context.Payments.AsNoTracking().Include(p => p.Subscription).FirstOrDefaultAsync(p => p.PaymentId == paymentId);
        }

        public async Task AddPaymentAsync(Payment payment) 
        {
            _logger.LogInformation("Adding payment with Transaction ID {TransactionId}.",payment.TransactionId);
            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Payment added successfully. Payment ID {PaymentId}.",payment.PaymentId);
        }

        public async Task UpdatePaymentAsync(Payment payment)
        {
            _logger.LogInformation("Updating payment ID {PaymentId}.",payment.PaymentId);
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Payment ID {PaymentId} updated successfully.",payment.PaymentId);
        }

        public async Task DeletePaymentAsync(int paymentId)
        {
            _logger.LogInformation("Deleting payment ID {PaymentId}.",paymentId);
            var payment = await _context.Payments.FindAsync(paymentId);

            if(payment != null)
            {
                _context.Payments.Remove(payment);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Payment ID {PaymentId} deleted successfully.",paymentId);
            }
            else
            {
                _logger.LogWarning("Payment ID {PaymentId} not found.",paymentId);
            }
        }

        public async Task<bool> PaymentExistsAsync(int paymentId) 
        {
            _logger.LogInformation("Checking existence of payment ID {PaymentId}.",paymentId);
            return await _context.Payments.AnyAsync(p => p.PaymentId == paymentId);
        }
    }
}
