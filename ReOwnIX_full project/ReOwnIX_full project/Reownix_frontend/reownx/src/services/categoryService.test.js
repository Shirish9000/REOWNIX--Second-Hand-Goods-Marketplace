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
import categoryService from "./categoryService";

describe("categoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCategories", () => {
    it("fetches categories list with optional parameters", async () => {
      const params = { page: 1, limit: 10 };
      const mockCategories = [{ id: 1, name: "Electronics" }];
      authApi.get.mockResolvedValueOnce({ data: { data: mockCategories } });

      const result = await categoryService.getCategories(params);

      expect(authApi.get).toHaveBeenCalledWith("/categories", { params });
      expect(result).toEqual(mockCategories);
    });
  });

  describe("getCategory", () => {
    it("fetches a single category by ID", async () => {
      const mockCategory = { id: 5, name: "Books" };
      authApi.get.mockResolvedValueOnce({ data: { data: mockCategory } });

      const result = await categoryService.getCategory(5);

      expect(authApi.get).toHaveBeenCalledWith("/categories/5");
      expect(result).toEqual(mockCategory);
    });
  });

  describe("createCategory", () => {
    it("creates a new category", async () => {
      const payload = { name: "Home & Kitchen" };
      const createdCategory = { id: 12, name: "Home & Kitchen" };
      authApi.post.mockResolvedValueOnce({ data: { data: createdCategory } });

      const result = await categoryService.createCategory(payload);

      expect(authApi.post).toHaveBeenCalledWith("/categories", payload);
      expect(result).toEqual(createdCategory);
    });
  });

  describe("updateCategory", () => {
    it("updates an existing category by ID", async () => {
      const payload = { name: "Updated Category Name" };
      const updatedCategory = { id: 12, name: "Updated Category Name" };
      authApi.put.mockResolvedValueOnce({ data: { data: updatedCategory } });

      const result = await categoryService.updateCategory(12, payload);

      expect(authApi.put).toHaveBeenCalledWith("/categories/12", payload);
      expect(result).toEqual(updatedCategory);
    });
  });

  describe("deleteCategory", () => {
    it("deletes a category by ID", async () => {
      const mockResponseData = { success: true, id: 12 };
      authApi.delete.mockResolvedValueOnce({ data: { data: mockResponseData } });

      const result = await categoryService.deleteCategory(12);

      expect(authApi.delete).toHaveBeenCalledWith("/categories/12");
      expect(result).toEqual(mockResponseData);
    });
  });
});