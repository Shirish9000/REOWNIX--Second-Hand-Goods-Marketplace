// src/pages/Settings.test.jsx

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Settings from "./Settings";

import userApi from "../services/userApi";
import toast from "react-hot-toast";


// -------- MOCKS --------

vi.mock("../services/userApi", () => ({
  default: {
    changePassword: vi.fn(),
  },
}));


vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));




// -------- TESTS --------

describe("Settings Component", () => {


  beforeEach(() => {

    vi.clearAllMocks();

  });




  it("renders settings page successfully", () => {


    render(<Settings />);


    expect(
      screen.getByText("Settings")
    ).toBeInTheDocument();



    expect(
      screen.getByText("Change Password")
    ).toBeInTheDocument();



    expect(
      screen.getByText("Notification Preferences")
    ).toBeInTheDocument();



    expect(
      screen.getByText(
        "Notification preferences are coming soon."
      )
    ).toBeInTheDocument();


  });








  it("shows error when passwords do not match", async()=>{


    render(<Settings />);


    const oldPassword =
      screen.getByLabelText(
        "Current Password"
      );


    const newPassword =
      screen.getByLabelText(
        "New Password"
      );


    const confirmPassword =
      screen.getByLabelText(
        "Confirm New Password"
      );



    await userEvent.type(
      oldPassword,
      "oldpassword"
    );


    await userEvent.type(
      newPassword,
      "newpassword123"
    );


    await userEvent.type(
      confirmPassword,
      "different123"
    );



    const button =
      screen.getByRole(
        "button",
        {
          name:"Update Password"
        }
      );


    await userEvent.click(button);



    expect(
      screen.getByText(
        "New passwords do not match."
      )
    ).toBeInTheDocument();



    expect(
      userApi.changePassword
    ).not.toHaveBeenCalled();



  });










  it("shows error for password less than 8 characters", async()=>{


    render(<Settings />);



    await userEvent.type(
      screen.getByLabelText(
        "Current Password"
      ),
      "old12345"
    );


    await userEvent.type(
      screen.getByLabelText(
        "New Password"
      ),
      "123"
    );


    await userEvent.type(
      screen.getByLabelText(
        "Confirm New Password"
      ),
      "123"
    );



    await userEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Update Password"
        }
      )
    );



    expect(
      screen.getByText(
        "Password must be at least 8 characters."
      )
    ).toBeInTheDocument();



    expect(
      userApi.changePassword
    ).not.toHaveBeenCalled();



  });









  it("changes password successfully", async()=>{


    userApi.changePassword.mockResolvedValue({});


    render(<Settings />);



    await userEvent.type(
      screen.getByLabelText(
        "Current Password"
      ),
      "oldpassword"
    );


    await userEvent.type(
      screen.getByLabelText(
        "New Password"
      ),
      "newpassword123"
    );


    await userEvent.type(
      screen.getByLabelText(
        "Confirm New Password"
      ),
      "newpassword123"
    );



    await userEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Update Password"
        }
      )
    );



    await waitFor(()=>{


      expect(
        userApi.changePassword
      ).toHaveBeenCalledWith({

        oldPassword:"oldpassword",

        newPassword:"newpassword123"

      });


    });



    expect(
      toast.success
    ).toHaveBeenCalledWith(
      "Password changed successfully!"
    );



  });









  it("handles api failure while changing password", async()=>{


    userApi.changePassword.mockRejectedValue({

      response:{
        data:{
          message:"Wrong password"
        }
      }

    });



    render(<Settings />);



    await userEvent.type(
      screen.getByLabelText(
        "Current Password"
      ),
      "wrongpassword"
    );


    await userEvent.type(
      screen.getByLabelText(
        "New Password"
      ),
      "newpassword123"
    );


    await userEvent.type(
      screen.getByLabelText(
        "Confirm New Password"
      ),
      "newpassword123"
    );



    await userEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Update Password"
        }
      )
    );



    await waitFor(()=>{


      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Wrong password"
      );


    });



  });




});