import { describe, it, expect, vi, beforeEach } from "vitest";
import wishlistApi from "./wishlistApi";
import authApi from "./authApi";

vi.mock("./authApi", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("wishlistApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("get", () => {
    it("should fetch and transform wishlist items", async () => {
      authApi.get.mockResolvedValue({
        data: [
          {
            productId: 1,
            title: "iPhone 15",
            price: 75000,
            brand: "Apple",
            thumbnail: "iphone.jpg",
            sellerName: "John",
          },
          {
            productId: 2,
            title: "Galaxy S24",
            price: 68000,
            brand: "Samsung",
            thumbnail: "galaxy.jpg",
            sellerName: "David",
          },
        ],
      });

      const result = await wishlistApi.get();

      expect(authApi.get).toHaveBeenCalledWith("/wishlist/my-wishlist");

      expect(result).toEqual([
        {
          id: 1,
          title: "iPhone 15",
          price: 75000,
          brand: "Apple",
          image: "iphone.jpg",
          seller: {
            name: "John",
          },
        },
        {
          id: 2,
          title: "Galaxy S24",
          price: 68000,
          brand: "Samsung",
          image: "galaxy.jpg",
          seller: {
            name: "David",
          },
        },
      ]);
    });

    it("should return empty array", async () => {
      authApi.get.mockResolvedValue({
        data: [],
      });

      const result = await wishlistApi.get();

      expect(result).toEqual([]);
    });

    it("should reject when request fails", async () => {
      authApi.get.mockRejectedValue(new Error("Network Error"));

      await expect(wishlistApi.get()).rejects.toThrow("Network Error");
    });
  });

  describe("add", () => {
    it("should add product to wishlist", async () => {
      authApi.post.mockResolvedValue({
        data: {
          success: true,
        },
      });

      const result = await wishlistApi.add(10);

      expect(authApi.post).toHaveBeenCalledWith("/wishlist/add/10");

      expect(result).toEqual({
        success: true,
      });
    });

    it("should reject when add fails", async () => {
      authApi.post.mockRejectedValue(new Error("Failed"));

      await expect(wishlistApi.add(10)).rejects.toThrow("Failed");
    });
  });

  describe("remove", () => {
    it("should remove product from wishlist", async () => {
      authApi.delete.mockResolvedValue({
        data: {
          success: true,
        },
      });

      const result = await wishlistApi.remove(15);

      expect(authApi.delete).toHaveBeenCalledWith("/wishlist/remove/15");

      expect(result).toEqual({
        success: true,
      });
    });

    it("should reject when remove fails", async () => {
      authApi.delete.mockRejectedValue(new Error("Failed"));

      await expect(wishlistApi.remove(15)).rejects.toThrow("Failed");
    });
  });
});