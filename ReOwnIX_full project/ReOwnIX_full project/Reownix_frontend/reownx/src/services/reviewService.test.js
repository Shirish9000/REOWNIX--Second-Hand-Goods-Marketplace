import { describe, it, expect, vi, beforeEach } from "vitest";
import reviewService from "./reviewService";
import authApi from "./authApi";

vi.mock("./authApi", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("reviewService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createReview", () => {
    it("creates a review", async () => {
      const response = {
        id: 1,
        sellerId: 2,
        productId: 3,
        rating: 5,
        comment: "Excellent",
      };

      authApi.post.mockResolvedValue({
        data: {
          data: response,
        },
      });

      const review = {
        rating: 5,
        comment: "Excellent",
      };

      const result = await reviewService.createReview(
        2,
        3,
        review
      );

      expect(authApi.post).toHaveBeenCalledWith(
        "/reviews",
        {
          sellerId: 2,
          productId: 3,
          rating: 5,
          comment: "Excellent",
        }
      );

      expect(result).toEqual(response);
    });
  });

  describe("updateReview", () => {
    it("updates a review", async () => {
      const updated = {
        rating: 4,
        comment: "Good",
      };

      authApi.put.mockResolvedValue({
        data: {
          data: updated,
        },
      });

      const result = await reviewService.updateReview(
        10,
        updated
      );

      expect(authApi.put).toHaveBeenCalledWith(
        "/reviews/10",
        updated
      );

      expect(result).toEqual(updated);
    });
  });

  describe("deleteReview", () => {
    it("deletes a review", async () => {
      authApi.delete.mockResolvedValue({
        data: {
          data: true,
        },
      });

      const result =
        await reviewService.deleteReview(15);

      expect(authApi.delete).toHaveBeenCalledWith(
        "/reviews/15"
      );

      expect(result).toBe(true);
    });
  });

  describe("getSellerReviews", () => {
    it("returns seller reviews", async () => {
      const reviews = [
        {
          id: 1,
          rating: 5,
        },
        {
          id: 2,
          rating: 4,
        },
      ];

      authApi.get.mockResolvedValue({
        data: {
          data: reviews,
        },
      });

      const result =
        await reviewService.getSellerReviews(8);

      expect(authApi.get).toHaveBeenCalledWith(
        "/reviews/seller/8"
      );

      expect(result).toEqual(reviews);
    });

    it("returns empty array when no reviews exist", async () => {
      authApi.get.mockResolvedValue({
        data: {
          data: [],
        },
      });

      const result =
        await reviewService.getSellerReviews(100);

      expect(result).toEqual([]);
    });
  });

  describe("getSellerRating", () => {
    it("gets seller rating summary", async () => {
      const rating = {
        averageRating: 4.8,
        totalReviews: 25,
      };

      authApi.get.mockResolvedValue({
        data: {
          data: rating,
        },
      });

      const result =
        await reviewService.getSellerRating(9);

      expect(authApi.get).toHaveBeenCalledWith(
        "/reviews/seller/9/rating"
      );

      expect(result).toEqual(rating);
    });

    it("returns default rating object", async () => {
      const rating = {
        averageRating: 0,
        totalReviews: 0,
      };

      authApi.get.mockResolvedValue({
        data: {
          data: rating,
        },
      });

      const result =
        await reviewService.getSellerRating(1);

      expect(result).toEqual(rating);
    });
  });
});