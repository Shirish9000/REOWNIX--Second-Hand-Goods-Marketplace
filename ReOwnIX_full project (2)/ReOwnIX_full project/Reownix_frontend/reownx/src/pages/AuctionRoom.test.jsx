// src/pages/AuctionRoom.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuctionRoom from "./AuctionRoom";

import auctionApi from "../services/auctionApi";
import productApi from "../services/productApi";
import webSocketService from "../services/webSocketService";


// Mock APIs
vi.mock("../services/auctionApi", () => ({
  default: {
    getAuctionDetails: vi.fn(),
    getBidHistory: vi.fn(),
  },
}));

vi.mock("../services/productApi", () => ({
  default: {
    getProduct: vi.fn(),
  },
}));


// Mock websocket
vi.mock("../services/webSocketService", () => ({
  default: {
    addConnectionListener: vi.fn(() => vi.fn()),
    subscribe: vi.fn(() => vi.fn()),
    sendBid: vi.fn(),
  },
}));


// Mock Auth Context
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      userId: 2,
    },
  }),
}));


// Mock child components

vi.mock("../components/auction/Countdown", () => ({
  default: () => <div>Countdown</div>,
}));

vi.mock("../components/auction/AuctionStatusBadge", () => ({
  default: ({ status }) => (
    <div>Auction Status: {status}</div>
  ),
}));

vi.mock("../components/auction/BidHistory", () => ({
  default: ({ bids }) => (
    <div>
      Bid History {bids.length}
    </div>
  ),
}));

vi.mock("../components/auction/BidInput", () => ({
  default: ({ disabledReason }) => (
    <div>
      Bid Input
      {disabledReason && <span>{disabledReason}</span>}
    </div>
  ),
}));

vi.mock("../components/auction/WinnerBanner", () => ({
  default: ({ role }) => (
    <div>
      Winner Banner {role}
    </div>
  ),
}));

vi.mock("../components/auction/LiveStatistics", () => ({
  default: () => (
    <div>Live Statistics</div>
  ),
}));

vi.mock("../components/auction/UserBidStatus", () => ({
  default: () => (
    <div>User Bid Status</div>
  ),
}));


describe("AuctionRoom Component", () => {


  beforeEach(() => {
    vi.clearAllMocks();
  });



  const renderPage = () => {

    render(
      <MemoryRouter initialEntries={["/auction/1"]}>
        <Routes>
          <Route 
            path="/auction/:id" 
            element={<AuctionRoom />}
          />
        </Routes>
      </MemoryRouter>
    );

  };



  it("shows loading initially", () => {

    auctionApi.getAuctionDetails.mockReturnValue(
      new Promise(() => {})
    );


    renderPage();


    expect(
      screen.getByRole("progressbar")
    ).toBeInTheDocument();

  });



  it("renders auction room details", async () => {


    auctionApi.getAuctionDetails.mockResolvedValue({
      id: 1,
      productId: 10,
      productTitle: "iPhone 15",
      productThumbnail: "/iphone.png",
      currentPrice: 50000,
      minimumBidIncrement: 1000,
      sellerId: 5,
      status: "ACTIVE",
      endTime: "2099-01-01T10:00:00",
    });


    auctionApi.getBidHistory.mockResolvedValue([
      {
        id: 1,
        amount: 50000,
        bidderName: "Alice",
      }
    ]);


    productApi.getProduct.mockResolvedValue({
      title: "iPhone 15",
      images:[
        {
          imageUrl:"/iphone.png"
        }
      ]
    });


    renderPage();



    await waitFor(() => {

      expect(
        screen.getByText("Auction Room")
      ).toBeInTheDocument();

    });



    expect(
      screen.getByText("iPhone 15")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Auction Status: ACTIVE")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Bid History 1")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Live Statistics")
    ).toBeInTheDocument();


  });



  it("shows reconnecting state when websocket disconnected", async () => {


    webSocketService.addConnectionListener.mockImplementation(
      (callback)=>{
        callback(false);
        return vi.fn();
      }
    );


    auctionApi.getAuctionDetails.mockResolvedValue({
      id:1,
      productTitle:"Laptop",
      currentPrice:20000,
      status:"ACTIVE",
      endTime:"2099-01-01"
    });


    auctionApi.getBidHistory.mockResolvedValue([]);


    renderPage();


    await waitFor(()=>{

      expect(
        screen.getByText("Reconnecting...")
      ).toBeInTheDocument();

    });


  });



  it("redirects when auction not found", async ()=>{


    auctionApi.getAuctionDetails.mockRejectedValue(
      new Error("Not found")
    );


    renderPage();


    await waitFor(()=>{

      expect(
        auctionApi.getAuctionDetails
      ).toHaveBeenCalled();

    });


  });



});