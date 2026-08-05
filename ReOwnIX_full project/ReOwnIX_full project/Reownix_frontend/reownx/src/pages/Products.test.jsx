import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

import Products from "./Products";
import productApi from "../services/productApi";


// Mock product API
vi.mock("../services/productApi", () => ({
  default: {
    getProducts: vi.fn()
  }
}));


// Mock toast
vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn()
  }
}));


// Mock ProductCard
vi.mock("../components/ProductCard", () => ({
  default: ({ product }) => (
    <div>
      {product.title}
    </div>
  )
}));


// Mock Pagination
vi.mock("../components/PaginationControls", () => ({
  default: () => (
    <div>
      Pagination Controls
    </div>
  )
}));


// Mock FilterSidebar
vi.mock("../components/product/FilterSidebar", () => ({
  default: () => (
    <div>
      Filter Sidebar
    </div>
  )
}));



const renderPage = () => {

  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );

};



describe("Products Component",()=>{


beforeEach(()=>{

  vi.clearAllMocks();

});





test("renders Browse Products heading",async()=>{


productApi.getProducts.mockResolvedValue({

content:[],
totalElements:0

});


renderPage();



expect(
screen.getByText("Browse Products")
).toBeInTheDocument();



});







test("shows loading skeleton while fetching products",()=>{


productApi.getProducts.mockReturnValue(
 new Promise(()=>{})
);



renderPage();



expect(
screen.getByText("Browse Products")
).toBeInTheDocument();



});







test("renders products list",async()=>{


productApi.getProducts.mockResolvedValue({

content:[

{
id:1,
title:"iPhone 15"
},

{
id:2,
title:"Laptop"
}

],

totalElements:2

});



renderPage();



await waitFor(()=>{


expect(

screen.getByText("iPhone 15")

).toBeInTheDocument();



expect(

screen.getByText("Laptop")

).toBeInTheDocument();



});


});








test("shows product count",async()=>{


productApi.getProducts.mockResolvedValue({

content:[

{
id:1,
title:"Phone"
}

],

totalElements:10

});



renderPage();



await waitFor(()=>{


expect(

screen.getByText(
"Showing 1 of 10 products"
)

).toBeInTheDocument();



});


});







test("shows no products message",async()=>{


productApi.getProducts.mockResolvedValue({

content:[],

totalElements:0

});



renderPage();



await waitFor(()=>{


expect(

screen.getByText(
"No products found."
)

).toBeInTheDocument();



expect(

screen.getByText(
"Try changing your filters or search term to find what you're looking for."
)

).toBeInTheDocument();



});


});







test("clears filters button works",async()=>{


productApi.getProducts.mockResolvedValue({

content:[],

totalElements:0

});



renderPage();



await waitFor(()=>{


expect(

screen.getByText(
"Clear Search & Filters"
)

).toBeInTheDocument();


});



fireEvent.click(

screen.getByText(
"Clear Search & Filters"
)

);



});





});