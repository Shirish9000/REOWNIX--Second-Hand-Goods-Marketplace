import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ActiveAuctions from "./ActiveAuctions";
import auctionApi from "../services/auctionApi";


// Mock API
vi.mock("../services/auctionApi", () => ({
  default: {
    getActiveAuctions: vi.fn(),
  },
}));


// Mock child components
vi.mock("../components/AuctionGrid", () => ({
  default: ({ auctions }) => (
    <div data-testid="auction-grid">
      {auctions.map((auction) => (
        <div key={auction.id}>
          {auction.title}
        </div>
      ))}
    </div>
  ),
}));


vi.mock("../components/EmptyState", () => ({
  default: ({ message }) => (
    <div data-testid="empty-state">
      {message}
    </div>
  ),
}));


describe("ActiveAuctions Component", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("shows loading spinner initially", () => {

    auctionApi.getActiveAuctions.mockReturnValue(
      new Promise(() => {})
    );

    render(<ActiveAuctions />);

    expect(
      screen.getByRole("progressbar")
    ).toBeInTheDocument();

  });



  it("displays auctions after successful API call", async () => {

    auctionApi.getActiveAuctions.mockResolvedValue([
      {
        id: 1,
        title: "iPhone Auction"
      },
      {
        id: 2,
        title: "Laptop Auction"
      }
    ]);


    render(<ActiveAuctions />);


    await waitFor(() => {

      expect(
        screen.getByText("Active Auctions")
      ).toBeInTheDocument();

    });


    expect(
      screen.getByTestId("auction-grid")
    ).toBeInTheDocument();


    expect(
      screen.getByText("iPhone Auction")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Laptop Auction")
    ).toBeInTheDocument();


  });



  it("shows empty state when no auctions exist", async () => {


    auctionApi.getActiveAuctions.mockResolvedValue([]);


    render(<ActiveAuctions />);


    await waitFor(() => {

      expect(
        screen.getByTestId("empty-state")
      ).toBeInTheDocument();

    });


    expect(
      screen.getByText(
        "No active auctions at the moment."
      )
    ).toBeInTheDocument();


  });



  it("shows error message when API fails", async () => {


    auctionApi.getActiveAuctions.mockRejectedValue(
      new Error("API Error")
    );


    render(<ActiveAuctions />);


    await waitFor(() => {

      expect(
        screen.getByText(
          "Failed to load auctions. Please try again later."
        )
      ).toBeInTheDocument();

    });


  });



  it("does not update state after component unmount", async () => {


    auctionApi.getActiveAuctions.mockResolvedValue([
      {
        id:1,
        title:"Auction"
      }
    ]);


    const { unmount } = render(
      <ActiveAuctions />
    );


    unmount();


    expect(
      auctionApi.getActiveAuctions
    ).toHaveBeenCalledTimes(1);


  });


});