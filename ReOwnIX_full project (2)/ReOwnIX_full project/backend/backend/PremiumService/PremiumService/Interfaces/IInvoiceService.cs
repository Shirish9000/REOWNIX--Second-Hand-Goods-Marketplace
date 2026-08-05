using PremiumService.Models;

namespace PremiumService.Interfaces
{
    public interface IInvoiceService
    {
        Task<IEnumerable<Invoice>> GetAllInvoicesAsync();

        Task<Invoice?> GetInvoiceByIdAsync(int invoiceId);

        Task AddInvoiceAsync(Invoice invoice);

        Task UpdateInvoiceAsync(Invoice invoice);

        Task DeleteInvoiceAsync(int invoiceId);
    }
}
