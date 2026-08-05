import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BillingHistory from "./BillingHistory";
import { IconButton } from "@mui/material";

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows, columns }) => (
    <div>
      <div>Mock DataGrid</div>

      {rows.map((row) => (
        <div key={row.id}>
          <span>{row.invoiceNumber}</span>
          <span>{row.amount}</span>
          <span>{row.status}</span>

          <IconButton
            onClick={() => {
              const actionColumn = columns.find(
                (c) => c.field === "actions"
              );

              actionColumn.renderCell({
                row,
              }).props.onClick();
            }}
          >
            Download
          </IconButton>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../services/dotnet/invoiceService", () => ({
  invoiceService: {
    getAllInvoices: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { invoiceService } from "../services/dotnet/invoiceService";
import toast from "react-hot-toast";

const invoices = [
  {
    id: 1,
    invoiceNumber: "INV001",
    invoiceDate: "2026-08-01",
    payment: {
      amount: 799,
      paymentStatus: "Completed",
    },
  },
  {
    id: 2,
    invoiceNumber: "INV002",
    invoiceDate: "2026-08-02",
    payment: {
      amount: 999,
      paymentStatus: "Completed",
    },
  },
];

describe("BillingHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner", () => {
    invoiceService.getAllInvoices.mockReturnValue(
      new Promise(() => {})
    );

    render(<BillingHistory />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("loads invoices", async () => {
    invoiceService.getAllInvoices.mockResolvedValue(invoices);

    render(<BillingHistory />);

    expect(await screen.findByText("INV001")).toBeInTheDocument();
    expect(screen.getByText("INV002")).toBeInTheDocument();
  });

  it("shows invoice amount", async () => {
    invoiceService.getAllInvoices.mockResolvedValue(invoices);

    render(<BillingHistory />);

    expect(await screen.findByText("₹799")).toBeInTheDocument();
    expect(screen.getByText("₹999")).toBeInTheDocument();
  });

  it("shows completed status", async () => {
    invoiceService.getAllInvoices.mockResolvedValue(invoices);

    render(<BillingHistory />);

    expect(await screen.findAllByText("Completed")).toHaveLength(2);
  });

  it("calls invoice API once", async () => {
    invoiceService.getAllInvoices.mockResolvedValue(invoices);

    render(<BillingHistory />);

    await waitFor(() => {
      expect(invoiceService.getAllInvoices).toHaveBeenCalledTimes(1);
    });
  });

  it("shows empty grid when there are no invoices", async () => {
    invoiceService.getAllInvoices.mockResolvedValue([]);

    render(<BillingHistory />);

    expect(await screen.findByText("Mock DataGrid")).toBeInTheDocument();
  });

  it("shows error toast on API failure", async () => {
    invoiceService.getAllInvoices.mockRejectedValue(
      new Error("API Error")
    );

    render(<BillingHistory />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
    });
  });

  it("downloads invoice", async () => {
    invoiceService.getAllInvoices.mockResolvedValue(invoices);

    render(<BillingHistory />);

    const buttons = await screen.findAllByRole("button");

    await userEvent.click(buttons[0]);

    expect(toast.success).toHaveBeenCalledTimes(1);
  });
});