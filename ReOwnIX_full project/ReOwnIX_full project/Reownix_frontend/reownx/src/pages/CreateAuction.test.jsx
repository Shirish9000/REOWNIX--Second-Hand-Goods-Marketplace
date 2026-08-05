import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateAuction from "./CreateAuction";
import auctionApi from "../services/auctionApi";

// Mock API
vi.mock("../services/auctionApi", () => ({
  default: {
    create: vi.fn(),
  },
}));

describe("CreateAuction Component", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("renders create auction form", () => {
    render(<CreateAuction />);

    expect(
      screen.getByText("Create New Auction")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Product ID")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Starting Price")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Minimum Increment")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Start Date & Time")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("End Date & Time")
    ).toBeInTheDocument();
  });



  it("shows validation errors when submitting empty form", async () => {

    render(<CreateAuction />);

    const button = screen.getByRole("button", {
      name: "Create Auction",
    });

    await userEvent.click(button);


    expect(
      await screen.findByText("Product ID is required")
    ).toBeInTheDocument();


    expect(
      await screen.findByText("Starting price is required")
    ).toBeInTheDocument();


    expect(
      await screen.findByText("Minimum increment is required")
    ).toBeInTheDocument();


    expect(
      await screen.findByText("Start date is required")
    ).toBeInTheDocument();


    expect(
      await screen.findByText("End date is required")
    ).toBeInTheDocument();

  });



  it("creates auction successfully", async () => {

    auctionApi.create.mockResolvedValue({
      data: {
        id: 1,
      },
    });


    render(<CreateAuction />);


    await userEvent.type(
      screen.getByLabelText("Product ID"),
      "101"
    );


    await userEvent.type(
      screen.getByLabelText("Starting Price"),
      "500"
    );


    await userEvent.type(
      screen.getByLabelText("Minimum Increment"),
      "50"
    );


    fireEvent.change(
      screen.getByLabelText("Start Date & Time"),
      {
        target:{
          value:"2026-08-05T10:00"
        }
      }
    );


    fireEvent.change(
      screen.getByLabelText("End Date & Time"),
      {
        target:{
          value:"2026-08-05T12:00"
        }
      }
    );


    await userEvent.click(
      screen.getByRole("button", {
        name:"Create Auction"
      })
    );


    await waitFor(()=>{

      expect(
        auctionApi.create
      ).toHaveBeenCalledTimes(1);

    });


    expect(
      await screen.findByText(
        "Auction created successfully!"
      )
    ).toBeInTheDocument();


  });



  it("sends correct payload to API", async()=>{

    auctionApi.create.mockResolvedValue({});


    render(<CreateAuction />);


    await userEvent.type(
      screen.getByLabelText("Product ID"),
      "10"
    );


    await userEvent.type(
      screen.getByLabelText("Starting Price"),
      "1000"
    );


    await userEvent.type(
      screen.getByLabelText("Minimum Increment"),
      "100"
    );


    fireEvent.change(
      screen.getByLabelText("Start Date & Time"),
      {
        target:{
          value:"2026-08-05T10:00"
        }
      }
    );


    fireEvent.change(
      screen.getByLabelText("End Date & Time"),
      {
        target:{
          value:"2026-08-05T11:00"
        }
      }
    );


    await userEvent.click(
      screen.getByRole("button",{
        name:"Create Auction"
      })
    );


    await waitFor(()=>{

      expect(
        auctionApi.create
      ).toHaveBeenCalled();

    });


    const payload =
      auctionApi.create.mock.calls[0][0];


    expect(payload.productId)
      .toBe("10");


    expect(payload.startingPrice)
      .toBe(1000);


    expect(payload.minimumBidIncrement)
      .toBe(100);


    expect(payload.startTime)
      .toContain("2026-08-05");


    expect(payload.endTime)
      .toContain("2026-08-05");


  });



  it("shows API error message when creation fails", async()=>{


    auctionApi.create.mockRejectedValue({
      response:{
        data:{
          message:"Auction already exists"
        }
      }
    });


    render(<CreateAuction />);


    await userEvent.type(
      screen.getByLabelText("Product ID"),
      "5"
    );


    await userEvent.type(
      screen.getByLabelText("Starting Price"),
      "200"
    );


    await userEvent.type(
      screen.getByLabelText("Minimum Increment"),
      "20"
    );


    fireEvent.change(
      screen.getByLabelText("Start Date & Time"),
      {
        target:{
          value:"2026-08-05T10:00"
        }
      }
    );


    fireEvent.change(
      screen.getByLabelText("End Date & Time"),
      {
        target:{
          value:"2026-08-05T12:00"
        }
      }
    );


    await userEvent.click(
      screen.getByRole("button",{
        name:"Create Auction"
      })
    );


    expect(
      await screen.findByText(
        "Auction already exists"
      )
    ).toBeInTheDocument();


  });


});