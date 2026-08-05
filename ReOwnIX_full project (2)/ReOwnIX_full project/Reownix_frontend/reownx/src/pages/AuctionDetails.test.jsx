import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import AuctionDetails from "./AuctionDetails";

// Mock Auth Context
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      name: "John"
    }
  })
}));

// Mock toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock API
vi.mock("../services/auctionApi", () => ({
  default: {
    getAuctionDetails: vi.fn(),
    placeBid: vi.fn()
  }
}));

import auctionApi from "../services/auctionApi";


const mockAuction = {
  id: 1,
  productId: 10,
  productTitle: "iPhone 15",
  productThumbnail: "/iphone.png",
  sellerName: "John Seller",
  currentPrice: 50000,
  minimumBidIncrement: 1000,
  status: "ACTIVE",
  endTime: new Date(Date.now() + 3600000).toISOString(),
  bids: [
    {
      id: 1,
      amount: 50000,
      bidderName: "Alice",
      bidTime: new Date().toISOString()
    }
  ]
};


const renderComponent = () => {
  return render(
    <MemoryRouter initialEntries={["/auction/1"]}>
      <Routes>
        <Route
          path="/auction/:id"
          element={<AuctionDetails />}
        />
      </Routes>
    </MemoryRouter>
  );
};


describe("AuctionDetails Component", () => {


  beforeEach(() => {
    vi.clearAllMocks();

    auctionApi.getAuctionDetails.mockResolvedValue(mockAuction);

  });


  test("shows loading initially", () => {

    auctionApi.getAuctionDetails.mockReturnValue(
      new Promise(()=>{})
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar")
    ).toBeInTheDocument();

  });



  test("renders auction details", async () => {

    renderComponent();


    await waitFor(()=>{

      expect(
        screen.getByText("iPhone 15")
      ).toBeInTheDocument();

    });


    expect(
      screen.getByText("John Seller")
    ).toBeInTheDocument();


   expect(
  screen.getAllByText("₹50,000").length
).toBeGreaterThan(0);

  });



  test("shows bid history", async()=>{

    renderComponent();


    await waitFor(()=>{

      expect(
        screen.getByText("Bid History")
      ).toBeInTheDocument();

    });


    expect(
      screen.getByText("Alice")
    ).toBeInTheDocument();


  });



  test("opens bid modal", async()=>{

    renderComponent();


    await waitFor(()=>{

      expect(
        screen.getByText("Place Bid")
      ).toBeInTheDocument();

    });


    fireEvent.click(
      screen.getByText("Place Bid")
    );


    expect(
      screen.getByText("Place Your Bid")
    ).toBeInTheDocument();


  });



  test("places bid successfully", async()=>{


    auctionApi.placeBid.mockResolvedValue({});


    renderComponent();


    await waitFor(()=>{

      expect(
        screen.getByText("Place Bid")
      ).toBeInTheDocument();

    });


    fireEvent.click(
      screen.getByText("Place Bid")
    );


    const input =
      screen.getByLabelText("Bid Amount (₹)");


    fireEvent.change(input,{
      target:{
        value:"52000"
      }
    });


    fireEvent.click(
      screen.getByText("Confirm Bid")
    );


    await waitFor(()=>{

      expect(
        auctionApi.placeBid
      ).toHaveBeenCalled();

    });


  });



  test("shows auction ended state", async()=>{


    auctionApi.getAuctionDetails.mockResolvedValue({

      ...mockAuction,

      status:"ENDED",

      winnerName:"Alice"

    });


    renderComponent();


    await waitFor(()=>{


      expect(
        screen.getByText("Auction Ended")
      ).toBeInTheDocument();


    });


    expect(
      screen.getByText("Alice")
    ).toBeInTheDocument();


  });



  test("handles API error", async()=>{


    auctionApi.getAuctionDetails.mockRejectedValue(
      new Error("API Error")
    );


    renderComponent();


    await waitFor(()=>{

      expect(
        screen.getByText("Auction not found")
      ).toBeInTheDocument();

    });


  });


});