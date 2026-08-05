// src/pages/MyBids.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

import MyBids from "./MyBids";
import auctionApi from "../services/auctionApi";

import { MemoryRouter } from "react-router-dom";


vi.mock("../services/auctionApi", () => ({
  default: {
    getMyBids: vi.fn()
  }
}));


vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn()
  }
}));



const renderComponent = () => {

  return render(
    <MemoryRouter>
      <MyBids />
    </MemoryRouter>
  );

};



describe("MyBids Component",()=>{


beforeEach(()=>{

  vi.clearAllMocks();

});



it("shows loading initially",()=>{


auctionApi.getMyBids.mockResolvedValue([]);


renderComponent();


expect(
 screen.getByRole("progressbar")
).toBeInTheDocument();


});





it("renders My Bids heading", async()=>{


auctionApi.getMyBids.mockResolvedValue([]);


renderComponent();



await waitFor(()=>{


expect(
 screen.getByText("My Bids")
).toBeInTheDocument();


});


});







it("shows empty message when user has no bids", async()=>{


auctionApi.getMyBids.mockResolvedValue([]);


renderComponent();



await waitFor(()=>{


expect(
 screen.getByText(
 "You haven't placed any bids yet."
 )
).toBeInTheDocument();


});


});







it("renders bids list", async()=>{


auctionApi.getMyBids.mockResolvedValue([

 {
   id:1,
   amount:5000,
   bidTime:"2026-08-01T10:00:00"
 },

 {
   id:2,
   amount:7500,
   bidTime:"2026-08-02T12:00:00"
 }

]);



renderComponent();



await waitFor(()=>{


expect(
 screen.getByText("Bid #1")
).toBeInTheDocument();



expect(
 screen.getByText("Bid #2")
).toBeInTheDocument();



});


});





it("renders bid amount correctly", async()=>{


auctionApi.getMyBids.mockResolvedValue([

 {
   id:10,
   amount:25000,
   bidTime:"2026-08-03"
 }

]);



renderComponent();



await waitFor(()=>{


expect(
 screen.getByText("₹25,000")
).toBeInTheDocument();


});


});



});