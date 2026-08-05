import { describe, it, expect, vi, beforeEach } from "vitest";
import reviewApi from "./reviewApi";
import authApi from "./authApi";

vi.mock("./authApi", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("reviewApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBySeller", () => {
    it("gets reviews for a seller", async () => {
      const reviews = [
        {
          id: 1,
          rating: 5,
          comment: "Excellent seller",
        },
        {
          id: 2,
          rating: 4,
          comment: "Good experience",
        },
      ];

      authApi.get.mockResolvedValue({
        data: {
          data: reviews,
        },
      });

      const result = await reviewApi.getBySeller(10);

      expect(authApi.get).toHaveBeenCalledWith(
        "/reviews/seller/10"
      );

      expect(result).toEqual(reviews);
    });

    it("returns empty review list", async () => {
      authApi.get.mockResolvedValue({
        data: {
          data: [],
        },
      });

      const result = await reviewApi.getBySeller(1);

      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("creates a review", async () => {
      const payload = {
        sellerId: 10,
        productId: 5,
        rating: 5,
        comment: "Excellent product",
      };

      authApi.post.mockResolvedValue({
        data: {
          data: payload,
        },
      });

      const result = await reviewApi.create(payload);

      expect(authApi.post).toHaveBeenCalledWith(
        "/reviews",
        payload
      );

      expect(result).toEqual(payload);
    });

    it("creates review with minimum data", async () => {
      const payload = {
        sellerId: 1,
        productId: 2,
        rating: 4,
        comment: "",
      };

      authApi.post.mockResolvedValue({
        data: {
          data: payload,
        },
      });

      const result = await reviewApi.create(payload);

      expect(result).toEqual(payload);
    });
  });

  describe("remove", () => {
    it("deletes review", async () => {
      authApi.delete.mockResolvedValue({
        data: {
          data: true,
        },
      });

      const result = await reviewApi.remove(25);

      expect(authApi.delete).toHaveBeenCalledWith(
        "/reviews/25"
      );

      expect(result).toBe(true);
    });

    it("returns delete response", async () => {
      const response = {
        message: "Review deleted successfully",
      };

      authApi.delete.mockResolvedValue({
        data: {
          data: response,
        },
      });

      const result = await reviewApi.remove(8);

      expect(result).toEqual(response);
    });
  });
});