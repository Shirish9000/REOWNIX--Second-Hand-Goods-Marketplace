// src/pages/AuctionList.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuctionList from "./AuctionList";
import auctionApi from "../services/auctionApi";


// Mock API
vi.mock("../services/auctionApi", () => ({
  default: {
    getActiveAuctions: vi.fn(),
  },
}));


// Mock AuctionCard
vi.mock("../components/auction/AuctionCard", () => ({
  default: ({ auction }) => (
    <div data-testid="auction-card">
      {auction.productTitle}
    </div>
  ),
}));


describe("AuctionList Component", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("shows loading spinner initially", () => {

    auctionApi.getActiveAuctions.mockReturnValue(
      new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <AuctionList />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("progressbar")
    ).toBeInTheDocument();

  });


  it("renders auction list successfully", async () => {

    auctionApi.getActiveAuctions.mockResolvedValue([
      {
        id: 1,
        productTitle: "iPhone 15",
      },
      {
        id: 2,
        productTitle: "MacBook Pro",
      },
    ]);


    render(
      <MemoryRouter>
        <AuctionList />
      </MemoryRouter>
    );


    await waitFor(() => {

      expect(
        screen.getByText("Live Auctions")
      ).toBeInTheDocument();

    });


    expect(
      screen.getByText("iPhone 15")
    ).toBeInTheDocument();


    expect(
      screen.getByText("MacBook Pro")
    ).toBeInTheDocument();


    expect(
      screen.getAllByTestId("auction-card")
    ).toHaveLength(2);

  });



  it("shows empty message when no auctions available", async () => {

    auctionApi.getActiveAuctions.mockResolvedValue([]);


    render(
      <MemoryRouter>
        <AuctionList />
      </MemoryRouter>
    );


    await waitFor(() => {

      expect(
        screen.getByText(
          "No live auctions available right now."
        )
      ).toBeInTheDocument();

    });

  });



  it("handles API failure gracefully", async () => {

    auctionApi.getActiveAuctions.mockRejectedValue(
      new Error("API Error")
    );


    render(
      <MemoryRouter>
        <AuctionList />
      </MemoryRouter>
    );


    await waitFor(() => {

      expect(
        screen.getByText(
          "No live auctions available right now."
        )
      ).toBeInTheDocument();

    });

  });

});