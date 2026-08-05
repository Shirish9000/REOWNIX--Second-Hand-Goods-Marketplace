import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Wishlist from "./Wishlist";
import { useAuth } from "../context/AuthContext";
import wishlistApi from "../services/wishlistApi";
import toast from "react-hot-toast";

// Mock dependencies
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../services/wishlistApi", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../components/ProductCard", () => ({
  default: ({ product }) => (
    <div data-testid="product-card">
      {product.name}
    </div>
  ),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));


describe("Wishlist Component", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("shows loading spinner initially", () => {

    useAuth.mockReturnValue({
      user: {
        id: 1,
      },
    });

    wishlistApi.get.mockReturnValue(
      new Promise(() => {})
    );

    render(<Wishlist />);

    expect(
      screen.getByRole("progressbar")
    ).toBeInTheDocument();

  });



  it("shows login message when user is not logged in", async () => {

    useAuth.mockReturnValue({
      user: null,
    });


    render(<Wishlist />);


    await waitFor(() => {

      expect(
        toast.info
      ).toHaveBeenCalledWith(
        "Please log in to view your wishlist"
      );

    });


    expect(
      screen.getByText(
        "My Wishlist"
      )
    ).toBeInTheDocument();

  });



  it("renders wishlist products successfully", async () => {

    useAuth.mockReturnValue({
      user: {
        id: 1,
      },
    });


    wishlistApi.get.mockResolvedValue([
      {
        id: 1,
        name: "iPhone 14",
      },
      {
        id: 2,
        name: "Laptop",
      },
    ]);


    render(<Wishlist />);



    expect(
      await screen.findByText(
        "iPhone 14"
      )
    ).toBeInTheDocument();


    expect(
      screen.getByText(
        "Laptop"
      )
    ).toBeInTheDocument();


    expect(
      screen.getAllByTestId(
        "product-card"
      )
    ).toHaveLength(2);

  });



  it("shows empty wishlist message when no items exist", async () => {

    useAuth.mockReturnValue({
      user: {
        id: 1,
      },
    });


    wishlistApi.get.mockResolvedValue([]);


    render(<Wishlist />);



    expect(
      await screen.findByText(
        "Your wishlist is empty. Browse products and add them to your wishlist!"
      )
    ).toBeInTheDocument();

  });



  it("shows error toast when wishlist loading fails", async () => {

    useAuth.mockReturnValue({
      user: {
        id: 1,
      },
    });


    wishlistApi.get.mockRejectedValue(
      new Error("API Error")
    );


    render(<Wishlist />);



    await waitFor(() => {

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Could not load wishlist"
      );

    });

  });


});