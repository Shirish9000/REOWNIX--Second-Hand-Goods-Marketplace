import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";

import { vi } from "vitest";

import UploadImages from "./UploadImagesFull";
import productApi from "../services/productApi";


vi.mock("../services/productApi", () => ({
  default: {
    getImages: vi.fn(),
    uploadImages: vi.fn(),
    deleteImage: vi.fn(),
  },
}));


vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));



vi.mock("../components/ConfirmDialog", () => ({
  default: ({
    open,
    onConfirm,
    onCancel,
    title,
    description,
  }) => {

    if (!open) return null;


    return (
      <div>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>


        <button onClick={onConfirm}>
          Delete
        </button>


        <button onClick={onCancel}>
          Cancel
        </button>


      </div>
    );
  },
}));




const renderComponent = () => {

  return render(

    <MemoryRouter initialEntries={["/upload/1"]}>

      <Routes>

        <Route
          path="/upload/:id"
          element={<UploadImages />}
        />

      </Routes>

    </MemoryRouter>

  );

};




describe("UploadImages Component",()=>{


beforeEach(()=>{


  vi.clearAllMocks();


  productApi.getImages
    .mockResolvedValue([
      {
        id:1,
        url:"image1.jpg"
      }
    ]);

});





test("renders upload page successfully",async()=>{


  renderComponent();


  expect(
    screen.getByText(
      /Upload Images for Product/
    )
  )
  .toBeInTheDocument();



  await waitFor(()=>{

    expect(
      productApi.getImages
    )
    .toHaveBeenCalledWith("1");

  });


});







test("loads existing images",async()=>{


  renderComponent();


  const image =
    await screen.findByAltText(
      "product"
    );


  expect(image)
    .toBeInTheDocument();


});







test("selects new image files",async()=>{


  renderComponent();



  const file =
    new File(
      ["dummy"],
      "test.png",
      {
        type:"image/png"
      }
    );



  const input =
    document.querySelector(
      "input[type='file']"
    );



  fireEvent.change(
    input,
    {
      target:{
        files:[
          file
        ]
      }
    }
  );



  await waitFor(()=>{

    expect(
      screen.getByText(
        "Selected files"
      )
    )
    .toBeInTheDocument();

  });


});








test("uploads selected images successfully",async()=>{


  productApi.uploadImages
    .mockResolvedValue({});



  renderComponent();



  const file =
    new File(
      ["abc"],
      "photo.png",
      {
        type:"image/png"
      }
    );



  const input =
    document.querySelector(
      "input[type='file']"
    );



  fireEvent.change(
    input,
    {
      target:{
        files:[
          file
        ]
      }
    }
  );



  const uploadButton =
    await screen.findByText(
      "Upload Images"
    );



  await waitFor(()=>{

    expect(
      uploadButton
    )
    .not
    .toBeDisabled();

  });



  fireEvent.click(
    uploadButton
  );



  await waitFor(()=>{


    expect(
      productApi.uploadImages
    )
    .toHaveBeenCalled();


  });



});









test("deletes existing image successfully",async()=>{


  productApi.deleteImage
    .mockResolvedValue({});



  renderComponent();



  await screen.findByAltText(
    "product"
  );



  // Find delete icon
  const deleteIcon =
    screen.getByTestId(
      "DeleteIcon"
    );



  const deleteButton =
    deleteIcon.closest(
      "button"
    );



  fireEvent.click(
    deleteButton
  );




  await waitFor(()=>{

    expect(
      screen.getByText(
        "Delete Image"
      )
    )
    .toBeInTheDocument();


  });





  const confirmButton =
    screen.getByRole(
      "button",
      {
        name:/delete/i
      }
    );



  fireEvent.click(
    confirmButton
  );



  await waitFor(()=>{


    expect(
      productApi.deleteImage
    )
    .toHaveBeenCalledWith(
      1
    );


  });



});



});