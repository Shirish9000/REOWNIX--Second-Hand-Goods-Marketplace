using PremiumService.Models;
using PremiumService.DTOs;

namespace PremiumService.Interfaces
{
    public interface IPaymentService
    {
        Task<IEnumerable<Payment>> GetAllPaymentsAsync();

        Task<Payment?> GetPaymentByIdAsync(int paymentId);

        Task<Payment?> MakePaymentAsync(PaymentRequestDto payment);

        Task UpdatePaymentAsync(Payment payment);

        Task DeletePaymentAsync(int paymentId);
    }
}
