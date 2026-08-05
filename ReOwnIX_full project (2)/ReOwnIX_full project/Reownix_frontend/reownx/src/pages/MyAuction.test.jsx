// src/pages/MyAuction.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MyAuctions from "./MyAuctions";
import { AuthContext } from "../context/AuthContext";

import auctionApi from "../services/auctionApi";
import productApi from "../services/productApi";

import "@testing-library/jest-dom";


/* Mock APIs */
vi.mock("../services/auctionApi", () => ({
  default: {
    getMyBids: vi.fn(),
    getAuctionDetails: vi.fn(),
    getAuctionByProductId: vi.fn()
  }
}));


vi.mock("../services/productApi", () => ({
  default: {
    getMyProducts: vi.fn()
  }
}));


/* Mock Auction Card */
vi.mock("../components/auction/AuctionCard", () => ({
  default: ({ auction }) => (
    <div>
      Auction Card {auction.id}
    </div>
  )
}));


const mockUser = {
  userId: 1,
  firstName: "Test",
  lastName: "User"
};


const renderComponent = () => {

  return render(
    <AuthContext.Provider
      value={{
        user: mockUser,
        loading: false
      }}
    >
      <MyAuctions />
    </AuthContext.Provider>
  );

};


describe("MyAuctions Component",()=>{


beforeEach(()=>{

  vi.clearAllMocks();


  auctionApi.getMyBids.mockResolvedValue([]);

  auctionApi.getAuctionDetails.mockResolvedValue(null);

  auctionApi.getAuctionByProductId.mockResolvedValue(null);

  productApi.getMyProducts.mockResolvedValue([]);

});



it("renders My Auctions heading", async()=>{

 renderComponent();


 await waitFor(()=>{

   expect(
     screen.getByText("My Auctions")
   ).toBeInTheDocument();

 });


});





it("shows empty message when no auctions", async()=>{


 renderComponent();


 await waitFor(()=>{

   expect(
     screen.getByText(
       "No auctions found in this category."
     )
   ).toBeInTheDocument();

 });


});





it("renders live auctions", async()=>{


auctionApi.getMyBids.mockResolvedValue([
 {
   auctionId:10
 }
]);


auctionApi.getAuctionDetails.mockResolvedValue(
 {
   id:10,
   status:"ACTIVE"
 }
);


renderComponent();



await waitFor(()=>{


 expect(
  screen.getByText(
    "Auction Card 10"
  )
 ).toBeInTheDocument();



});


});






it("renders created auctions", async()=>{


productApi.getMyProducts.mockResolvedValue([

 {
  id:5
 }

]);


auctionApi.getAuctionByProductId.mockResolvedValue({

 id:20,
 status:"ACTIVE"

});


renderComponent();



await waitFor(()=>{


expect(
 screen.getByText("Created by Me (1)")
).toBeInTheDocument();


});


});



});