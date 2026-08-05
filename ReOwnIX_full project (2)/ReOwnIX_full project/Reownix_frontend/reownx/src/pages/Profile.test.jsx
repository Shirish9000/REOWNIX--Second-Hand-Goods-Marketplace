// src/pages/Profile.test.jsx

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import Profile from "./Profile";
import { AuthContext } from "../context/AuthContext";
import userApi from "../services/userApi";
import toast from "react-hot-toast";


// ---------------- MOCKS ----------------

vi.mock("../services/userApi", () => ({
  default: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
  },
}));


vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));



// ---------------- HELPER ----------------

const mockUser = {
  userId: 1,
  firstName: "Nikita",
  lastName: "Yawalkar",
  email: "nikita@test.com",
};


const renderProfile = () => {

  return render(
    <AuthContext.Provider
      value={{
        user: mockUser,
        updateUser: vi.fn(),
      }}
    >
      <Profile />
    </AuthContext.Provider>
  );

};



// ---------------- TEST CASES ----------------

describe("Profile Component", () => {


  beforeEach(() => {

    vi.clearAllMocks();

  });



  it("renders profile data successfully", async () => {


    userApi.getProfile.mockResolvedValue({

      firstName: "Nikita",
      lastName: "Yawalkar",
      email: "nikita@test.com",
      phone: "9876543210",
      role: "ROLE_USER",
      createdAt: "2026-01-01"

    });



    renderProfile();



    expect(
      await screen.findByText(
        "Nikita Yawalkar"
      )
    ).toBeInTheDocument();



    // Email appears twice in UI
    expect(
      screen.getAllByText(
        "nikita@test.com"
      ).length
    ).toBe(2);



   expect(
  screen.getAllByText(
    /9876543210/
  ).length
).toBe(2);


  });





  it("shows loading state", () => {


    userApi.getProfile.mockImplementation(
      () => new Promise(()=>{})
    );


    renderProfile();



    expect(
      screen.queryByText(
        "My Profile"
      )
    ).not.toBeInTheDocument();


  });






  it("opens edit profile mode", async () => {


    userApi.getProfile.mockResolvedValue({

      firstName:"Nikita",
      lastName:"Yawalkar",
      email:"nikita@test.com"

    });



    renderProfile();



    await screen.findByText(
      "Nikita Yawalkar"
    );



    fireEvent.click(
      screen.getByText(
        "Edit Profile"
      )
    );



    expect(
      screen.getByLabelText(
        "First Name"
      )
    ).toBeInTheDocument();



    expect(
      screen.getByLabelText(
        "Last Name"
      )
    ).toBeInTheDocument();


  });






  it("updates profile successfully", async()=>{


    userApi.getProfile.mockResolvedValue({

      firstName:"Nikita",
      lastName:"Yawalkar",
      email:"nikita@test.com",
      phone:"1111111111"

    });



    userApi.updateProfile.mockResolvedValue({

      firstName:"Nikita",
      lastName:"Updated",
      phone:"2222222222"

    });



    renderProfile();



    await screen.findByText(
      "Nikita Yawalkar"
    );



    fireEvent.click(
      screen.getByText(
        "Edit Profile"
      )
    );



    fireEvent.change(

      screen.getByLabelText(
        "Last Name"
      ),

      {
        target:{
          value:"Updated"
        }
      }

    );



    fireEvent.click(
      screen.getByText(
        "Save"
      )
    );



    await waitFor(()=>{

      expect(
        userApi.updateProfile
      ).toHaveBeenCalled();

    });



    expect(
      toast.success
    ).toHaveBeenCalledWith(
      "Profile updated!"
    );


  });







  it("shows validation error for empty first name", async()=>{


    userApi.getProfile.mockResolvedValue({

      firstName:"Nikita",
      lastName:"Yawalkar",
      email:"nikita@test.com"

    });



    renderProfile();



    await screen.findByText(
      "Nikita Yawalkar"
    );



    fireEvent.click(
      screen.getByText(
        "Edit Profile"
      )
    );



    fireEvent.change(

      screen.getByLabelText(
        "First Name"
      ),

      {
        target:{
          value:""
        }
      }

    );



    fireEvent.click(
      screen.getByText(
        "Save"
      )
    );



    expect(
      screen.getByText(
        "First name is required."
      )
    ).toBeInTheDocument();



  });







  it("cancel button exits edit mode", async()=>{


    userApi.getProfile.mockResolvedValue({

      firstName:"Nikita",
      lastName:"Yawalkar",
      email:"nikita@test.com"

    });



    renderProfile();



    await screen.findByText(
      "Nikita Yawalkar"
    );



    fireEvent.click(
      screen.getByText(
        "Edit Profile"
      )
    );



    expect(
      screen.getByText(
        "Cancel"
      )
    ).toBeInTheDocument();



    fireEvent.click(
      screen.getByText(
        "Cancel"
      )
    );



    expect(
      screen.getByText(
        "Edit Profile"
      )
    ).toBeInTheDocument();



  });







  it("handles API failure", async()=>{


    userApi.getProfile.mockRejectedValue(
      new Error("API Failed")
    );



    renderProfile();



    await waitFor(()=>{

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Failed to load profile"
      );

    });



  });



});