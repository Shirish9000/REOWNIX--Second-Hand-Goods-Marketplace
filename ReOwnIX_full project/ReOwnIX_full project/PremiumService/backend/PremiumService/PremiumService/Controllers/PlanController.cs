using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PremiumService.DTOs;
using PremiumService.Interfaces;
using PremiumService.Models;
using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Authorization;

namespace PremiumService.Controllers
{
    /// <summary>
    /// Controller responsible for managing subscription plans.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PlanController : ControllerBase
    {
        private readonly IPlanService _planService;
        private readonly ILogger<PlanController> _logger;

        public PlanController(IPlanService planService, ILogger<PlanController> logger)
        {
            _planService = planService;
            _logger = logger;
        }

        /// <summary>
        /// Returns all available subscription plans.
        /// </summary>
        /// <returns>Returns a list of subscription plans.</returns>
        /// <response code ="200">Plans retrieved successfully</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllPlans()
        {
            _logger.LogInformation("Get /api/Plan called.");
            var plans = await _planService.GetAllPlansAsync();

            _logger.LogInformation("Returned {Count} plans.", plans.Count());

            var response = plans.Select(plan => new PlanResponseDto
            {
                PlanId = plan.PlanId,
                PlanName = plan.PlanName,
                Price = plan.Price,
                ProductLimit = plan.ProductLimit,
                DurationDays = plan.DurationDays,
                Description = plan.Description,
                IsActive = plan.IsActive
            });

            return Ok(new ApiResponse<IEnumerable<PlanResponseDto>>
            {
                Success = true,
                Message = "Plans retrieved successfully.",
                Data = response
            });
        }

        /// <summary>
        /// Retrieves a subscription plan by its ID.
        /// </summary>
        /// <param name="id">Plan ID.</param>
        /// <returns>Returns the requested plan.</returns>
        /// <response code="200">Plan found.</response>
        /// <response code="404">Plan not found.</response>
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlanById(int id)
        {
            _logger.LogInformation("Get /api/Plan/{Id} called.", id);
            var plan = await _planService.GetPlanByIdAsync(id);

            if(plan == null)
            {
                _logger.LogWarning("Plan with ID {Id} not found.", id);
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Plan not found.",
                    Data = null
                });
            }

            var response = new PlanResponseDto
            {
                PlanId = plan.PlanId,
                PlanName = plan.PlanName,
                Price = plan.Price,
                ProductLimit = plan.ProductLimit,
                DurationDays = plan.DurationDays,
                Description = plan.Description,
                IsActive = plan.IsActive
            };

            _logger.LogInformation("Plan with ID {Id} retrieved successfully.", id);
            return Ok(new ApiResponse<PlanResponseDto>
            {
                Success = true,
                Message = "Plan retrieved successfully.",
                Data = response
            });
        }

        /// <summary>
        /// Creates a new subscription plan.
        /// </summary>
        /// <param name="dto">Plan information.</param>
        /// <returns>Returns the newly created plan.</returns>
        /// <response code="201">Plan created successfully.</response>
        /// <response code="400">Invalid request.</response>
        [HttpPost]
        public async Task<IActionResult> AddPlanAsync([FromBody] PlanRequestDto dto)
        {
            _logger.LogInformation("Creating a new plan.");
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation failed",
                    Data = ModelState
                });
            }
            var plan = new Plan
            {
                PlanName = dto.PlanName,
                Price = dto.Price,
                ProductLimit = dto.ProductLimit,
                DurationDays = dto.DurationDays,
                Description = dto.Description,
                IsActive = dto.IsActive
            };

            await _planService.AddPlanAsync(plan);

            var response = new PlanResponseDto
            {
                PlanId = plan.PlanId,
                PlanName = plan.PlanName,
                Price = plan.Price,
                ProductLimit = plan.ProductLimit,
                DurationDays = plan.DurationDays,
                Description = plan.Description,
                IsActive = plan.IsActive
            };

            _logger.LogInformation("Plan '{PlanName}' created successfully with ID {PlanId}.",
                                    plan.PlanName,
                                    plan.PlanId);
            return CreatedAtAction(nameof(GetPlanById),
                            new { id = response.PlanId },
                        new ApiResponse<PlanResponseDto>
                         {
                            Success = true,
                            Message = "Plan created successfully.",
                            Data = response
                         }); 
        }

        /// <summary>
        /// Updates an existing subscription plan.
        /// </summary>
        /// <param name="id">Plan ID.</param>
        /// <param name="dto">Updated plan information.</param>
        /// <returns>Returns update status.</returns>
        /// <response code="200">Plan updated successfully.</response>
        /// <response code="404">Plan not found.</response>
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlan(int id, [FromBody] PlanRequestDto dto)
        {
            _logger.LogInformation("Updating plan ID {Id}.", id);
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation failed",
                    Data = ModelState
                });
            }
            var existingPlan = await _planService.GetPlanByIdAsync(id);

            if (existingPlan == null)
            {
                _logger.LogWarning("Plan ID {Id} not found.", id);
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Plan not found.",
                    Data = null
                });
            }

            existingPlan.PlanName = dto.PlanName;
            existingPlan.Price = dto.Price;
            existingPlan.ProductLimit = dto.ProductLimit;
            existingPlan.DurationDays = dto.DurationDays;
            existingPlan.Description = dto.Description;
            existingPlan.IsActive = dto.IsActive;

            await _planService.UpdatePlanAsync(existingPlan);

            _logger.LogInformation("Plan ID {Id} updated successfully.", id);
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Plan updated successfully.",
                Data = null
            });
        }

        /// <summary>
        /// Deletes a subscription plan.
        /// </summary>
        /// <param name="id">Plan ID.</param>
        /// <returns>Returns delete status.</returns>
        /// <response code="200">Plan deleted successfully.</response>
        /// <response code="404">Plan not found.</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlan(int id)
        {
            _logger.LogInformation("Deleting plan ID {Id}.", id);
            //check if it exists
            var existingPlan = await _planService.GetPlanByIdAsync(id);

            if (existingPlan == null)
            {
                _logger.LogWarning("Plan ID {Id} not found.", id);
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Plan not found.",
                    Data = null
                });
            }

            //delete it
            await _planService.DeletePlanAsync(id);

            _logger.LogInformation("Plan ID {Id} deleted successfully.", id);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Plan deleted successfully.",
                Data = null
            });
        }
    }
}
