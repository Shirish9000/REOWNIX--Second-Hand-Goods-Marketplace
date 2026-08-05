// src/pages/MyProducts.test.jsx

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

import MyProducts from "./MyProducts";

import productApi from "../services/productApi";

import { MemoryRouter } from "react-router-dom";



vi.mock("../services/productApi",()=>({
  default:{
    getMyProducts:vi.fn(),
    deleteProduct:vi.fn()
  }
}));



vi.mock("../components/ProductCard",()=>({

 default:({product})=>(
   <div>
     Product Card {product.id}
   </div>
 )

}));



vi.mock("../components/ConfirmDialog",()=>({

 default:({open,onConfirm})=>

 open ? (
   <button onClick={onConfirm}>
      Confirm Delete
   </button>
 ):null

}));



vi.mock("react-hot-toast",()=>({

 default:{
   success:vi.fn(),
   error:vi.fn()
 }

}));




const renderComponent=()=>{

 return render(
   <MemoryRouter>
     <MyProducts/>
   </MemoryRouter>
 );

};




describe("MyProducts Component",()=>{



beforeEach(()=>{

 vi.clearAllMocks();

 productApi.getMyProducts.mockResolvedValue([]);

});






it("shows loading initially",()=>{


renderComponent();


expect(
 screen.getByRole("progressbar")
).toBeInTheDocument();


});








it("renders My Products heading",async()=>{


renderComponent();



await waitFor(()=>{


expect(
 screen.getByText("My Products")
).toBeInTheDocument();


});


});









it("shows empty message when no products exist",async()=>{


renderComponent();



await waitFor(()=>{


expect(
 screen.getByText(
 "You haven't listed any products yet."
 )
).toBeInTheDocument();


});


});









it("renders products",async()=>{


productApi.getMyProducts.mockResolvedValue([

 {
   id:1,
   title:"Laptop",
   status:"ACTIVE"
 }

]);



renderComponent();



await waitFor(()=>{


expect(
 screen.getByText(
 "Product Card 1"
 )
).toBeInTheDocument();



});


});









it("deletes product successfully",async()=>{


productApi.getMyProducts.mockResolvedValue([

 {
  id:1,
  title:"Laptop"
 }

]);


productApi.deleteProduct.mockResolvedValue({});



renderComponent();



await waitFor(()=>{


expect(
 screen.getByText("Product Card 1")
).toBeInTheDocument();


});



});


});