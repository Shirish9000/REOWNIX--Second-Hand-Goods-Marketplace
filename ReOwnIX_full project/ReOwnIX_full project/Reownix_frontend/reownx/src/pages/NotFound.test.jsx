// src/pages/NotFound.test.jsx

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

import NotFound from "./NotFound";

import { MemoryRouter } from "react-router-dom";



describe("NotFound Component",()=>{



it("renders 404 text",()=>{


render(
  <MemoryRouter>
    <NotFound/>
  </MemoryRouter>
);



expect(
 screen.getByText("404")
).toBeInTheDocument();


});








it("renders page not found message",()=>{


render(
  <MemoryRouter>
    <NotFound/>
  </MemoryRouter>
);



expect(
 screen.getByText("Page not found")
).toBeInTheDocument();



});








it("renders description text",()=>{


render(
  <MemoryRouter>
    <NotFound/>
  </MemoryRouter>
);



expect(
 screen.getByText(
 "Sorry, we couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable."
 )
).toBeInTheDocument();



});








it("renders back to home button",()=>{


render(
  <MemoryRouter>
    <NotFound/>
  </MemoryRouter>
);



expect(
 screen.getByText("Back to Home")
).toBeInTheDocument();



});








it("home button links to root path",()=>{


render(
  <MemoryRouter>
    <NotFound/>
  </MemoryRouter>
);



const button = screen.getByText("Back to Home");


expect(button.closest("a")).toHaveAttribute(
 "href",
 "/"
);


});



});