using Microsoft.EntityFrameworkCore;
using PremiumService.Data;
using PremiumService.Interfaces;
using PremiumService.Models;
using Microsoft.Extensions.Logging;

namespace PremiumService.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<InvoiceRepository> _logger;

        public InvoiceRepository(ApplicationDbContext context, ILogger<InvoiceRepository> logger)  
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Invoice>> GetAllInvoicesAsync()
        {
            _logger.LogInformation("Fetching all invoices from database.");
            return await _context.Invoices
                    .AsNoTracking()
                    .Include(i => i.Payment)
                    .ToListAsync();
        }

        public async Task<Invoice?> GetInvoiceByIdAsync(int invoiceId)
        {
            _logger.LogInformation("Fetching invoice ID {InvoiceId} from database.",invoiceId);
            return await _context.Invoices
                    .AsNoTracking()
                    .Include(i => i.Payment)
                    .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
        }        

        public async Task AddInvoiceAsync(Invoice invoice)
        {
            _logger.LogInformation("Adding invoice for Payment ID {PaymentId}.",invoice.PaymentId);

            await _context.Invoices.AddAsync(invoice);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Invoice created successfully. Invoice ID {InvoiceId}.",invoice.InvoiceId);
        }

        public async Task UpdateInvoiceAsync(Invoice invoice)
        {
            _logger.LogInformation("Updating invoice ID {InvoiceId}.",invoice.InvoiceId);
            var existingInvoice = await _context.Invoices.FindAsync(invoice.InvoiceId);

            if (existingInvoice == null)
            {
                _logger.LogWarning(
            "Invoice ID {InvoiceId} not found.",
            invoice.InvoiceId);

                return;
            }

            existingInvoice.PaymentId = invoice.PaymentId;
            existingInvoice.InvoiceNumber = invoice.InvoiceNumber;
            existingInvoice.InvoiceDate = invoice.InvoiceDate;

            await _context.SaveChangesAsync();
            _logger.LogInformation("Invoice ID {InvoiceId} updated successfully.",invoice.InvoiceId);
        }

        public async Task DeleteInvoiceAsync(int invoiceId)
        {
            _logger.LogInformation("Deleting invoice ID {InvoiceId}.",invoiceId);
            var invoice = await _context.Invoices.FindAsync(invoiceId);

            if (invoice != null)
            {
                _context.Invoices.Remove(invoice);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Invoice ID {InvoiceId} deleted successfully.",invoiceId);
            }
            else
            {
                _logger.LogWarning("Invoice ID {InvoiceId} not found.",invoiceId);
            }
        }

        public async Task<bool> InvoiceExistsAsync(int invoiceId)
        {
            _logger.LogInformation("Checking existence of invoice ID {InvoiceId}.", invoiceId);
            return await _context.Invoices.AnyAsync(i => i.InvoiceId == invoiceId);
        }

        public async Task<bool> InvoiceExistsByPaymentIdAsync(int paymentId)
        {
            _logger.LogInformation("Checking whether invoice exists for Payment ID {PaymentId}.",paymentId);
            return await _context.Invoices.AnyAsync(i => i.PaymentId == paymentId);
        }
    }
}
