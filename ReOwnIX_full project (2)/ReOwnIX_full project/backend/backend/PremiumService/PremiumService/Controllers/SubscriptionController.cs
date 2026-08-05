using Microsoft.AspNetCore.Mvc;
using PremiumService.Interfaces;
using PremiumService.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace PremiumService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        /// <summary>
        /// Purchases a subscription plan for a user.
        /// </summary>
        /// <param name="request">User ID and Plan ID.</param>
        /// <returns>Purchase status.</returns>
        [Authorize]
        [HttpPost("purchase")]
        public async Task<IActionResult> PurchasePlan([FromBody] PurchasePlanRequestDto request)
        {
            var result = await _subscriptionService.PurchasePlanAsync(request.UserId, request.PlanId);

            if(!result)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Unable to purchase plan.",
                    Data = null
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Plan purchased successfully.",
                Data = null
            });
        }

        /// <summary>
        /// Records a product view for a user.
        /// </summary>
        /// <param name="userId">User ID.</param>
        /// <returns>Updated product view status.</returns>
        [Authorize]
        [HttpPost("view/{userId}")]
        public async Task<IActionResult> RecordProductView(int userId)
        {
            var result = await _subscriptionService.RecordProductViewAsync(userId);

            if (!result)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "No remaining product views or subscription not found.",
                    Data = null
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Product view recorded successfully.",
                Data = null
            });
        }

        /// <summary>
        /// Returns the remaining product views for a user.
        /// </summary>
        /// <param name="userId">User ID.</param>
        /// <returns>Remaining product count.</returns>
        [Authorize]
        [HttpGet("remaining/{userId}")]
        public async Task<IActionResult> GetRemainingProducts(int userId)
        {
            var remaining = await _subscriptionService.GetRemainingProductsAsync(userId);

            var response = new RemainingResponseDto
            {
                UserId = userId,
                RemainingProducts = remaining
            };

            return Ok(new ApiResponse<RemainingResponseDto>
            {
                Success = true,
                Message = "Remaining products retrieved successfully.",
                Data = response
            });
        }

        /// <summary>
        /// Checks whether the user can view another product.
        /// </summary>
        /// <param name="userId">User ID.</param>
        /// <returns>True if the user can view another product.</returns>
        [Authorize]
        [HttpGet("canview/{userId}")]
        public async Task<IActionResult> CanViewProduct(int userId)
        {
            var canView = await _subscriptionService.CanViewProductAsync(userId);
            var response = new CanViewResponseDto
            {
                UserId = userId,
                CanView = canView
            };

            return Ok(new ApiResponse<CanViewResponseDto>
            {
                Success = true,
                Message = "Product access status retrieved successfully.",
                Data = response
            });
        }

        /// <summary>
        /// Checks whether the user's subscription has expired.
        /// </summary>
        /// <param name="userId">User ID.</param>
        /// <returns>Subscription expiry status.</returns>
        [Authorize]
        [HttpGet("isexpired/{userId}")]
        public async Task<IActionResult> IsSubscriptionExpired(int userId)
        {
            var isExpired = await _subscriptionService.IsSubscriptionExpiredAsync(userId);

            var response = new SubscriptionStatusResponseDto
            {
                UserId = userId,
                IsExpired = isExpired
            };

            return Ok(new ApiResponse<SubscriptionStatusResponseDto>
            {
                Success = true,
                Message = "Subscription status retrieved successfully.",
                Data = response
            }); 
        }

        /// <summary>
        /// Retrieves subscription details for a specific user.
        /// </summary>
        /// <param name="userId">User ID.</param>
        /// <returns>Subscription details.</returns>
        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetSubscriptionByUserId(int userId)
        {
            var subscription = await _subscriptionService.GetSubscriptionByUserIdAsync(userId);

            if (subscription == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Subscription not found.",
                    Data = null
                });
            }

            var response = new SubscriptionDetailsResponseDto
            {
                SubscriptionId = subscription.SubscriptionId,
                UserId = subscription.UserId,
                PlanName = subscription.Plan!.PlanName,
                Price = subscription.Plan!.Price,
                ProductsViewed = subscription.ProductsViewed,
                RemainingProducts = subscription.RemainingProducts,
                StartDate = subscription.StartDate,
                EndDate = subscription.EndDate,
                Status = subscription.Status,
                AutoRenew = subscription.AutoRenew
            };

            return Ok(new ApiResponse<SubscriptionDetailsResponseDto>
            {
                Success = true,
                Message = "Subscription retrieved successfully.",
                Data = response
            });
        }

        /// <summary>
        /// Renews a user's subscription.
        /// </summary>
        /// <param name="userId">User ID.</param>
        /// <returns>Renewal status.</returns>
        [Authorize]
        [HttpPost("renew/{userId}")]
        public async Task<IActionResult> RenewSubscription(int userId)
        {
            var result =
                await _subscriptionService.RenewSubscriptionAsync(userId);

            if (!result)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Subscription not found.",
                    Data = null
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Subscription renewed successfully.",
                Data = null
            });
        }

        /// <summary>
        /// Cancels a user's subscription.
        /// </summary>
        /// <param name="userId">User ID.</param>
        /// <returns>Cancellation status.</returns>
        [Authorize]
        [HttpPost("cancel/{userId}")]
        public async Task<IActionResult> CancelSubscription(int userId)
        {
            var result =
                await _subscriptionService.CancelSubscriptionAsync(userId);

            if (!result)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Subscription not found.",
                    Data = null
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Subscription cancelled successfully.",
                Data = null
            });
        }

    }
}

