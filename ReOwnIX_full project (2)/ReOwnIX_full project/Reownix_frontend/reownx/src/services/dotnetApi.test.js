import { describe, it, expect, vi, beforeEach } from "vitest";

// 1. Safe localStorage mock fallback for Node test environments
const localStorageMap = new Map();
const mockLocalStorage = {
  getItem: vi.fn((key) => localStorageMap.get(key) || null),
  setItem: vi.fn((key, value) => localStorageMap.set(key, String(value))),
  removeItem: vi.fn((key) => localStorageMap.delete(key)),
  clear: vi.fn(() => localStorageMap.clear()),
};

// Override global localStorage safely
if (typeof globalThis.localStorage === "undefined" || !globalThis.localStorage.clear) {
  Object.defineProperty(globalThis, "localStorage", {
    value: mockLocalStorage,
    writable: true,
  });
}

// 2. Declare mock functions and interceptors safely using vi.hoisted()
const {
  mockGet,
  mockPost,
  mockPut,
  mockDelete,
  interceptors,
} = vi.hoisted(() => {
  const interceptorStore = {
    requestSuccess: null,
    requestError: null,
    responseSuccess: null,
    responseError: null,
  };

  return {
    mockGet: vi.fn(),
    mockPost: vi.fn(),
    mockPut: vi.fn(),
    mockDelete: vi.fn(),
    interceptors: interceptorStore,
  };
});

// 3. Mock axios before importing the module under test
vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
      interceptors: {
        request: {
          use: vi.fn((success, error) => {
            interceptors.requestSuccess = success;
            interceptors.requestError = error;
          }),
        },
        response: {
          use: vi.fn((success, error) => {
            interceptors.responseSuccess = success;
            interceptors.responseError = error;
          }),
        },
      },
    })),
  },
}));

import dotnetApi, {
  planService,
  subscriptionService,
  paymentService,
  invoiceService,
} from "./dotnetApi";

describe("dotnetApi Client and Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMap.clear();
  });

  describe("Interceptors", () => {
    it("attaches Authorization header when token exists in localStorage", () => {
      localStorage.setItem("token", "my-bearer-token");
      const config = { headers: {} };

      const updatedConfig = interceptors.requestSuccess(config);

      expect(updatedConfig.headers.Authorization).toBe("Bearer my-bearer-token");
    });

    it("does not attach Authorization header when token is missing", () => {
      const config = { headers: {} };

      const updatedConfig = interceptors.requestSuccess(config);

      expect(updatedConfig.headers.Authorization).toBeUndefined();
    });

    it("passes request error through request error interceptor", async () => {
      const error = new Error("Request Setup Error");

      await expect(interceptors.requestError(error)).rejects.toThrow("Request Setup Error");
    });

    it("returns response data directly on successful response", () => {
      const response = { data: { success: true, data: [1, 2, 3] } };

      const result = interceptors.responseSuccess(response);

      expect(result).toEqual(response.data);
    });

    it("logs error and rejects on response error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = {
        response: { data: "Server Error" },
        message: "Request failed with status code 500",
      };

      await expect(interceptors.responseError(error)).rejects.toEqual(error);

      expect(consoleSpy).toHaveBeenCalledWith("ASP.NET API Error:", "Server Error");

      consoleSpy.mockRestore();
    });

    it("logs error.message when error.response is undefined", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Network Error");

      await expect(interceptors.responseError(error)).rejects.toEqual(error);

      expect(consoleSpy).toHaveBeenCalledWith("ASP.NET API Error:", "Network Error");

      consoleSpy.mockRestore();
    });
  });

  describe("planService", () => {
    it("getAllPlans calls GET /Plan", async () => {
      mockGet.mockResolvedValueOnce([{ id: 1, name: "Gold" }]);

      const result = await planService.getAllPlans();

      expect(mockGet).toHaveBeenCalledWith("/Plan");
      expect(result).toEqual([{ id: 1, name: "Gold" }]);
    });

    it("getPlanById calls GET /Plan/{id}", async () => {
      mockGet.mockResolvedValueOnce({ id: 2, name: "Silver" });

      const result = await planService.getPlanById(2);

      expect(mockGet).toHaveBeenCalledWith("/Plan/2");
      expect(result).toEqual({ id: 2, name: "Silver" });
    });

    it("createPlan calls POST /Plan", async () => {
      const payload = { name: "Bronze", price: 10 };
      mockPost.mockResolvedValueOnce({ id: 3, ...payload });

      const result = await planService.createPlan(payload);

      expect(mockPost).toHaveBeenCalledWith("/Plan", payload);
      expect(result).toEqual({ id: 3, ...payload });
    });

    it("updatePlan calls PUT /Plan/{id}", async () => {
      const payload = { name: "Gold Plus", price: 50 };
      mockPut.mockResolvedValueOnce({ id: 1, ...payload });

      const result = await planService.updatePlan(1, payload);

      expect(mockPut).toHaveBeenCalledWith("/Plan/1", payload);
      expect(result).toEqual({ id: 1, ...payload });
    });

    it("deletePlan calls DELETE /Plan/{id}", async () => {
      mockDelete.mockResolvedValueOnce({ success: true });

      const result = await planService.deletePlan(1);

      expect(mockDelete).toHaveBeenCalledWith("/Plan/1");
      expect(result).toEqual({ success: true });
    });
  });

  describe("subscriptionService", () => {
    it("purchaseSubscription calls POST /Subscription/purchase", async () => {
      const payload = { planId: 1, userId: "u-123" };
      mockPost.mockResolvedValueOnce({ subscriptionId: "sub-1" });

      const result = await subscriptionService.purchaseSubscription(payload);

      expect(mockPost).toHaveBeenCalledWith("/Subscription/purchase", payload);
      expect(result).toEqual({ subscriptionId: "sub-1" });
    });

    it("recordProductView calls POST /Subscription/view/{userId}", async () => {
      mockPost.mockResolvedValueOnce({ viewsLeft: 9 });

      const result = await subscriptionService.recordProductView("u-123");

      expect(mockPost).toHaveBeenCalledWith("/Subscription/view/u-123");
      expect(result).toEqual({ viewsLeft: 9 });
    });

    it("getRemainingViews calls GET /Subscription/remaining/{userId}", async () => {
      mockGet.mockResolvedValueOnce({ count: 10 });

      const result = await subscriptionService.getRemainingViews("u-123");

      expect(mockGet).toHaveBeenCalledWith("/Subscription/remaining/u-123");
      expect(result).toEqual({ count: 10 });
    });

    it("checkCanViewProduct calls GET /Subscription/canview/{userId}", async () => {
      mockGet.mockResolvedValueOnce({ canView: true });

      const result = await subscriptionService.checkCanViewProduct("u-123");

      expect(mockGet).toHaveBeenCalledWith("/Subscription/canview/u-123");
      expect(result).toEqual({ canView: true });
    });

    it("checkIsExpired calls GET /Subscription/isexpired/{userId}", async () => {
      mockGet.mockResolvedValueOnce({ expired: false });

      const result = await subscriptionService.checkIsExpired("u-123");

      expect(mockGet).toHaveBeenCalledWith("/Subscription/isexpired/u-123");
      expect(result).toEqual({ expired: false });
    });

    it("getUserSubscription calls GET /Subscription/user/{userId}", async () => {
      mockGet.mockResolvedValueOnce({ id: "sub-100", active: true });

      const result = await subscriptionService.getUserSubscription("u-123");

      expect(mockGet).toHaveBeenCalledWith("/Subscription/user/u-123");
      expect(result).toEqual({ id: "sub-100", active: true });
    });

    it("renewSubscription calls POST /Subscription/renew/{userId}", async () => {
      mockPost.mockResolvedValueOnce({ renewed: true });

      const result = await subscriptionService.renewSubscription("u-123");

      expect(mockPost).toHaveBeenCalledWith("/Subscription/renew/u-123");
      expect(result).toEqual({ renewed: true });
    });

    it("cancelSubscription calls POST /Subscription/cancel/{userId}", async () => {
      mockPost.mockResolvedValueOnce({ cancelled: true });

      const result = await subscriptionService.cancelSubscription("u-123");

      expect(mockPost).toHaveBeenCalledWith("/Subscription/cancel/u-123");
      expect(result).toEqual({ cancelled: true });
    });
  });

  describe("paymentService", () => {
    it("getAllPayments calls GET /Payment", async () => {
      mockGet.mockResolvedValueOnce([{ id: "p-1", amount: 100 }]);

      const result = await paymentService.getAllPayments();

      expect(mockGet).toHaveBeenCalledWith("/Payment");
      expect(result).toEqual([{ id: "p-1", amount: 100 }]);
    });

    it("getPaymentById calls GET /Payment/{id}", async () => {
      mockGet.mockResolvedValueOnce({ id: "p-1", amount: 100 });

      const result = await paymentService.getPaymentById("p-1");

      expect(mockGet).toHaveBeenCalledWith("/Payment/p-1");
      expect(result).toEqual({ id: "p-1", amount: 100 });
    });

    it("processPayment calls POST /Payment", async () => {
      const payload = { amount: 100, currency: "USD" };
      mockPost.mockResolvedValueOnce({ status: "success", transactionId: "tx-123" });

      const result = await paymentService.processPayment(payload);

      expect(mockPost).toHaveBeenCalledWith("/Payment", payload);
      expect(result).toEqual({ status: "success", transactionId: "tx-123" });
    });

    it("deletePayment calls DELETE /Payment/{id}", async () => {
      mockDelete.mockResolvedValueOnce({ deleted: true });

      const result = await paymentService.deletePayment("p-1");

      expect(mockDelete).toHaveBeenCalledWith("/Payment/p-1");
      expect(result).toEqual({ deleted: true });
    });
  });

  describe("invoiceService", () => {
    it("getAllInvoices calls GET /Invoice", async () => {
      mockGet.mockResolvedValueOnce([{ id: "inv-1", total: 100 }]);

      const result = await invoiceService.getAllInvoices();

      expect(mockGet).toHaveBeenCalledWith("/Invoice");
      expect(result).toEqual([{ id: "inv-1", total: 100 }]);
    });

    it("getInvoiceById calls GET /Invoice/{id}", async () => {
      mockGet.mockResolvedValueOnce({ id: "inv-1", total: 100 });

      const result = await invoiceService.getInvoiceById("inv-1");

      expect(mockGet).toHaveBeenCalledWith("/Invoice/inv-1");
      expect(result).toEqual({ id: "inv-1", total: 100 });
    });

    it("generateInvoice calls POST /Invoice", async () => {
      const payload = { subscriptionId: "sub-1", amount: 100 };
      mockPost.mockResolvedValueOnce({ id: "inv-2", ...payload });

      const result = await invoiceService.generateInvoice(payload);

      expect(mockPost).toHaveBeenCalledWith("/Invoice", payload);
      expect(result).toEqual({ id: "inv-2", ...payload });
    });

    it("updateInvoice calls PUT /Invoice/{id}", async () => {
      const payload = { status: "PAID" };
      mockPut.mockResolvedValueOnce({ id: "inv-1", status: "PAID" });

      const result = await invoiceService.updateInvoice("inv-1", payload);

      expect(mockPut).toHaveBeenCalledWith("/Invoice/inv-1", payload);
      expect(result).toEqual({ id: "inv-1", status: "PAID" });
    });

    it("deleteInvoice calls DELETE /Invoice/{id}", async () => {
      mockDelete.mockResolvedValueOnce({ deleted: true });

      const result = await invoiceService.deleteInvoice("inv-1");

      expect(mockDelete).toHaveBeenCalledWith("/Invoice/inv-1");
      expect(result).toEqual({ deleted: true });
    });
  });
});