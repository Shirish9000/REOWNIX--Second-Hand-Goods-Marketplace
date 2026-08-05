import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SubscriptionDashboard from "./SubscriptionDashboard";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 1,
    },
  }),
}));

vi.mock("../services/dotnet/subscriptionService", () => ({
  subscriptionService: {
    getUserSubscription: vi.fn(),
    cancelSubscription: vi.fn(),
    renewSubscription: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { subscriptionService } from "../services/dotnet/subscriptionService";

const activeSubscription = {
  planName: "ReOwn Max",
  productsViewed: 20,
  productLimit: 100,
  status: "Active",
  endDate: "2099-12-31",
};

const expiredSubscription = {
  planName: "Own",
  productsViewed: 50,
  productLimit: 50,
  status: "Cancelled",
  endDate: "2023-01-01",
};

describe("SubscriptionDashboard", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner", () => {
    subscriptionService.getUserSubscription.mockReturnValue(
      new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <SubscriptionDashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows no subscription message", async () => {
    subscriptionService.getUserSubscription.mockRejectedValue({});

    render(
      <MemoryRouter>
        <SubscriptionDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/No Active Subscription/i)
    ).toBeInTheDocument();
  });

  it("renders subscription details", async () => {
    subscriptionService.getUserSubscription.mockResolvedValue(
      activeSubscription
    );

    render(
      <MemoryRouter>
        <SubscriptionDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("ReOwn Max")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/100/)
    ).toBeInTheDocument();
  });

  it("shows Cancel Subscription button", async () => {
    subscriptionService.getUserSubscription.mockResolvedValue(
      activeSubscription
    );

    render(
      <MemoryRouter>
        <SubscriptionDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("button", {
        name: /Cancel Subscription/i,
      })
    ).toBeInTheDocument();
  });

  it("shows Renew button for expired subscription", async () => {
    subscriptionService.getUserSubscription.mockResolvedValue(
      expiredSubscription
    );

    render(
      <MemoryRouter>
        <SubscriptionDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("button", {
        name: /Renew Now/i,
      })
    ).toBeInTheDocument();
  });

  it("navigates to premium page", async () => {
    subscriptionService.getUserSubscription.mockResolvedValue(
      activeSubscription
    );

    render(
      <MemoryRouter>
        <SubscriptionDashboard />
      </MemoryRouter>
    );

    const button = await screen.findByRole("button", {
      name: /Change Plan/i,
    });

    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/premium");
  });

  it("calls API once", async () => {
    subscriptionService.getUserSubscription.mockResolvedValue(
      activeSubscription
    );

    render(
      <MemoryRouter>
        <SubscriptionDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        subscriptionService.getUserSubscription
      ).toHaveBeenCalledTimes(1);
    });
  });

  it("shows product views remaining", async () => {
    subscriptionService.getUserSubscription.mockResolvedValue(
      activeSubscription
    );

    render(
      <MemoryRouter>
        <SubscriptionDashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/80 views remaining/i)
    ).toBeInTheDocument();
  });

});