import { describe, it, expect, beforeEach, vi } from "vitest";

// ===============================
// Mock react-hot-toast
// ===============================

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
}));

// ===============================
// Mock SockJS
// ===============================

vi.mock("sockjs-client", () => {
  return {
    default: class SockJSMock {
      constructor(url) {
        this.url = url;
      }
    },
  };
});vi.mock("sockjs-client", () => {
  return {
    default: class SockJSMock {
      constructor(url) {
        this.url = url;
      }
    },
  };
});

// ===============================
// Mock STOMP Client
// ===============================

let stompConfig;

const mockActivate = vi.fn();
const mockDeactivate = vi.fn();
const mockPublish = vi.fn();
const mockSubscribe = vi.fn();

const client = {
  active: false,
  activate: mockActivate,
  deactivate: mockDeactivate,
  publish: mockPublish,
  subscribe: mockSubscribe,
};

vi.mock("@stomp/stompjs", () => {
  return {
    Client: class {
      constructor(config) {
        stompConfig = config;
        return client;
      }
    },
  };
});

// ===============================
// Import after mocks
// ===============================

import toast from "react-hot-toast";
import SockJS from "sockjs-client";
import webSocketService from "./webSocketService";

// ===============================
// Tests
// ===============================

describe("WebSocketService", () => {
  const token = "jwt-token";

  beforeEach(() => {
    vi.clearAllMocks();

    stompConfig = undefined;

    client.active = false;

    webSocketService.client = null;
    webSocketService.isConnected = false;
    webSocketService.subscriptions.clear();
    webSocketService.connectionListeners = [];
  });

  // ==================================
  // connect()
  // ==================================

  describe("connect()", () => {

    it("creates STOMP client", () => {

      webSocketService.connect(token);

      expect(webSocketService.client).toBe(client);

      expect(mockActivate).toHaveBeenCalledTimes(1);

      expect(stompConfig.connectHeaders).toEqual({
        Authorization: `Bearer ${token}`,
      });

      expect(stompConfig.reconnectDelay).toBe(5000);

      expect(stompConfig.heartbeatIncoming).toBe(4000);

      expect(stompConfig.heartbeatOutgoing).toBe(4000);
    });

   it("creates SockJS connection", () => {
  webSocketService.connect(token);

  expect(() => {
    stompConfig.webSocketFactory();
  }).not.toThrow();
});

    it("does not reconnect when already active", () => {

      client.active = true;

      webSocketService.client = client;

      webSocketService.connect(token);

      expect(mockActivate).not.toHaveBeenCalled();

    });

    it("updates state on connect", () => {

      const listener = vi.fn();

      webSocketService.addConnectionListener(listener);

      webSocketService.connect(token);

      stompConfig.onConnect();

      expect(webSocketService.isConnected).toBe(true);

      expect(listener).toHaveBeenLastCalledWith(true);

    });

    it("updates state on disconnect callback", () => {

      webSocketService.connect(token);

      stompConfig.onConnect();

      expect(webSocketService.isConnected).toBe(true);

      stompConfig.onDisconnect();

      expect(webSocketService.isConnected).toBe(false);

    });

    it("shows toast on AccessDeniedException", () => {

      webSocketService.connect(token);

      stompConfig.onStompError({
        headers: {
          message: "AccessDeniedException",
        },
        body: "Unauthorized",
      });

      expect(toast.error).toHaveBeenCalledWith(
        "WebSocket connection denied. Please log in again."
      );

    });

    it("ignores normal STOMP errors", () => {

      webSocketService.connect(token);

      stompConfig.onStompError({
        headers: {
          message: "Some Other Error",
        },
        body: "details",
      });

      expect(toast.error).not.toHaveBeenCalled();

    });

  });
    // ==================================
  // disconnect()
  // ==================================

  describe("disconnect()", () => {

    it("deactivates websocket client", () => {

      const listener = vi.fn();

      webSocketService.addConnectionListener(listener);

      webSocketService.connect(token);

      stompConfig.onConnect();

      webSocketService.disconnect();

      expect(mockDeactivate).toHaveBeenCalledTimes(1);

      expect(webSocketService.isConnected).toBe(false);

      expect(listener).toHaveBeenLastCalledWith(false);

    });

    it("does nothing if client is null", () => {

      webSocketService.client = null;

      expect(() => {
        webSocketService.disconnect();
      }).not.toThrow();

    });

  });

  // ==================================
  // subscribe()
  // ==================================

  describe("subscribe()", () => {

    it("stores subscription", () => {

      const callback = vi.fn();

      const unsubscribe = webSocketService.subscribe(
        "/topic/test",
        callback
      );

      expect(webSocketService.subscriptions.size).toBe(1);

      expect(typeof unsubscribe).toBe("function");

    });

    it("subscribes immediately when connected", () => {

      const unsubscribeMock = vi.fn();

      mockSubscribe.mockReturnValue({
        unsubscribe: unsubscribeMock,
      });

      webSocketService.connect(token);

      stompConfig.onConnect();

      const unsubscribe = webSocketService.subscribe(
        "/topic/test",
        vi.fn()
      );

      expect(mockSubscribe).toHaveBeenCalledTimes(1);

      expect(mockSubscribe).toHaveBeenCalledWith(
        "/topic/test",
        expect.any(Function)
      );

      unsubscribe();

      expect(unsubscribeMock).toHaveBeenCalled();

      expect(webSocketService.subscriptions.size).toBe(0);

    });

    it("resubscribes after reconnect", () => {

      webSocketService.subscribe(
        "/topic/chat",
        vi.fn()
      );

      expect(webSocketService.subscriptions.size).toBe(1);

      webSocketService.connect(token);

      stompConfig.onConnect();

      expect(mockSubscribe).toHaveBeenCalledWith(
        "/topic/chat",
        expect.any(Function)
      );

    });

    it("parses JSON messages", () => {

      let handler;

      mockSubscribe.mockImplementation((topic, cb) => {

        handler = cb;

        return {
          unsubscribe: vi.fn(),
        };

      });

      const callback = vi.fn();

      webSocketService.connect(token);

      stompConfig.onConnect();

      webSocketService.subscribe(
        "/topic/json",
        callback
      );

      handler({
        body: JSON.stringify({
          id: 10,
          message: "hello",
        }),
      });

      expect(callback).toHaveBeenCalledWith({
        id: 10,
        message: "hello",
      });

    });

    it("falls back to plain text", () => {

      let handler;

      mockSubscribe.mockImplementation((topic, cb) => {

        handler = cb;

        return {
          unsubscribe: vi.fn(),
        };

      });

      const callback = vi.fn();

      webSocketService.connect(token);

      stompConfig.onConnect();

      webSocketService.subscribe(
        "/topic/text",
        callback
      );

      handler({
        body: "plain text",
      });

      expect(callback).toHaveBeenCalledWith(
        "plain text"
      );

    });

    it("removes subscription after unsubscribe", () => {

      mockSubscribe.mockReturnValue({
        unsubscribe: vi.fn(),
      });

      webSocketService.connect(token);

      stompConfig.onConnect();

      const unsubscribe = webSocketService.subscribe(
        "/topic/remove",
        vi.fn()
      );

      expect(webSocketService.subscriptions.size).toBe(1);

      unsubscribe();

      expect(webSocketService.subscriptions.size).toBe(0);

    });

  });

    // ==================================
  // sendBid()
  // ==================================

  describe("sendBid()", () => {

    it("publishes bid when connected", () => {

      webSocketService.client = client;
      webSocketService.isConnected = true;

      webSocketService.sendBid(1, 500);

      expect(mockPublish).toHaveBeenCalledWith({
        destination: "/app/auction.bid",
        body: JSON.stringify({
          auctionId: 1,
          bidAmount: 500,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

    });

    it("shows toast when disconnected", () => {

      webSocketService.client = null;
      webSocketService.isConnected = false;

      webSocketService.sendBid(1, 500);

      expect(toast.error).toHaveBeenCalledWith(
        "WebSocket not connected"
      );

    });

  });

  // ==================================
  // sendChatMessage()
  // ==================================

  describe("sendChatMessage()", () => {

    it("publishes chat message when connected", () => {

      webSocketService.client = client;
      webSocketService.isConnected = true;

      webSocketService.sendChatMessage(12, "Hello");

      expect(mockPublish).toHaveBeenCalledWith({
        destination: "/app/chat.send",
        body: JSON.stringify({
          conversationId: 12,
          message: "Hello",
        }),
        headers: {
          "content-type": "application/json",
        },
      });

    });

    it("shows toast when disconnected", () => {

      webSocketService.client = null;
      webSocketService.isConnected = false;

      webSocketService.sendChatMessage(12, "Hello");

      expect(toast.error).toHaveBeenCalledWith(
        "WebSocket not connected"
      );

    });

  });

  // ==================================
  // addConnectionListener()
  // ==================================

  describe("addConnectionListener()", () => {

    it("adds listener and calls it immediately", () => {

      const listener = vi.fn();

      const remove = webSocketService.addConnectionListener(listener);

      expect(listener).toHaveBeenCalledWith(false);

      webSocketService.notifyConnectionListeners(true);

      expect(listener).toHaveBeenLastCalledWith(true);

      remove();

      expect(webSocketService.connectionListeners).toHaveLength(0);

    });

  });

  // ==================================
  // notifyConnectionListeners()
  // ==================================

  describe("notifyConnectionListeners()", () => {

    it("notifies all listeners", () => {

      const l1 = vi.fn();
      const l2 = vi.fn();

      webSocketService.addConnectionListener(l1);
      webSocketService.addConnectionListener(l2);

      webSocketService.notifyConnectionListeners(true);

      expect(l1).toHaveBeenLastCalledWith(true);
      expect(l2).toHaveBeenLastCalledWith(true);

    });

  });

});