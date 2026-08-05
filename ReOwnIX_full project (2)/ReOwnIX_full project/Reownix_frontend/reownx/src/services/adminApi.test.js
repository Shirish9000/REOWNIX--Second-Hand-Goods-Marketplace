import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./authApi", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import authApi from "./authApi";
import adminApi from "./adminApi";

describe("adminApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDashboard", () => {
    it("fetches admin dashboard data", async () => {
      const mockDashboard = { totalUsers: 100, activeAuctions: 5 };
      authApi.get.mockResolvedValueOnce({ data: { data: mockDashboard } });

      const result = await adminApi.getDashboard();

      expect(authApi.get).toHaveBeenCalledWith("/admin/dashboard");
      expect(result).toEqual(mockDashboard);
    });
  });

  describe("getUsers", () => {
    it("fetches users list with query parameters", async () => {
      const params = { page: 1, limit: 10 };
      const mockUsers = [{ id: 1, name: "Alice" }];
      authApi.get.mockResolvedValueOnce({ data: { data: mockUsers } });

      const result = await adminApi.getUsers(params);

      expect(authApi.get).toHaveBeenCalledWith("/admin/users", { params });
      expect(result).toEqual(mockUsers);
    });
  });

  describe("getProducts", () => {
    it("fetches products list for admin", async () => {
      const params = { status: "pending" };
      const mockProducts = [{ id: 101, title: "Item A" }];
      authApi.get.mockResolvedValueOnce({ data: { data: mockProducts } });

      const result = await adminApi.getProducts(params);

      expect(authApi.get).toHaveBeenCalledWith("/admin/products", { params });
      expect(result).toEqual(mockProducts);
    });
  });

  describe("getAuctions", () => {
    it("fetches auctions list for admin", async () => {
      const params = { active: true };
      const mockAuctions = [{ id: 201, title: "Auction X" }];
      authApi.get.mockResolvedValueOnce({ data: { data: mockAuctions } });

      const result = await adminApi.getAuctions(params);

      expect(authApi.get).toHaveBeenCalledWith("/admin/auctions", { params });
      expect(result).toEqual(mockAuctions);
    });
  });

  describe("getCategories", () => {
    it("fetches categories list", async () => {
      const mockCategories = [{ id: 1, name: "Electronics" }];
      authApi.get.mockResolvedValueOnce({ data: { data: mockCategories } });

      const result = await adminApi.getCategories();

      expect(authApi.get).toHaveBeenCalledWith("/admin/categories", { params: undefined });
      expect(result).toEqual(mockCategories);
    });
  });

  describe("getReviews", () => {
    it("fetches reviews list", async () => {
      const params = { flag: "reported" };
      const mockReviews = [{ id: 5, rating: 1 }];
      authApi.get.mockResolvedValueOnce({ data: { data: mockReviews } });

      const result = await adminApi.getReviews(params);

      expect(authApi.get).toHaveBeenCalledWith("/admin/reviews", { params });
      expect(result).toEqual(mockReviews);
    });
  });

  describe("getMetrics", () => {
    it("fetches metrics with default empty params", async () => {
      const mockMetrics = { dailyActive: 50 };
      authApi.get.mockResolvedValueOnce({ data: { data: mockMetrics } });

      const result = await adminApi.getMetrics("users");

      expect(authApi.get).toHaveBeenCalledWith("/admin/metrics/users", { params: {} });
      expect(result).toEqual(mockMetrics);
    });

    it("fetches metrics with provided params", async () => {
      const params = { startDate: "2026-01-01" };
      const mockMetrics = { totalSales: 5000 };
      authApi.get.mockResolvedValueOnce({ data: { data: mockMetrics } });

      const result = await adminApi.getMetrics("products", params);

      expect(authApi.get).toHaveBeenCalledWith("/admin/metrics/products", { params });
      expect(result).toEqual(mockMetrics);
    });
  });

  describe("disableUser", () => {
    it("disables a user by ID and returns res.data directly", async () => {
      const mockResponse = { success: true, message: "User disabled" };
      authApi.put.mockResolvedValueOnce({ data: mockResponse });

      const result = await adminApi.disableUser(12);

      expect(authApi.put).toHaveBeenCalledWith("/admin/users/12/disable");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("enableUser", () => {
    it("enables a user by ID and returns res.data directly", async () => {
      const mockResponse = { success: true, message: "User enabled" };
      authApi.put.mockResolvedValueOnce({ data: mockResponse });

      const result = await adminApi.enableUser(12);

      expect(authApi.put).toHaveBeenCalledWith("/admin/users/12/enable");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteUser", () => {
    it("deletes a user by ID and returns res.data directly", async () => {
      const mockResponse = { success: true, message: "User deleted" };
      authApi.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await adminApi.deleteUser(12);

      expect(authApi.delete).toHaveBeenCalledWith("/admin/users/12");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteProduct", () => {
    it("deletes a product by ID and returns res.data directly", async () => {
      const mockResponse = { success: true, message: "Product deleted" };
      authApi.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await adminApi.deleteProduct(88);

      expect(authApi.delete).toHaveBeenCalledWith("/admin/products/88");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteAuction", () => {
    it("deletes an auction by ID and returns res.data directly", async () => {
      const mockResponse = { success: true, message: "Auction deleted" };
      authApi.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await adminApi.deleteAuction(301);

      expect(authApi.delete).toHaveBeenCalledWith("/admin/auctions/301");
      expect(result).toEqual(mockResponse);
    });
  });
});