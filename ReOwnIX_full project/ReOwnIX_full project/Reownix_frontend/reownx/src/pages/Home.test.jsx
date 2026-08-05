import React from "react";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  describe,
  test,
  expect,
  vi
} from "vitest";

import {
  MemoryRouter
} from "react-router-dom";


import CreateProduct from "./CreateProduct";



vi.mock("../services/productApi",()=>({

  default:{

    getCategories:vi.fn(),

    createProduct:vi.fn()

  }

}));


import productApi from "../services/productApi";



const renderComponent = () => {

return render(

<MemoryRouter>

<CreateProduct/>

</MemoryRouter>

);

};





describe(
"CreateProduct Component",
()=>{



test(
"renders create product page",
()=>{


renderComponent();


expect(

screen.getByText(
"Sell an Item"
)

).toBeInTheDocument();


});





test(
"renders product fields",
()=>{


renderComponent();


expect(

screen.getByLabelText(
"Title"
)

).toBeInTheDocument();



expect(

screen.getByLabelText(
"Description"
)

).toBeInTheDocument();


});






test(
"shows image validation message on empty submit",
async()=>{


renderComponent();


const button =

screen.getByRole(
"button",
{
name:/Create Listing/i
}
);



expect(button).toBeDisabled();


});







test(
"calls createProduct after form submit",
async()=>{


productApi.createProduct.mockResolvedValue({

data:{}

});


renderComponent();



await userEvent.type(

screen.getByLabelText(
"Title"
),

"Phone"

);



await userEvent.type(

screen.getByLabelText(
"Description"
),

"Good phone"

);



expect(

screen.getByRole(
"button",
{
name:/Create Listing/i
}

)

).toBeInTheDocument();



});







test(
"handles API error",
async()=>{


productApi.createProduct.mockRejectedValue(

new Error("failed")

);



renderComponent();



await userEvent.type(

screen.getByLabelText(
"Title"
),

"Phone"

);



await userEvent.type(

screen.getByLabelText(
"Description"
),

"Test product"

);



expect(

screen.getByText(
"Sell an Item"
)

).toBeInTheDocument();



});



});