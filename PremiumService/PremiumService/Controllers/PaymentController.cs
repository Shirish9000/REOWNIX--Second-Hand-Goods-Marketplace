using Microsoft.AspNetCore.Mvc;
using PremiumService.Interfaces;
using PremiumService.Models;
using PremiumService.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace PremiumService.Controllers
{
    /// <summary>
    /// Handles payment-related operations.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all payment records.
        /// </summary>
        /// <returns>List of all payments.</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllPayments()
        {
            _logger.LogInformation("GET /api/Payment called.");
            var payments = await _paymentService.GetAllPaymentsAsync();
            var response = payments.Select(payment => new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                SubscriptionId = payment.SubscriptionId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                TransactionId = payment.TransactionId,
                PaymentStatus = payment.PaymentStatus,
                PaymentDate = payment.PaymentDate
            });

            _logger.LogInformation("Returned {Count} payments.",
                                    payments.Count());


            return Ok(new ApiResponse<IEnumerable<PaymentResponseDto>>
            {
                Success = true,
                Message = "Payments retrieved successfully.",
                Data = response
            });
        }

        /// <summary>
        /// Retrieves a payment by its ID.
        /// </summary>
        /// <param name="id">Payment ID.</param>
        /// <returns>Payment details.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPaymentById(int id)
        {
            _logger.LogInformation("GET /api/Payment/{Id} called.", id);
            var payment = await _paymentService.GetPaymentByIdAsync(id);

            if (payment == null)
            {
                _logger.LogWarning("Payment ID {Id} not found.", id);
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Payment not found.",
                    Data = null
                });
            }

            var response = new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                SubscriptionId = payment.SubscriptionId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                TransactionId = payment.TransactionId,
                PaymentStatus = payment.PaymentStatus,
                PaymentDate = payment.PaymentDate
            };

            _logger.LogInformation("Payment ID {Id} retrieved successfully.", id);


            return Ok(new ApiResponse<PaymentResponseDto>
            {
                Success = true,
                Message = "Payment retrieved successfully.",
                Data = response
            });
        }

        /// <summary>
        /// Processes a payment and creates a subscription.
        /// </summary>
        /// <param name="request">Payment request.</param>
        /// <returns>Payment details.</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> MakePayment([FromBody] PaymentRequestDto request) 
        {
            _logger.LogInformation("Payment request received for User ID {UserId}, Plan ID {PlanId}.",
                                     request.UserId, request.PlanId);
            if (!ModelState.IsValid)
            {
                
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation failed",
                    Data = ModelState
                });
            }
            var payment = await _paymentService.MakePaymentAsync(request);

            if (payment == null)
            {
                _logger.LogWarning("Payment failed for User ID {UserId}.",
                                     request.UserId);
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Payment failed.",
                    Data = null
                });
            }

            var response = new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                SubscriptionId = payment.SubscriptionId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                TransactionId = payment.TransactionId,
                PaymentStatus = payment.PaymentStatus,
                PaymentDate = payment.PaymentDate
            };

            _logger.LogInformation("Payment successful. Transaction ID {TransactionId}.",
                                    payment.TransactionId);

            return CreatedAtAction(
                nameof(GetPaymentById),
                new { id = payment.PaymentId },
                new ApiResponse<PaymentResponseDto>
                {
                Success = true,
                Message = "Payment successful.",
                Data = response
            });
        }

        /// <summary>
        /// Deletes a payment.
        /// </summary>
        /// <param name="id">Payment ID.</param>
        /// <returns>Success message.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePayment(int id)
        {
            _logger.LogInformation("Deleting payment ID {Id}.", id);

            var payment = await _paymentService.GetPaymentByIdAsync(id);

            if (payment == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Payment not found.",
                    Data = null
                });
            }

            await _paymentService.DeletePaymentAsync(id);

            _logger.LogInformation("Payment ID {Id} deleted successfully.", id);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Payment deleted successfully.",
                Data = null
            });
        }
    }
}

    

