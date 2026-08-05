using PremiumService.Interfaces;
using PremiumService.Models;
using Microsoft.Extensions.Logging;

namespace PremiumService.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly ILogger<InvoiceService> _logger;
        public InvoiceService(IInvoiceRepository invoiceRepository, ILogger<InvoiceService> logger)
        {
            _invoiceRepository = invoiceRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Invoice>> GetAllInvoicesAsync()
        {
            _logger.LogInformation("Fetching all invoices.");
            return await _invoiceRepository.GetAllInvoicesAsync();
        }

        public async Task<Invoice?> GetInvoiceByIdAsync(int invoiceId)
        {
            _logger.LogInformation("Fetching invoice ID {InvoiceId}.",
                                        invoiceId);
            var invoice = await _invoiceRepository.GetInvoiceByIdAsync(invoiceId);

            if (invoice == null)
            {
                _logger.LogWarning(
                    "Invoice ID {InvoiceId} not found.",
                    invoiceId);
            }

            return invoice;
        }

        public async Task AddInvoiceAsync(Invoice invoice) 
        {
            _logger.LogInformation("Generating invoice for Payment ID {PaymentId}.",
                                   invoice.PaymentId);

            invoice.InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMddHHmmss}";

            invoice.InvoiceDate = DateTime.UtcNow;

           if(await _invoiceRepository.InvoiceExistsByPaymentIdAsync(invoice.PaymentId))
            {
                throw new InvalidOperationException("Invoice already exists for this payment.");
            }
            await _invoiceRepository.AddInvoiceAsync(invoice);

            _logger.LogInformation("Invoice generated successfully. Invoice Number: {InvoiceNumber}",
                                 invoice.InvoiceNumber);
        }

        public async Task UpdateInvoiceAsync(Invoice invoice)
        {
            _logger.LogInformation("Updating invoice ID {InvoiceId}.",
                                     invoice.InvoiceId);

            await _invoiceRepository.UpdateInvoiceAsync(invoice);

            _logger.LogInformation("Invoice ID {InvoiceId} updated successfully.",
                                     invoice.InvoiceId);
        }

        public async Task DeleteInvoiceAsync(int invoiceId) 
        {
            _logger.LogInformation("Deleting invoice ID {InvoiceId}.",
                                    invoiceId);
            await _invoiceRepository.DeleteInvoiceAsync(invoiceId);

            _logger.LogInformation("Invoice ID {InvoiceId} deleted successfully.",
                                     invoiceId);
        }
    }
}
