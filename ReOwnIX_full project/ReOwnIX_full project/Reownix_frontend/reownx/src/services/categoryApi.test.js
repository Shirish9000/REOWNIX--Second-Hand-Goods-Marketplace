import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./authApi", () => ({
  default: {
    get: vi.fn(),
  },
}));

import authApi from "./authApi";
import categoryApi from "./categoryApi";

describe("categoryApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCategories", () => {
    it("fetches categories and logs response data", async () => {
      const mockCategories = [
        { id: 1, name: "Electronics" },
        { id: 2, name: "Fashion" },
      ];
      const responseData = { data: mockCategories };

      authApi.get.mockResolvedValueOnce({ data: responseData });

      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await categoryApi.getCategories();

      expect(authApi.get).toHaveBeenCalledWith("/categories");
      expect(result).toEqual(mockCategories);

      // Verifies exact console.log calls from categoryApi
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, "Category Response");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, responseData);

      consoleLogSpy.mockRestore();
    });

    it("propagates error when request fails", async () => {
      const mockError = new Error("Network Error");
      authApi.get.mockRejectedValueOnce(mockError);

      await expect(categoryApi.getCategories()).rejects.toThrow("Network Error");
    });
  });
});