// src/pages/Chat.test.jsx

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Chat from "./Chat";


describe("Chat Component", () => {


  it("renders chat page heading", () => {

    render(<Chat />);


    expect(
      screen.getByText("Chat")
    ).toBeInTheDocument();

  });



  it("shows under construction message", () => {

    render(<Chat />);


    expect(
      screen.getByText(
        "Chat functionality is under construction. Stay tuned!"
      )
    ).toBeInTheDocument();

  });



});