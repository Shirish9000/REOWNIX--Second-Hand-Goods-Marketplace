// src/pages/MyOffers.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

import MyOffers from "./MyOffers";

import offerApi from "../services/offerApi";
import productApi from "../services/productApi";



vi.mock("../services/offerApi", () => ({
  default:{
    getMyOffers: vi.fn(),
    getProductOffers: vi.fn(),
    updateOfferStatus: vi.fn()
  }
}));


vi.mock("../services/productApi",()=>({
  default:{
    getMyProducts: vi.fn()
  }
}));



vi.mock("../components/offer/OfferCard",()=>({

 default:({offer})=>(
   <div>
     Offer Card {offer.id}
   </div>
 )

}));



vi.mock("react-hot-toast",()=>({

 default:{
   success:vi.fn(),
   error:vi.fn()
 }

}));





const renderComponent=()=>{

 return render(
   <MyOffers/>
 );

};





describe("MyOffers Component",()=>{


beforeEach(()=>{

 vi.clearAllMocks();


 offerApi.getMyOffers.mockResolvedValue([]);

 offerApi.getProductOffers.mockResolvedValue([]);

 productApi.getMyProducts.mockResolvedValue([]);

});







it("shows loading initially",()=>{


renderComponent();


expect(
 screen.getByRole("progressbar")
).toBeInTheDocument();


});









it("renders Offer Management heading",async()=>{


renderComponent();



await waitFor(()=>{


expect(
 screen.getByText("Offer Management")
).toBeInTheDocument();


});


});









it("shows empty message when no offers exist",async()=>{


renderComponent();



await waitFor(()=>{


expect(
 screen.getByText(
 "No offers found in this category."
 )
).toBeInTheDocument();


});


});









it("renders received pending offers",async()=>{


offerApi.getProductOffers.mockResolvedValue([

 {
   id:1,
   status:"PENDING"
 }

]);



productApi.getMyProducts.mockResolvedValue([

 {
   id:100
 }

]);



renderComponent();



await waitFor(()=>{


expect(
 screen.getByText("Offer Card 1")
).toBeInTheDocument();



});


});









it("renders sent offers",async()=>{


offerApi.getMyOffers.mockResolvedValue([

 {
   id:5,
   status:"PENDING"
 }

]);



renderComponent();



await waitFor(()=>{


expect(
 screen.getByText(
 "Sent by Me (1)"
 )
).toBeInTheDocument();


});


});







});