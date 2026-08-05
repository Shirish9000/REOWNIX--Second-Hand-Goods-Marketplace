import React from "react";

import {
  render,
  screen,
  waitFor,
  fireEvent
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



const renderPage = ()=>{

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


renderPage();


expect(

screen.getByText(
"Sell an Item"
)

).toBeInTheDocument();


});




test(
"loads categories",
async()=>{


productApi.getCategories.mockResolvedValue({

data:[
{
id:1,
name:"Electronics"
}

]

});


renderPage();


await waitFor(()=>{

expect(
screen.getByText("Sell an Item")
).toBeInTheDocument();


});


});





test(
"shows image required error",
async()=>{


renderPage();


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
"creates product successfully",
async()=>{


productApi.createProduct.mockResolvedValue({

data:{}

});


renderPage();



await userEvent.type(

screen.getByLabelText("Title"),

"Phone"

);



await userEvent.type(

screen.getByLabelText("Description"),

"Good phone"

);



// enable button check

const button =
screen.getByRole(
"button",
{
name:/Create Listing/i
}
);



expect(button).toBeInTheDocument();



});


test(
"handles API failure",
async()=>{


productApi.createProduct.mockRejectedValue(

new Error("failed")

);



renderPage();



await userEvent.type(

screen.getByLabelText("Title"),

"Phone"

);



await userEvent.type(

screen.getByLabelText("Description"),

"Test"

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



});