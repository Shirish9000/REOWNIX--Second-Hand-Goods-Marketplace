import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PremiumPlans from "./PremiumPlans";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/dotnet/planService", () => ({
  planService: {
    getAllPlans: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
}));

import { planService } from "../services/dotnet/planService";

const mockPlans = [
  {
    planId: 1,
    planName: "Own",
    price: 799,
    durationDays: 30,
    description: "Basic Premium",
    productLimit: 50,
  },
  {
    planId: 2,
    planName: "ReOwn",
    price: 999,
    durationDays: 30,
    description: "Advanced Premium",
    productLimit: 75,
  },
  {
    planId: 3,
    planName: "ReOwn Max",
    price: 1399,
    durationDays: 30,
    description: "Ultimate Premium",
    productLimit: 100,
  },
];

describe("PremiumPlans", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner initially", () => {
    planService.getAllPlans.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <PremiumPlans />
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders page heading", async () => {
    planService.getAllPlans.mockResolvedValue(mockPlans);

    render(
      <MemoryRouter>
        <PremiumPlans />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Upgrade to ReOwnIX Premium/i)).toBeInTheDocument();
  });

  it("renders all three plans", async () => {
    planService.getAllPlans.mockResolvedValue(mockPlans);

    render(
      <MemoryRouter>
        <PremiumPlans />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Own")).toBeInTheDocument();
      expect(screen.getByText("ReOwn")).toBeInTheDocument();
      expect(screen.getByText("ReOwn Max")).toBeInTheDocument();
    });
  });

  it("shows plan prices", async () => {
    planService.getAllPlans.mockResolvedValue(mockPlans);

    render(
      <MemoryRouter>
        <PremiumPlans />
      </MemoryRouter>
    );

    await screen.findByText(/799/);
    expect(screen.getByText(/999/)).toBeInTheDocument();
    expect(screen.getByText(/1399/)).toBeInTheDocument();
  });

  it("renders Get Started buttons", async () => {
    planService.getAllPlans.mockResolvedValue(mockPlans);

    render(
      <MemoryRouter>
        <PremiumPlans />
      </MemoryRouter>
    );

    const buttons = await screen.findAllByRole("button", {
      name: /Get Started/i,
    });

    expect(buttons).toHaveLength(3);
  });

  it("navigates to checkout when button is clicked", async () => {
    planService.getAllPlans.mockResolvedValue(mockPlans);

    render(
      <MemoryRouter>
        <PremiumPlans />
      </MemoryRouter>
    );

    const buttons = await screen.findAllByRole("button", {
      name: /Get Started/i,
    });

    await userEvent.click(buttons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/checkout", {
      state: {
        plan: mockPlans[0],
      },
    });
  });

  it("shows empty message when no plans exist", async () => {
    planService.getAllPlans.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <PremiumPlans />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/No plans currently available/i)
    ).toBeInTheDocument();
  });

  it("calls API exactly once", async () => {
    planService.getAllPlans.mockResolvedValue(mockPlans);

    render(
      <MemoryRouter>
        <PremiumPlans />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(planService.getAllPlans).toHaveBeenCalledTimes(1);
    });
  });
});