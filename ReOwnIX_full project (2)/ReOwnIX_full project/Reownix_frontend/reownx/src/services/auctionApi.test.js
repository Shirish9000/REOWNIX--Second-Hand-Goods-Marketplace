import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./authApi", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import authApi from "./authApi";
import auctionApi from "./auctionApi";

describe("auctionApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("creates a new auction", async () => {
      const payload = { title: "Vintage Watch", startingBid: 100 };
      const mockCreatedAuction = { id: 1, ...payload };
      authApi.post.mockResolvedValueOnce({ data: { data: mockCreatedAuction } });

      const result = await auctionApi.create(payload);

      expect(authApi.post).toHaveBeenCalledWith("/auctions", payload);
      expect(result).toEqual(mockCreatedAuction);
    });
  });

  describe("update", () => {
    it("updates an existing auction by ID", async () => {
      const payload = { title: "Updated Vintage Watch" };
      const mockUpdatedAuction = { id: 10, title: "Updated Vintage Watch" };
      authApi.put.mockResolvedValueOnce({ data: { data: mockUpdatedAuction } });

      const result = await auctionApi.update(10, payload);

      expect(authApi.put).toHaveBeenCalledWith("/auctions/10", payload);
      expect(result).toEqual(mockUpdatedAuction);
    });
  });

  describe("cancel", () => {
    it("cancels an auction by ID", async () => {
      const mockCancelledData = { id: 15, status: "cancelled" };
      authApi.delete.mockResolvedValueOnce({ data: { data: mockCancelledData } });

      const result = await auctionApi.cancel(15);

      expect(authApi.delete).toHaveBeenCalledWith("/auctions/15");
      expect(result).toEqual(mockCancelledData);
    });
  });

  describe("getActiveAuctions", () => {
    it("fetches active auctions with query params", async () => {
      const mockActiveAuctions = [{ id: 1, title: "Auction 1" }];
      authApi.get.mockResolvedValueOnce({ data: { data: mockActiveAuctions } });

      const result = await auctionApi.getActiveAuctions();

      expect(authApi.get).toHaveBeenCalledWith("/auctions", {
        params: { status: "active" },
      });
      expect(result).toEqual(mockActiveAuctions);
    });
  });

  describe("getAuctionDetails", () => {
    it("fetches details for a specific auction", async () => {
      const mockDetails = { id: 5, title: "Rare Painting" };
      authApi.get.mockResolvedValueOnce({ data: { data: mockDetails } });

      const result = await auctionApi.getAuctionDetails(5);

      expect(authApi.get).toHaveBeenCalledWith("/auctions/5");
      expect(result).toEqual(mockDetails);
    });
  });

  describe("getAuctionByProductId", () => {
    it("fetches auction by product ID", async () => {
      const mockAuction = { id: 12, productId: 99 };
      authApi.get.mockResolvedValueOnce({ data: { data: mockAuction } });

      const result = await auctionApi.getAuctionByProductId(99);

      expect(authApi.get).toHaveBeenCalledWith("/auctions/product/99");
      expect(result).toEqual(mockAuction);
    });
  });

  describe("getBidHistory", () => {
    it("fetches bid history for an auction", async () => {
      const mockBids = [
        { id: 101, amount: 150 },
        { id: 102, amount: 200 },
      ];
      authApi.get.mockResolvedValueOnce({ data: { data: mockBids } });

      const result = await auctionApi.getBidHistory(5);

      expect(authApi.get).toHaveBeenCalledWith("/auctions/5/bids");
      expect(result).toEqual(mockBids);
    });
  });

  describe("placeBid", () => {
    it("places a new bid on an auction", async () => {
      const payload = { amount: 250 };
      const mockBidResult = { id: 103, amount: 250 };
      authApi.post.mockResolvedValueOnce({ data: { data: mockBidResult } });

      const result = await auctionApi.placeBid(5, payload);

      expect(authApi.post).toHaveBeenCalledWith("/auctions/5/bids", payload);
      expect(result).toEqual(mockBidResult);
    });
  });

  describe("getMyBids", () => {
    it("fetches current user's bids", async () => {
      const mockMyBids = [{ id: 1, amount: 100 }];
      authApi.get.mockResolvedValueOnce({ data: { data: mockMyBids } });

      const result = await auctionApi.getMyBids();

      expect(authApi.get).toHaveBeenCalledWith("/auctions/my-bids");
      expect(result).toEqual(mockMyBids);
    });
  });
});