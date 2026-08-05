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
import productApi from "./productApi";

describe("productApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProducts", () => {
    it("fetches products with default query parameters", async () => {
      const mockData = { data: [{ id: 1, name: "Product A" }] };
      authApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await productApi.getProducts();

      expect(authApi.get).toHaveBeenCalledWith("/products", { params: {} });
      expect(result).toEqual(mockData.data);
    });

    it("fetches products with provided query parameters", async () => {
      const params = { page: 1, limit: 10 };
      authApi.get.mockResolvedValueOnce({ data: { data: [] } });

      await productApi.getProducts(params);

      expect(authApi.get).toHaveBeenCalledWith("/products", { params });
    });
  });

  describe("getProduct", () => {
    it("fetches a single product by ID", async () => {
      const mockProduct = { id: 101, name: "Keyboard" };
      authApi.get.mockResolvedValueOnce({ data: { data: mockProduct } });

      const result = await productApi.getProduct(101);

      expect(authApi.get).toHaveBeenCalledWith("/products/101");
      expect(result).toEqual(mockProduct);
    });
  });

  describe("createProduct", () => {
    it("creates a product payload and logs progress", async () => {
      const payload = { name: "Mouse", price: 25 };
      const responseData = { data: { id: 2, ...payload } };
      authApi.post.mockResolvedValueOnce({ data: responseData });

      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await productApi.createProduct(payload);

      expect(authApi.post).toHaveBeenCalledWith("/products", payload);
      expect(result).toEqual(responseData.data);

      // Verify individual console.log calls as written in original code
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, "Sending Product");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, payload);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(3, "Product Created");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(4, responseData);

      consoleLogSpy.mockRestore();
    });
  });

  describe("updateProduct", () => {
    it("updates an existing product by ID", async () => {
      const payload = { name: "Updated Name" };
      const updatedData = { id: 5, name: "Updated Name" };
      authApi.put.mockResolvedValueOnce({ data: { data: updatedData } });

      const result = await productApi.updateProduct(5, payload);

      expect(authApi.put).toHaveBeenCalledWith("/products/5", payload);
      expect(result).toEqual(updatedData);
    });
  });

  describe("deleteProduct", () => {
    it("deletes a product by ID", async () => {
      authApi.delete.mockResolvedValueOnce({ data: { data: { success: true } } });

      const result = await productApi.deleteProduct(10);

      expect(authApi.delete).toHaveBeenCalledWith("/products/10");
      expect(result).toEqual({ success: true });
    });
  });

  describe("searchProducts", () => {
    it("calls search endpoint with keyword query parameter", async () => {
      authApi.get.mockResolvedValueOnce({ data: { data: [{ id: 1 }] } });

      await productApi.searchProducts("laptop");

      expect(authApi.get).toHaveBeenCalledWith("/products/search", {
        params: { keyword: "laptop" },
      });
    });
  });

  describe("getMyProducts", () => {
    it("calls user's products endpoint", async () => {
      authApi.get.mockResolvedValueOnce({ data: { data: [] } });

      await productApi.getMyProducts();

      expect(authApi.get).toHaveBeenCalledWith("/products/my-products");
    });
  });

  describe("uploadImages", () => {
    it("sends multi-part form data with upload progress handler", async () => {
      const formData = new FormData();
      const onProgress = vi.fn();
      authApi.post.mockResolvedValueOnce({ data: { data: { uploaded: true } } });

      const result = await productApi.uploadImages(123, formData, onProgress);

      expect(authApi.post).toHaveBeenCalledWith(
        "/products/123/images",
        formData,
        {
          onUploadProgress: onProgress,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      expect(result).toEqual({ uploaded: true });
    });
  });

  describe("getImages", () => {
    it("fetches and maps image objects to standard shape { id, url }", async () => {
      const mockRawImages = [
        { id: "img-1", imageUrl: "https://example.com/1.png", extraField: "abc" },
        { id: "img-2", imageUrl: "https://example.com/2.png", extraField: "xyz" },
      ];

      authApi.get.mockResolvedValueOnce({ data: { data: mockRawImages } });

      const result = await productApi.getImages(45);

      expect(authApi.get).toHaveBeenCalledWith("/products/45/images");
      expect(result).toEqual([
        { id: "img-1", url: "https://example.com/1.png" },
        { id: "img-2", url: "https://example.com/2.png" },
      ]);
    });
  });

  describe("deleteImage", () => {
    it("deletes a specific image by imageId", async () => {
      authApi.delete.mockResolvedValueOnce({ data: { data: { deleted: true } } });

      const result = await productApi.deleteImage("img-999");

      expect(authApi.delete).toHaveBeenCalledWith("/images/img-999");
      expect(result).toEqual({ deleted: true });
    });
  });
});