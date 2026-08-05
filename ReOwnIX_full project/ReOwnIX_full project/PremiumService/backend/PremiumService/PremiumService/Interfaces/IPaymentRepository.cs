using PremiumService.Models;

namespace PremiumService.Interfaces
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> GetAllPaymentsAsync();
        Task<Payment?> GetPaymentByIdAsync(int paymentId);
        Task AddPaymentAsync(Payment payment);
        Task UpdatePaymentAsync(Payment payment);
        Task DeletePaymentAsync(int paymentId);
        Task<bool> PaymentExistsAsync(int paymentId);
    }
}
