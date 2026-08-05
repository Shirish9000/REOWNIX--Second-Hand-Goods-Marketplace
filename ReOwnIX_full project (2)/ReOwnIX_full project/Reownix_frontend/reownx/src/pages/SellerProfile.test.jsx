// src/pages/SellerProfile.test.jsx

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import SellerProfile from "./SellerProfile";

import productApi from "../services/productApi";


// ---------------- MOCKS ----------------

vi.mock("../services/productApi", () => ({
  default: {
    getProducts: vi.fn(),
  },
}));


vi.mock("../components/ProductCard", () => ({
  default: ({ product }) => (
    <div data-testid="product-card">
      {product.title}
    </div>
  ),
}));



vi.mock("../services/authApi", () => ({
  default: {}
}));



// ---------------- HELPER ----------------

const renderSellerProfile = () => {

  return render(

    <MemoryRouter initialEntries={["/seller/1"]}>

      <Routes>

        <Route
          path="/seller/:id"
          element={<SellerProfile />}
        />

      </Routes>

    </MemoryRouter>

  );

};



// ---------------- TESTS ----------------

describe("SellerProfile Component", () => {


  beforeEach(() => {

    vi.clearAllMocks();

  });





  it("shows loading state initially", () => {


    productApi.getProducts.mockReturnValue(
      new Promise(()=>{})
    );


    renderSellerProfile();


    expect(
      screen.queryByText(
        "Seller User"
      )
    ).not.toBeInTheDocument();


  });







  it("renders seller profile successfully", async()=>{


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

      ]

    });



    renderSellerProfile();



    expect(
      await screen.findByText(
        "Seller User"
      )
    ).toBeInTheDocument();



    expect(
      screen.getByText(
        "New Delhi, India"
      )
    ).toBeInTheDocument();



    expect(
      screen.getByText(
        "4.8"
      )
    ).toBeInTheDocument();



    expect(
      screen.getByText(
        "Products by this Seller"
      )
    ).toBeInTheDocument();



    expect(
      screen.getByText(
        "iPhone 15"
      )
    ).toBeInTheDocument();



    expect(
      screen.getByText(
        "Laptop"
      )
    ).toBeInTheDocument();



  });








  it("renders empty products message", async()=>{


    productApi.getProducts.mockResolvedValue({

      content:[]

    });



    renderSellerProfile();



    expect(
      await screen.findByText(
        "Seller User"
      )
    ).toBeInTheDocument();



    expect(
      screen.getByText(
        "This seller has no active listings."
      )
    ).toBeInTheDocument();



  });








  it("handles product api failure gracefully", async()=>{


    productApi.getProducts.mockRejectedValue(
      new Error("API Error")
    );



    renderSellerProfile();



    expect(
      await screen.findByText(
        "Seller User"
      )
    ).toBeInTheDocument();



    expect(
      screen.queryByText(
        "Products by this Seller"
      )
    ).toBeInTheDocument();



  });




});