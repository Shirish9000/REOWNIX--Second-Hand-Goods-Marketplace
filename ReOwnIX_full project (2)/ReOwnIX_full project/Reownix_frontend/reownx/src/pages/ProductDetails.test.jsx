// src/pages/ProductDetails.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import ProductDetails from "./ProductDetails";

import productApi from "../services/productApi";
import reviewApi from "../services/reviewApi";
import wishlistApi from "../services/wishlistApi";


// Mock APIs
vi.mock("../services/productApi", () => ({
  default: {
    getProduct: vi.fn(),
  },
}));


vi.mock("../services/reviewApi", () => ({
  default: {
    getBySeller: vi.fn(),
    remove: vi.fn(),
  },
}));


vi.mock("../services/wishlistApi", () => ({
  default: {
    get: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
  },
}));


// Mock subscription service
vi.mock("../services/dotnet/subscriptionService", () => ({
  subscriptionService: {

    checkCanViewProduct: vi.fn()
      .mockResolvedValue({
        canView:true
      }),

    recordProductView: vi.fn()
      .mockResolvedValue(true)

  }
}));


// Mock Auth Context
vi.mock("../context/AuthContext", () => ({

  useAuth: () => ({

    user:{
      userId:1,
      firstName:"John",
      lastName:"Doe"
    }

  })

}));


// Mock child components

vi.mock("../components/product/ProductGallery",()=>({
  default:()=> <div>Product Gallery</div>
}));


vi.mock("../components/product/ProductActionsCard",()=>({
  default:()=> <div>Product Actions</div>
}));


vi.mock("../components/product/SellerInfoCard",()=>({
  default:()=> <div>Seller Info</div>
}));


vi.mock("../components/product/ProductSpecsTable",()=>({
  default:()=> <div>Product Specs</div>
}));


vi.mock("../components/product/RelatedProducts",()=>({
  default:()=> <div>Related Products</div>
}));


vi.mock("../components/review/ReviewForm",()=>({
  default:()=> <div>Review Form</div>
}));


vi.mock("../components/review/ReviewCard",()=>({
  default:()=> <div>Review Card</div>
}));





const renderPage = () => {

  render(

    <MemoryRouter initialEntries={["/products/1"]}>

      <Routes>

        <Route
          path="/products/:id"
          element={<ProductDetails/>}
        />

      </Routes>

    </MemoryRouter>

  );

};




describe("ProductDetails Component",()=>{


beforeEach(()=>{

  vi.clearAllMocks();

});





test("shows loading initially",()=>{


 productApi.getProduct.mockReturnValue(
   new Promise(()=>{})
 );


 renderPage();


 expect(
   screen.getByRole("progressbar")
 ).toBeInTheDocument();


});






test("renders product details",async()=>{


productApi.getProduct.mockResolvedValue({

 id:1,

 title:"iPhone 14",

 description:"Good condition",

 thumbnail:"image.jpg",

 owner:{
   id:2
 },

 images:[]

});



reviewApi.getBySeller.mockResolvedValue([]);


wishlistApi.get.mockResolvedValue([]);



renderPage();



await waitFor(()=>{


expect(
 screen.getByText("Description")
).toBeInTheDocument();



});



expect(
 screen.getByText("Product Gallery")
).toBeInTheDocument();



expect(
 screen.getByText("Product Actions")
).toBeInTheDocument();



});






test("shows product not found",async()=>{


productApi.getProduct.mockResolvedValue(null);



renderPage();



await waitFor(()=>{


expect(

screen.getByText("Product not found.")

).toBeInTheDocument();



});


});





test("shows no reviews message",async()=>{


productApi.getProduct.mockResolvedValue({

 id:1,

 title:"Laptop",

 description:"Gaming Laptop",

 owner:{
  id:5
 },

 images:[]

});



reviewApi.getBySeller.mockResolvedValue([]);


wishlistApi.get.mockResolvedValue([]);



renderPage();



await waitFor(()=>{


expect(

screen.getByText(
"No reviews yet. Be the first to share your thoughts!"
)

).toBeInTheDocument();



});



});



});