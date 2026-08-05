import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./chatApi", () => ({
  default: {
    list: vi.fn(),
    getMessages: vi.fn(),
    start: vi.fn(),
    sendMessage: vi.fn(),
    markRead: vi.fn(),
    remove: vi.fn(),
  },
}));

import chatApi from "./chatApi";
import chatService from "./chatService";

describe("chatService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listConversations", () => {
    it("delegates to chatApi.list", async () => {
      const mockConversations = [{ id: "conv-1", title: "Product Inquiry" }];
      chatApi.list.mockResolvedValueOnce(mockConversations);

      const result = await chatService.listConversations();

      expect(chatApi.list).toHaveBeenCalledWith();
      expect(result).toEqual(mockConversations);
    });
  });

  describe("getMessages", () => {
    it("delegates to chatApi.getMessages with conversationId", async () => {
      const mockMessages = [{ id: "msg-1", text: "Is this still available?" }];
      chatApi.getMessages.mockResolvedValueOnce(mockMessages);

      const result = await chatService.getMessages("conv-100");

      expect(chatApi.getMessages).toHaveBeenCalledWith("conv-100");
      expect(result).toEqual(mockMessages);
    });
  });

  describe("startConversation", () => {
    it("wraps productId into a payload object and delegates to chatApi.start", async () => {
      const mockResult = { id: "conv-101", productId: 45 };
      chatApi.start.mockResolvedValueOnce(mockResult);

      const result = await chatService.startConversation(45);

      expect(chatApi.start).toHaveBeenCalledWith({ productId: 45 });
      expect(result).toEqual(mockResult);
    });
  });

  describe("sendMessage", () => {
    it("wraps message text into a payload object and delegates to chatApi.sendMessage", async () => {
      const mockResult = { id: "msg-2", text: "Yes, it is!" };
      chatApi.sendMessage.mockResolvedValueOnce(mockResult);

      const result = await chatService.sendMessage("conv-100", "Yes, it is!");

      expect(chatApi.sendMessage).toHaveBeenCalledWith("conv-100", {
        message: "Yes, it is!",
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe("markRead", () => {
    it("delegates to chatApi.markRead with conversationId", async () => {
      const mockResult = { success: true };
      chatApi.markRead.mockResolvedValueOnce(mockResult);

      const result = await chatService.markRead("conv-100");

      expect(chatApi.markRead).toHaveBeenCalledWith("conv-100");
      expect(result).toEqual(mockResult);
    });
  });

  describe("deleteConversation", () => {
    it("delegates to chatApi.remove with conversationId", async () => {
      const mockResult = { success: true };
      chatApi.remove.mockResolvedValueOnce(mockResult);

      const result = await chatService.deleteConversation("conv-100");

      expect(chatApi.remove).toHaveBeenCalledWith("conv-100");
      expect(result).toEqual(mockResult);
    });
  });
});