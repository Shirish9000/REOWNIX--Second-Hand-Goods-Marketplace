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
import chatApi from "./chatApi";

describe("chatApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("fetches all conversations", async () => {
      const mockData = { data: [{ id: "conv-1", title: "General Chat" }] };
      authApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await chatApi.list();

      expect(authApi.get).toHaveBeenCalledWith("/chat");
      expect(result).toEqual(mockData);
    });
  });

  describe("getMessages", () => {
    it("fetches messages for a specific conversation ID", async () => {
      const mockData = {
        data: [
          { id: "m-1", text: "Hello" },
          { id: "m-2", text: "Hi there!" },
        ],
      };
      authApi.get.mockResolvedValueOnce({ data: mockData });

      const result = await chatApi.getMessages("conv-123");

      expect(authApi.get).toHaveBeenCalledWith("/chat/conv-123/messages");
      expect(result).toEqual(mockData);
    });
  });

  describe("start", () => {
    it("starts a new chat for a product", async () => {
      const payload = { productId: 456, message: "Is this item available?" };
      const mockData = { data: { conversationId: "conv-999" } };
      authApi.post.mockResolvedValueOnce({ data: mockData });

      const result = await chatApi.start(payload);

      expect(authApi.post).toHaveBeenCalledWith("/chat/start", payload);
      expect(result).toEqual(mockData);
    });
  });

  describe("sendMessage", () => {
    it("sends a new message to an existing conversation", async () => {
      const payload = { message: "Can you lower the price?" };
      const mockData = { data: { id: "m-3", text: payload.message } };
      authApi.post.mockResolvedValueOnce({ data: mockData });

      const result = await chatApi.sendMessage("conv-123", payload);

      expect(authApi.post).toHaveBeenCalledWith(
        "/chat/conv-123/messages",
        payload
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("markRead", () => {
    it("marks a conversation as read", async () => {
      const mockData = { success: true };
      authApi.put.mockResolvedValueOnce({ data: mockData });

      const result = await chatApi.markRead("conv-123");

      expect(authApi.put).toHaveBeenCalledWith("/chat/conv-123/read");
      expect(result).toEqual(mockData);
    });
  });

  describe("remove", () => {
    it("deletes a conversation by ID", async () => {
      const mockData = { success: true, id: "conv-123" };
      authApi.delete.mockResolvedValueOnce({ data: mockData });

      const result = await chatApi.remove("conv-123");

      expect(authApi.delete).toHaveBeenCalledWith("/chat/conv-123");
      expect(result).toEqual(mockData);
    });
  });
});