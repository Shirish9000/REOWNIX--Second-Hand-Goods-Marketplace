import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Checkout from "./Checkout";

import { vi } from "vitest";


// ---------- MOCKS ----------

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,

    useLocation: () => ({
      state: {
        plan: {
          planId: 1,
          planName: "ReOwn",
          price: 999,
          durationDays: 30
        }
      }
    })
  };
});


vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      userId: 1
    }
  })
}));


vi.mock("../services/dotnet/paymentService", () => ({
  paymentService: {
    processPayment: vi.fn()
  }
}));


vi.mock("../services/dotnet/subscriptionService", () => ({
  subscriptionService: {
    purchaseSubscription: vi.fn()
  }
}));


vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));



import { paymentService } from "../services/dotnet/paymentService";
import { subscriptionService } from "../services/dotnet/subscriptionService";
import toast from "react-hot-toast";



// ---------- HELPER ----------

const renderPage = () => {

  render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  );

};



// ---------- TESTS ----------


describe("Checkout Component",()=>{


beforeEach(()=>{
  vi.clearAllMocks();
});



test("renders checkout page",()=>{

 renderPage();

 expect(
  screen.getByText("Checkout")
 ).toBeInTheDocument();


 expect(
  screen.getByText("Order Summary")
 ).toBeInTheDocument();

});




test("shows validation error for empty submit",async()=>{


 renderPage();


 const button =
 screen.getByRole("button");


 fireEvent.click(button);



 await waitFor(()=>{


 expect(
 toast.error
 ).toHaveBeenCalledWith(
  "Please correct the highlighted fields."
 );


 });


});




test("formats card number input",()=>{


 renderPage();


 const input =
 screen.getByLabelText("Card Number");


 fireEvent.change(input,{
  target:{
   name:"cardNumber",
   value:"1234567890123456"
  }
 });


 expect(input.value)
 .toBe(
 "1234 5678 9012 3456"
 );


});




test("formats expiry input",()=>{


 renderPage();


 const input =
 screen.getByLabelText("Expiry");


 fireEvent.change(input,{
  target:{
   name:"expiry",
   value:"1225"
  }
 });


 expect(input.value)
 .toBe(
 "12/25"
 );


});




test("successful payment activates subscription",async()=>{


 paymentService.processPayment
 .mockResolvedValue({
  success:true
 });


 subscriptionService.purchaseSubscription
 .mockResolvedValue({});



 renderPage();



 fireEvent.change(
 screen.getByLabelText("Card Holder Name"),
 {
 target:{
  name:"name",
  value:"John Smith"
 }
 });



 fireEvent.change(
 screen.getByLabelText("Card Number"),
 {
 target:{
  name:"cardNumber",
  value:"1234567890123456"
 }
 });



 fireEvent.change(
 screen.getByLabelText("Expiry"),
 {
 target:{
  name:"expiry",
  value:"12/25"
 }
 });



 fireEvent.change(
 screen.getByLabelText("CVV"),
 {
 target:{
  name:"cvv",
  value:"123"
 }
 });



 fireEvent.click(
 screen.getByRole("button")
 );



 await waitFor(()=>{


 expect(
 paymentService.processPayment
 ).toHaveBeenCalled();


 expect(
 subscriptionService.purchaseSubscription
 ).toHaveBeenCalled();


 expect(
 toast.success
 ).toHaveBeenCalledWith(
 "Subscription activated successfully!"
 );


 expect(
 mockNavigate
 ).toHaveBeenCalledWith(
 "/profile/subscription"
 );


 });


});




test("handles payment failure",async()=>{


 paymentService.processPayment
 .mockRejectedValue(
  new Error("Payment failed")
 );



 renderPage();



 fireEvent.change(
 screen.getByLabelText("Card Holder Name"),
 {
 target:{
 name:"name",
 value:"John Smith"
 }
 });


 fireEvent.change(
 screen.getByLabelText("Card Number"),
 {
 target:{
 name:"cardNumber",
 value:"1234567890123456"
 }
 });


 fireEvent.change(
 screen.getByLabelText("Expiry"),
 {
 target:{
 name:"expiry",
 value:"12/25"
 }
 });


 fireEvent.change(
 screen.getByLabelText("CVV"),
 {
 target:{
 name:"cvv",
 value:"123"
 }
 });



 fireEvent.click(
 screen.getByRole("button")
 );



 await waitFor(()=>{


 expect(
 toast.error
 ).toHaveBeenCalled();


 });


});



});