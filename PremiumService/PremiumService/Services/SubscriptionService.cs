using Microsoft.Extensions.Logging;
using PremiumService.Interfaces;
using PremiumService.Models;



namespace PremiumService.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IPlanRepository _planRepository;
        private readonly IFreeTrialRepository _freeTrialRepository;
        private readonly ILogger<SubscriptionService> _logger;

        public SubscriptionService(ISubscriptionRepository subscriptionRepository, IPlanRepository planRepository, IFreeTrialRepository freeTrialRepository, ILogger<SubscriptionService> logger)
        {
            _subscriptionRepository = subscriptionRepository;
            _planRepository = planRepository;
            _freeTrialRepository = freeTrialRepository;
            _logger = logger;
        }

        public async Task<int> GetRemainingProductsAsync(int userId)
        {
            _logger.LogInformation("Checking remaining products for User ID: {UserId}", userId);

            try
            {
                var subscription = await _subscriptionRepository.GetSubscriptionByUserIdAsync(userId);

                if (subscription == null)
                {
                    _logger.LogWarning("Subscription not found for User ID: {UserId}", userId);
                    return 0;
                }
                _logger.LogInformation("Remaining products for User ID {userId}: {RemainingProducts}", userId, subscription.RemainingProducts);
                return subscription.RemainingProducts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching remaining products for User ID {UserId}.", userId);
                throw;
            }
        }

        public async Task<bool> IsSubscriptionExpiredAsync(int userId)
        {
            _logger.LogInformation("Checking subscription expiry for User ID: {UserId}", userId);

            try
            {
                var subscription =
                    await _subscriptionRepository.GetSubscriptionByUserIdAsync(userId);

                if (subscription == null)
                {
                    _logger.LogWarning(
                        "Subscription not found for User ID: {UserId}",
                        userId);

                    return true;
                }

                bool expired = subscription.EndDate < DateTime.UtcNow;

                _logger.LogInformation(
                    "Subscription expiry status for User ID {UserId}: {Expired}",
                    userId,
                    expired);

                return expired;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error while checking subscription expiry for User ID {UserId}.",
                    userId);

                throw;
            }
        }

        public async Task<bool> CanViewProductAsync(int userId)
        {
            _logger.LogInformation("Checking product viewing permission for User ID: {UserId}", userId);


            try
            {
                //check free trial
                var freeTrial =
                    await _freeTrialRepository.GetFreeTrialByUserIdAsync(userId);

                if (freeTrial == null)
                {
                    _logger.LogInformation(
                        "New user detected. Free trial available.");

                    return true;
                }

                if (freeTrial.ProductsViewed < 10)
                {
                    _logger.LogInformation(
                        "User is still using free trial.");

                    return true;
                }

                var subscription =
                    await _subscriptionRepository.GetSubscriptionByUserIdAsync(userId);

                if (subscription == null)
                {
                    _logger.LogWarning(
                        "No subscription found for User ID {UserId}.",
                        userId);

                    return false;
                }

                if (subscription.EndDate < DateTime.UtcNow)
                {
                    _logger.LogWarning(
                        "Subscription expired for User ID {UserId}.",
                        userId);

                    return false;
                }

                _logger.LogInformation(
                    "Remaining products: {RemainingProducts}",
                    subscription.RemainingProducts);

                return subscription.RemainingProducts > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error while checking product access for User ID {UserId}.",
                    userId);

                throw;
            }


        }

        public async Task<bool> PurchasePlanAsync(int userId, int planId)
        {
            _logger.LogInformation(
        "Purchasing plan {PlanId} for User {UserId}.",
        planId,
        userId);

            try
            {
                var plan =
                    await _planRepository.GetPlanByIdAsync(planId);

                if (plan == null)
                {
                    _logger.LogWarning(
                        "Plan {PlanId} not found.",
                        planId);

                    return false;
                }

                var subscription = new Subscription
                {
                    UserId = userId,
                    PlanId = planId,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(plan.DurationDays),
                    ProductsViewed = 0,
                    RemainingProducts = plan.ProductLimit,
                    Status = "Active",
                    AutoRenew = false
                };

                await _subscriptionRepository.AddSubscriptionAsync(subscription);

                _logger.LogInformation(
                    "Subscription created successfully for User {UserId}.",
                    userId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error while purchasing plan for User {UserId}.",
                    userId);

                throw;
            }

        }

        public async Task<bool> RecordProductViewAsync(int userId)
        {
            _logger.LogInformation("Recording product view for User ID: {UserId}", userId);

            try
            {
                // Check free trial
                var freeTrial = await _freeTrialRepository.GetFreeTrialByUserIdAsync(userId);

                // New user
                if (freeTrial == null)
                {
                    freeTrial = new FreeTrial
                    {
                        UserId = userId,
                        ProductsViewed = 1,
                        IsConsumed = false,
                        CreatedDate = DateTime.UtcNow
                    };

                    await _freeTrialRepository.AddFreeTrialAsync(freeTrial);

                    _logger.LogInformation(
                        "Free trial started successfully for User ID {UserId}.",
                        userId);

                    return true;
                }

                // Free trial available
                if (!freeTrial.IsConsumed)
                {
                    freeTrial.ProductsViewed++;

                    if (freeTrial.ProductsViewed >= 10)
                    {
                        freeTrial.IsConsumed = true;

                        _logger.LogInformation(
                            "Free trial completed for User ID {UserId}.",
                            userId);
                    }

                    await _freeTrialRepository.UpdateFreeTrialAsync(freeTrial);

                    _logger.LogInformation(
                        "Free trial updated. Products Viewed: {ProductsViewed}",
                        freeTrial.ProductsViewed);

                    return true;
                }

                // Paid subscription
                var subscription =
                    await _subscriptionRepository.GetSubscriptionByUserIdAsync(userId);

                if (subscription == null)
                {
                    _logger.LogWarning(
                        "Subscription not found for User ID {UserId}.",
                        userId);

                    return false;
                }

                if (subscription.EndDate < DateTime.UtcNow)
                {
                    _logger.LogWarning(
                        "Subscription expired for User ID {UserId}.",
                        userId);

                    return false;
                }

                if (subscription.RemainingProducts <= 0)
                {
                    _logger.LogWarning(
                        "No remaining products for User ID {UserId}.",
                        userId);

                    return false;
                }

                subscription.ProductsViewed++;
                subscription.RemainingProducts--;

                await _subscriptionRepository.UpdateSubscriptionAsync(subscription);

                _logger.LogInformation(
                    "Product viewed successfully. Remaining Products: {RemainingProducts}",
                    subscription.RemainingProducts);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error while recording product view for User ID {UserId}.",
                    userId);

                throw;
            }
        }

        public async Task<Subscription?> GetSubscriptionByUserIdAsync(int userId)
        {
            _logger.LogInformation(
                    "Fetching subscription for User ID {UserId}.",
                    userId);

            try
            {
                var subscription =
                    await _subscriptionRepository.GetSubscriptionByUserIdAsync(userId);

                if (subscription == null)
                {
                    _logger.LogWarning(
                        "Subscription not found for User ID {UserId}.",
                        userId);

                    return null;
                }

                _logger.LogInformation(
                    "Subscription fetched successfully for User ID {UserId}.",
                    userId);

                return subscription;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error while fetching subscription for User ID {UserId}.",
                    userId);

                throw;
            }
        }

        public async Task<bool> RenewSubscriptionAsync(int userId)
        {
            _logger.LogInformation(
        "Renewing subscription for User ID {UserId}.",
        userId);

            try
            {
                var subscription =
                    await _subscriptionRepository.GetSubscriptionByUserIdAsync(userId);

                if (subscription == null)
                {
                    _logger.LogWarning(
                        "Subscription not found for User ID {UserId}.",
                        userId);

                    return false;
                }

                var plan = subscription.Plan;

                subscription.StartDate = DateTime.UtcNow;
                subscription.EndDate = DateTime.UtcNow.AddDays(plan.DurationDays);
                subscription.ProductsViewed = 0;
                subscription.RemainingProducts = plan.ProductLimit;
                subscription.Status = "Active";

                await _subscriptionRepository.UpdateSubscriptionAsync(subscription);

                _logger.LogInformation(
                    "Subscription renewed successfully for User ID {UserId}.",
                    userId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error while renewing subscription for User ID {UserId}.",
                    userId);

                throw;
            }
        }


        public async Task<bool> CancelSubscriptionAsync(int userId)
        {
            _logger.LogInformation(
        "Cancelling subscription for User ID {UserId}.",
        userId);

            try
            {
                var subscription =
                    await _subscriptionRepository.GetSubscriptionByUserIdAsync(userId);

                if (subscription == null)
                {
                    _logger.LogWarning(
                        "Subscription not found for User ID {UserId}.",
                        userId);

                    return false;
                }

                subscription.Status = "Cancelled";
                subscription.EndDate = DateTime.UtcNow;
                subscription.RemainingProducts = 0;
                subscription.AutoRenew = false;

                await _subscriptionRepository.UpdateSubscriptionAsync(subscription);

                _logger.LogInformation(
                    "Subscription cancelled successfully for User ID {UserId}.",
                    userId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error while cancelling subscription for User ID {UserId}.",
                    userId);

                throw;
            }
        }


    }
}

