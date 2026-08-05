import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./authApi", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

import authApi from "./authApi";
import offerApi from "./offerApi";

describe("offerApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("makeOffer", () => {
    it("creates a new offer payload and unwraps res.data.data", async () => {
      const payload = { productId: 101, amount: 250 };
      const mockOffer = { id: 1, ...payload, status: "PENDING" };
      authApi.post.mockResolvedValueOnce({ data: { data: mockOffer } });

      const result = await offerApi.makeOffer(payload);

      expect(authApi.post).toHaveBeenCalledWith("/offers", payload);
      expect(result).toEqual(mockOffer);
    });
  });

  describe("getProductOffers", () => {
    it("fetches offers for a specific product ID", async () => {
      const mockOffers = [
        { id: 1, productId: 101, amount: 200 },
        { id: 2, productId: 101, amount: 250 },
      ];
      authApi.get.mockResolvedValueOnce({ data: { data: mockOffers } });

      const result = await offerApi.getProductOffers(101);

      expect(authApi.get).toHaveBeenCalledWith("/offers/product/101");
      expect(result).toEqual(mockOffers);
    });
  });

  describe("getMyOffers", () => {
    it("fetches current user's submitted offers", async () => {
      const mockMyOffers = [{ id: 5, productId: 88, amount: 150 }];
      authApi.get.mockResolvedValueOnce({ data: { data: mockMyOffers } });

      const result = await offerApi.getMyOffers();

      expect(authApi.get).toHaveBeenCalledWith("/offers/my-offers");
      expect(result).toEqual(mockMyOffers);
    });
  });

  describe("updateOfferStatus", () => {
    it("updates status of an offer via query parameters with null body", async () => {
      const mockUpdatedOffer = { id: 10, status: "ACCEPTED" };
      authApi.put.mockResolvedValueOnce({ data: { data: mockUpdatedOffer } });

      const result = await offerApi.updateOfferStatus(10, "ACCEPTED");

      expect(authApi.put).toHaveBeenCalledWith(
        "/offers/10/status",
        null,
        { params: { status: "ACCEPTED" } }
      );
      expect(result).toEqual(mockUpdatedOffer);
    });
  });
});