import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChatListPage from "./ChatListPage";


// Mock chat service
vi.mock("../services/chatService", () => ({
  default: {
    listConversations: vi.fn()
  }
}));


// Mock toast
vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn()
  }
}));


// Mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});


import chatService from "../services/chatService";


describe("ChatListPage Component", () => {


  beforeEach(() => {
    vi.clearAllMocks();
  });



  it("shows loading initially", () => {

    chatService.listConversations.mockReturnValue(
      new Promise(() => {})
    );


    render(
      <MemoryRouter>
        <ChatListPage />
      </MemoryRouter>
    );


    expect(
      screen.getByRole("progressbar")
    ).toBeInTheDocument();

  });



  it("renders chat list", async () => {

    chatService.listConversations.mockResolvedValue([
      {
        conversationId: 1,
        productTitle: "iPhone 15",
        lastMessage: "Can you reduce the price?",
        unreadCount: 2,
        productThumbnail: "/iphone.png"
      }
    ]);


    render(
      <MemoryRouter>
        <ChatListPage />
      </MemoryRouter>
    );


    await waitFor(() => {

      expect(
        screen.getByText("My Chats")
      ).toBeInTheDocument();

    });


    expect(
      screen.getByText("iPhone 15")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Can you reduce the price?")
    ).toBeInTheDocument();

  });



  it("shows empty message when no conversations", async () => {

    chatService.listConversations.mockResolvedValue([]);


    render(
      <MemoryRouter>
        <ChatListPage />
      </MemoryRouter>
    );


    await waitFor(() => {

      expect(
        screen.getByText("No conversations yet.")
      ).toBeInTheDocument();

    });

  });



  it("navigates when conversation clicked", async () => {

    chatService.listConversations.mockResolvedValue([
      {
        conversationId: 15,
        productTitle: "Laptop",
        lastMessage: "Interested?"
      }
    ]);


    render(
      <MemoryRouter>
        <ChatListPage />
      </MemoryRouter>
    );


    await waitFor(() =>
      screen.getByText("Laptop")
    );


    fireEvent.click(
      screen.getByText("Laptop")
    );


    expect(
      mockNavigate
    ).toHaveBeenCalledWith(
      "/chat/15"
    );

  });



  it("truncates long messages", async () => {

    chatService.listConversations.mockResolvedValue([
      {
        conversationId: 2,
        productTitle: "Camera",
        lastMessage:
          "This is a very long message which should be truncated after fifty characters because it is too lengthy"
      }
    ]);


    render(
      <MemoryRouter>
        <ChatListPage />
      </MemoryRouter>
    );


    await waitFor(() =>
      screen.getByText("Camera")
    );


    expect(
      screen.getByText(/This is a very long message/)
    ).toBeInTheDocument();


    expect(
      screen.getByText(/…/)
    ).toBeInTheDocument();

  });


});