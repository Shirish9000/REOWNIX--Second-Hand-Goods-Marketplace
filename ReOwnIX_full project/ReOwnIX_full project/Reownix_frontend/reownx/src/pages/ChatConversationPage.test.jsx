import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ChatConversationPage from "./ChatConversationPage";


// Mock Auth Context
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      userId: 1,
      username: "John"
    }
  })
}));


// Mock toast
vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn()
  }
}));


// Mock chat service
const mockMessages = [
  {
    messageId: 1,
    senderId: 2,
    senderName: "Alice",
    message: "Hello",
    createdAt: "2026-08-04T10:00:00"
  },
  {
    messageId: 2,
    senderId: 1,
    senderName: "John",
    message: "Hi",
    createdAt: "2026-08-04T10:01:00"
  }
];


vi.mock("../services/chatService", () => ({
  default: {
    getMessages: vi.fn(() => Promise.resolve(mockMessages)),

    listConversations: vi.fn(() =>
      Promise.resolve([
        {
          conversationId: 10,
          otherUserName: "Alice",
          productId: 5,
          productTitle: "iPhone 15"
        }
      ])
    ),

    markRead: vi.fn(() => Promise.resolve()),

    sendMessage: vi.fn(() => Promise.resolve())
  }
}));


import chatService from "../services/chatService";


describe("ChatConversationPage Component", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  const renderPage = () => {
    render(
      <MemoryRouter initialEntries={["/chat/10"]}>
        <Routes>
          <Route
            path="/chat/:conversationId"
            element={<ChatConversationPage />}
          />
        </Routes>
      </MemoryRouter>
    );
  };


  it("shows loading initially and renders conversation", async () => {

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("Alice")
      ).toBeInTheDocument();
    });


    expect(
      screen.getByText("iPhone 15")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Hello")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Hi")
    ).toBeInTheDocument();

  });



  it("calls markRead when page loads", async () => {

    renderPage();


    await waitFor(() => {
      expect(
        chatService.markRead
      ).toHaveBeenCalledWith("10");
    });

  });



  it("sends a message", async () => {

    renderPage();


    await waitFor(() =>
      screen.getByPlaceholderText("Type a message...")
    );


    const input =
      screen.getByPlaceholderText("Type a message...");


    fireEvent.change(input, {
      target: {
        value: "New message"
      }
    });


   const buttons = screen.getAllByRole("button");

// Last button is the send icon button
const sendButton = buttons[buttons.length - 1];

fireEvent.click(sendButton);

    await waitFor(() => {

      expect(
        chatService.sendMessage
      ).toHaveBeenCalledWith(
        "10",
        "New message"
      );

    });

  });



  it("opens offer input", async () => {

    renderPage();


    await waitFor(() =>
      screen.getByText("Make Offer")
    );


    fireEvent.click(
      screen.getByText("Make Offer")
    );


    expect(
      screen.getByPlaceholderText("Offer amount...")
    ).toBeInTheDocument();

  });



  it("sends offer message", async () => {

    renderPage();


    await waitFor(() =>
      screen.getByText("Make Offer")
    );


    fireEvent.click(
      screen.getByText("Make Offer")
    );


    const offerInput =
      screen.getByPlaceholderText("Offer amount...");


    fireEvent.change(
      offerInput,
      {
        target:{
          value:"50000"
        }
      }
    );


    fireEvent.click(
      screen.getByText("Send Offer")
    );


    await waitFor(()=>{

      expect(
        chatService.sendMessage
      ).toHaveBeenCalled();

    });


    const call =
      chatService.sendMessage.mock.calls[0];


    expect(call[0]).toBe("10");

    expect(
      call[1]
    ).toContain("OFFER");

  });



  it("renders offer accept and reject buttons", async () => {

    chatService.getMessages.mockResolvedValueOnce([
      {
        messageId:3,
        senderId:2,
        senderName:"Alice",
        message:JSON.stringify({
          type:"OFFER",
          amount:50000,
          status:"PENDING"
        }),
        createdAt:"2026-08-04T10:00:00"
      }
    ]);


    renderPage();


    await waitFor(()=>{

      expect(
        screen.getByText("Made an Offer")
      ).toBeInTheDocument();

    });


    expect(
      screen.getByText("Accept")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Reject")
    ).toBeInTheDocument();

  });

});