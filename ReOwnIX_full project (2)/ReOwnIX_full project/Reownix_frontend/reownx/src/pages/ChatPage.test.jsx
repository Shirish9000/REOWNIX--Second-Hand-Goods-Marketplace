import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import ChatPage from "./ChatPage";

import chatService from "../services/chatService";
import webSocketService from "../services/webSocketService";
import offerApi from "../services/offerApi";

vi.mock("../services/chatService", () => ({
  default: {
    listConversations: vi.fn(),
    getMessages: vi.fn(),
    markRead: vi.fn(),
  },
}));

vi.mock("../services/webSocketService", () => ({
  default: {
    subscribe: vi.fn(() => vi.fn()),
    sendChatMessage: vi.fn(),
  },
}));

vi.mock("../services/offerApi", () => ({
  default: {
    makeOffer: vi.fn(),
    updateOfferStatus: vi.fn(),
  },
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      userId: 1,
    },
  }),
}));


beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();

  vi.clearAllMocks();

  chatService.listConversations.mockResolvedValue([
    {
      conversationId: 1,
      productId: 5,
      productTitle: "iPhone 15",
      otherUserName: "Alice",
      lastMessage: "Hello",
      unreadCount: 0,
    },
  ]);

  chatService.getMessages.mockResolvedValue([
    {
      messageId: 1,
      senderId: 2,
      senderName: "Alice",
      message: "Hello",
      createdAt: new Date().toISOString(),
    },
  ]);

  chatService.markRead.mockResolvedValue();
});


const renderPage = () => {
  render(
    <MemoryRouter initialEntries={["/chat/1"]}>
      <Routes>
        <Route path="/chat/:conversationId" element={<ChatPage />} />
      </Routes>
    </MemoryRouter>
  );
};


describe("ChatPage Component", () => {


  test("renders chat conversations", async () => {

    renderPage();

    expect(
      await screen.findByText("Messages")
    ).toBeInTheDocument();


    expect(
      await screen.findByText("Alice")
    ).toBeInTheDocument();


    const products = await screen.findAllByText("iPhone 15");

expect(products.length).toBeGreaterThan(0);
  });



  test("renders messages", async () => {

    renderPage();


    const messages =
      await screen.findAllByText("Hello");


    expect(messages.length)
      .toBeGreaterThan(0);

  });



  test("sends a message", async () => {

    renderPage();

    const input =
      await screen.findByPlaceholderText(
        "Type a message..."
      );


    await userEvent.type(
      input,
      "New message"
    );


    const buttons =
      screen.getAllByRole("button");


    const sendButton =
      buttons[buttons.length - 1];


    await userEvent.click(sendButton);


    await waitFor(() => {

      expect(
        webSocketService.sendChatMessage
      ).toHaveBeenCalledWith(
        "1",
        "New message"
      );

    });

  });



  test("opens offer form", async () => {

    renderPage();


    const offerButton =
      await screen.findByText(
        "Make Offer"
      );


    await userEvent.click(
      offerButton
    );


    expect(
      screen.getByPlaceholderText(
        "₹ Amount"
      )
    ).toBeInTheDocument();

  });



  test("handles empty conversations", async () => {

    chatService.listConversations
      .mockResolvedValue([]);


    renderPage();


    expect(
      await screen.findByText(
        "No conversations yet"
      )
    ).toBeInTheDocument();

  });


});