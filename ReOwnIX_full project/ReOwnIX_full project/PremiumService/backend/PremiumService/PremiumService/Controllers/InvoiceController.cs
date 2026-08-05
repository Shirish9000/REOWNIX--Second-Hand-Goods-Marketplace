using Microsoft.AspNetCore.Mvc;
using PremiumService.Interfaces;
using PremiumService.Models;
using PremiumService.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace PremiumService.Controllers
{
    /// <summary>
    /// Handles invoice-related operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        /// <summary>
        /// Retrieves all invoices.
        /// </summary>
        /// <returns>List of invoices.</returns>
        // GET: api/Invoice
       
        [HttpGet]
        public async Task<IActionResult> GetAllInvoices()
        {
            var invoices = await _invoiceService.GetAllInvoicesAsync();

            var response = invoices.Select(invoice => new InvoiceResponseDto
            {
                InvoiceId = invoice.InvoiceId,
                PaymentId = invoice.PaymentId,
                InvoiceNumber = invoice.InvoiceNumber,
                InvoiceDate = invoice.InvoiceDate
            });

            return Ok(new ApiResponse<IEnumerable<InvoiceResponseDto>>
            {
                Success = true,
                Message = "Invoices retrieved successfully.",
                Data = response
            });
        }

        /// <summary>
        /// Retrieves an invoice by its ID.
        /// </summary>
        /// <param name="id">Invoice ID.</param>
        /// <returns>Invoice details.</returns>
        // GET: api/Invoice/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetInvoiceById(int id)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(id);

            if (invoice == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Invoice not found.",
                    Data = null
                });
            }

            var response = new InvoiceResponseDto
            {
                InvoiceId = invoice.InvoiceId,
                PaymentId = invoice.PaymentId,
                InvoiceNumber = invoice.InvoiceNumber,
                InvoiceDate = invoice.InvoiceDate
            };

            return Ok(new ApiResponse<InvoiceResponseDto>
            {
                Success = true,
                Message = "Invoice retrieved successfully.",
                Data = response
            });
        }

        /// <summary>
        /// Generates an invoice for a payment.
        /// </summary>
        /// <param name="dto">Invoice request.</param>
        /// <returns>Created invoice.</returns>
        // POST: api/Invoice
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddInvoice([FromBody] InvoiceRequestDto dto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation failed",
                    Data = ModelState
                });
            }
            var invoice = new Invoice
            {
                PaymentId = dto.PaymentId
            };

            try
            {
                await _invoiceService.AddInvoiceAsync(invoice);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                });
            }
            var response = new InvoiceResponseDto
            {
                InvoiceId = invoice.InvoiceId,
                PaymentId = invoice.PaymentId,
                InvoiceNumber = invoice.InvoiceNumber,
                InvoiceDate = invoice.InvoiceDate
            };

            return CreatedAtAction(
                nameof(GetInvoiceById),
                new { id = response.InvoiceId },
                new ApiResponse<InvoiceResponseDto>
                {
                    Success = true,
                    Message = "Invoice created successfully.",
                    Data = response
                });
        }

        /// <summary>
        /// Updates an existing invoice.
        /// </summary>
        /// <param name="id">Invoice ID.</param>
        /// <param name="dto">Updated invoice details.</param>
        /// <returns>Success message.</returns>
        // PUT: api/Invoice/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateInvoice(int id, [FromBody] InvoiceRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "valdation failed",
                    Data = ModelState
                });
            }

            var existingInvoice = await _invoiceService.GetInvoiceByIdAsync(id);

            if (existingInvoice == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Invoice not found.",
                    Data = null
                });
            }

            existingInvoice.PaymentId = dto.PaymentId;

            await _invoiceService.UpdateInvoiceAsync(existingInvoice);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Invoice updated successfully.",
                Data = null
            });
        }

        /// <summary>
        /// Deletes an invoice.
        /// </summary>
        /// <param name="id">Invoice ID.</param>
        /// <returns>Success message.</returns>
        // DELETE: api/Invoice/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var existingInvoice = await _invoiceService.GetInvoiceByIdAsync(id);

            if (existingInvoice == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Invoice not found.",
                    Data = null
                });
            }

            await _invoiceService.DeleteInvoiceAsync(id);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Invoice deleted successfully.",
                Data = null
            });
        }
    }
}