using PremiumService.DTOs;
using PremiumService.Interfaces;
using PremiumService.Models;
using PremiumService.Repositories;
using Microsoft.Extensions.Logging;

namespace PremiumService.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IPlanRepository _planRepository;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(IPaymentRepository paymentRepository, ISubscriptionRepository subscriptionRepository, IPlanRepository planRepository, ILogger<PaymentService> logger)
        {
            _paymentRepository = paymentRepository;
            _subscriptionRepository = subscriptionRepository;
            _planRepository = planRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Payment>> GetAllPaymentsAsync()
        {
            _logger.LogInformation("Fetching all payments.");
            return await _paymentRepository.GetAllPaymentsAsync();
        }

        public async Task<Payment?> GetPaymentByIdAsync(int paymentId)
        {
            _logger.LogInformation("Fetching payment with ID {PaymentId}.",
                                    paymentId);
            var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);

            if (payment == null)
            {
                _logger.LogWarning("Payment with ID {PaymentId} not found.", paymentId);
            }

            return payment;
        }

        public async Task<Payment?> MakePaymentAsync(PaymentRequestDto request)
        {
            _logger.LogInformation(
                "Processing payment for User ID {UserId} and Plan ID {PlanId}.",
                request.UserId,
                request.PlanId);

            var plan = await _planRepository.GetPlanByIdAsync(request.PlanId);

            if (plan == null)
            {
                _logger.LogWarning(
                    "Plan with ID {PlanId} not found.",
                    request.PlanId);

                return null;
            }

            if (request.Amount != plan.Price)
            {
                _logger.LogWarning(
                    "Invalid payment amount for User ID {UserId}. Expected {Expected}, Received {Received}.",
                    request.UserId,
                    plan.Price,
                    request.Amount);

                return null;
            }

            // Create Subscription
            var subscription = new Subscription
            {
                UserId = request.UserId,
                PlanId = request.PlanId,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(plan.DurationDays),
                ProductsViewed = 0,
                RemainingProducts = plan.ProductLimit,
                Status = "Active",
                AutoRenew = false
            };

            await _subscriptionRepository.AddSubscriptionAsync(subscription);

            // Create Payment
            var payment = new Payment
            {
                SubscriptionId = subscription.SubscriptionId,
                Amount = request.Amount,
                PaymentMethod = request.PaymentMethod,
                TransactionId = Guid.NewGuid().ToString(),
                PaymentStatus = "Success",
                PaymentDate = DateTime.UtcNow
            };

            await _paymentRepository.AddPaymentAsync(payment);

            _logger.LogInformation(
                "Payment completed successfully. Transaction ID: {TransactionId}",
                payment.TransactionId);

            return payment;
        }

        public async Task UpdatePaymentAsync(Payment payment)
        {
            _logger.LogInformation("Updating payment ID {PaymentId}.",
                                    payment.PaymentId);
            await _paymentRepository.UpdatePaymentAsync(payment);
            _logger.LogInformation("Payment ID {PaymentId} updated successfully.",
                                    payment.PaymentId);
        }

        public async Task DeletePaymentAsync(int paymentId)
        {
            _logger.LogInformation("Deleting payment ID {PaymentId}.",
                                    paymentId);
            await _paymentRepository.DeletePaymentAsync(paymentId);
            _logger.LogInformation("Payment ID {PaymentId} deleted successfully.",
                                     paymentId);
        }
    }
}
