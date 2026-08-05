import { describe, it, expect, vi, beforeEach } from "vitest";
import productApi from "./productApi";
import authApi from "./authApi";

vi.mock("./authApi", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("productApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets all products", async () => {
    const products = [{ id: 1 }, { id: 2 }];

    authApi.get.mockResolvedValue({
      data: { data: products },
    });

    const result = await productApi.getProducts();

    expect(authApi.get).toHaveBeenCalledWith("/products", {
      params: {},
    });

    expect(result).toEqual(products);
  });

  it("gets products with params", async () => {
    authApi.get.mockResolvedValue({
      data: { data: [] },
    });

    await productApi.getProducts({
      page: 1,
      size: 10,
    });

    expect(authApi.get).toHaveBeenCalledWith("/products", {
      params: {
        page: 1,
        size: 10,
      },
    });
  });

  it("gets single product", async () => {
    const product = { id: 5 };

    authApi.get.mockResolvedValue({
      data: { data: product },
    });

    const result = await productApi.getProduct(5);

    expect(authApi.get).toHaveBeenCalledWith("/products/5");
    expect(result).toEqual(product);
  });

  it("creates product", async () => {
    const payload = {
      title: "Laptop",
      price: 500,
    };

    authApi.post.mockResolvedValue({
      data: { data: payload },
    });

    const result = await productApi.createProduct(payload);

    expect(authApi.post).toHaveBeenCalledWith(
      "/products",
      payload
    );

    expect(result).toEqual(payload);
  });

  it("updates product", async () => {
    const payload = {
      title: "Updated",
    };

    authApi.put.mockResolvedValue({
      data: { data: payload },
    });

    const result = await productApi.updateProduct(
      2,
      payload
    );

    expect(authApi.put).toHaveBeenCalledWith(
      "/products/2",
      payload
    );

    expect(result).toEqual(payload);
  });

  it("deletes product", async () => {
    authApi.delete.mockResolvedValue({
      data: {
        data: true,
      },
    });

    const result =
      await productApi.deleteProduct(10);

    expect(authApi.delete).toHaveBeenCalledWith(
      "/products/10"
    );

    expect(result).toBe(true);
  });

  it("searches products", async () => {
    authApi.get.mockResolvedValue({
      data: {
        data: [],
      },
    });

    await productApi.searchProducts("phone");

    expect(authApi.get).toHaveBeenCalledWith(
      "/products/search",
      {
        params: {
          keyword: "phone",
        },
      }
    );
  });

  it("gets my products", async () => {
    authApi.get.mockResolvedValue({
      data: {
        data: [{ id: 1 }],
      },
    });

    const result =
      await productApi.getMyProducts();

    expect(authApi.get).toHaveBeenCalledWith(
      "/products/my-products"
    );

    expect(result).toEqual([{ id: 1 }]);
  });

  it("uploads images", async () => {
    const formData = new FormData();

    const progress = vi.fn();

    authApi.post.mockResolvedValue({
      data: {
        data: true,
      },
    });

    const result =
      await productApi.uploadImages(
        7,
        formData,
        progress
      );

    expect(authApi.post).toHaveBeenCalledWith(
      "/products/7/images",
      formData,
      {
        onUploadProgress: progress,
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    expect(result).toBe(true);
  });

  it("gets product images", async () => {
    authApi.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            imageUrl: "a.jpg",
          },
          {
            id: 2,
            imageUrl: "b.jpg",
          },
        ],
      },
    });

    const result =
      await productApi.getImages(3);

    expect(authApi.get).toHaveBeenCalledWith(
      "/products/3/images"
    );

    expect(result).toEqual([
      {
        id: 1,
        url: "a.jpg",
      },
      {
        id: 2,
        url: "b.jpg",
      },
    ]);
  });

  it("deletes image", async () => {
    authApi.delete.mockResolvedValue({
      data: {
        data: true,
      },
    });

    const result =
      await productApi.deleteImage(20);

    expect(authApi.delete).toHaveBeenCalledWith(
      "/images/20"
    );

    expect(result).toBe(true);
  });
});