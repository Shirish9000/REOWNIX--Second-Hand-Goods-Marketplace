import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, test, beforeEach, expect } from "vitest";

import ProductOffers from "./ProductOffers";
import offerApi from "../services/offerApi";


// Mock API
vi.mock("../services/offerApi", () => ({
  default: {
    getProductOffers: vi.fn(),
    updateOfferStatus: vi.fn()
  }
}));


// Mock toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));


// Mock OfferCard
vi.mock("../components/offer/OfferCard", () => ({
  default: ({offer, onUpdateStatus}) => (
    <div>
      <h6>{offer.productName || "Offer Card"}</h6>

      <button
        onClick={() =>
          onUpdateStatus(offer.id,"ACCEPTED")
        }
      >
        Accept
      </button>

    </div>
  )
}));



const renderPage = () => {

return render(

<MemoryRouter initialEntries={["/profile/my-products/offers/1"]}>

<Routes>

<Route
path="/profile/my-products/offers/:productId"
element={<ProductOffers/>}
/>

</Routes>

</MemoryRouter>

);

};




describe("ProductOffers Component",()=>{


beforeEach(()=>{

vi.clearAllMocks();

});





test("shows loading initially",()=>{


offerApi.getProductOffers.mockReturnValue(
 new Promise(()=>{})
);


renderPage();


expect(
 screen.getByRole("progressbar")
).toBeInTheDocument();


});






test("renders page heading",async()=>{


offerApi.getProductOffers.mockResolvedValue([]);


renderPage();



await waitFor(()=>{


expect(

screen.getByText("Offers for Product")

).toBeInTheDocument();


});


});






test("shows empty message when no offers",async()=>{


offerApi.getProductOffers.mockResolvedValue([]);


renderPage();



await waitFor(()=>{


expect(

screen.getByText(
"No offers received for this product yet."
)

).toBeInTheDocument();



});


});







test("renders received offers",async()=>{


offerApi.getProductOffers.mockResolvedValue([

{
id:1,
productName:"iPhone Offer",
status:"PENDING"
},

{
id:2,
productName:"Laptop Offer",
status:"PENDING"
}

]);



renderPage();



await waitFor(()=>{


expect(

screen.getByText("iPhone Offer")

).toBeInTheDocument();



expect(

screen.getByText("Laptop Offer")

).toBeInTheDocument();



});


});







test("updates offer status",async()=>{


offerApi.getProductOffers.mockResolvedValue([

{
id:1,
productName:"Phone Offer",
status:"PENDING"
}

]);


offerApi.updateOfferStatus.mockResolvedValue({});



renderPage();



await waitFor(()=>{


expect(

screen.getByText("Phone Offer")

).toBeInTheDocument();


});



fireEvent.click(
screen.getByText("Accept")
);



await waitFor(()=>{


expect(
offerApi.updateOfferStatus
).toHaveBeenCalledWith(
1,
"ACCEPTED"
);


});



});



});