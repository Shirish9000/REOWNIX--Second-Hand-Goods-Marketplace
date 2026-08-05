import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";
import { vi } from "vitest";


// --------------------
// MOCKS
// --------------------

const mockNavigate = vi.fn();

const mockRegisterUser = vi.fn();

vi.mock("lucide-react", () => ({
  Globe: () => <span data-testid="globe-icon" />,
  Eye: () => <span data-testid="eye-icon" />,
  EyeOff: () => <span data-testid="eye-off-icon" />,
  ShieldCheck: () => <span data-testid="shield-icon" />,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    register: mockRegisterUser,
  }),
}));


vi.mock("../context/ThemeContext", () => ({
  useColorMode: () => ({
    mode: "light",
  }),
}));


vi.mock("../components/auth/AuthShowcase", () => ({
  default: () => <div data-testid="auth-showcase">Auth Showcase</div>,
}));


vi.mock("../components/auth/AuthFooter", () => ({
  default: () => <div data-testid="auth-footer">Auth Footer</div>,
}));


vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
}));


// --------------------
// HELPER
// --------------------

const renderRegister = () => {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
};


// --------------------
// TESTS
// --------------------

describe("Register Component", () => {


  beforeEach(() => {
    vi.clearAllMocks();
  });



  test("renders register page correctly", () => {

    renderRegister();


    expect(
      screen.getByText("Create an account")
    ).toBeInTheDocument();


    expect(
      screen.getByText(
        "Join ReOwnIX to buy and sell premium items."
      )
    ).toBeInTheDocument();


    expect(
      screen.getByRole("button", {
        name: /create account/i,
      })
    ).toBeInTheDocument();


    expect(
      screen.getByTestId("auth-showcase")
    ).toBeInTheDocument();


    expect(
      screen.getByTestId("auth-footer")
    ).toBeInTheDocument();

  });



  test("renders all required input fields", () => {

    renderRegister();


    expect(
      screen.getByPlaceholderText("First Name")
    ).toBeInTheDocument();


    expect(
      screen.getByPlaceholderText("Last Name")
    ).toBeInTheDocument();


    expect(
      screen.getByPlaceholderText("Email Address")
    ).toBeInTheDocument();


    expect(
      screen.getByPlaceholderText("Password")
    ).toBeInTheDocument();


    expect(
      screen.getByPlaceholderText("Confirm Password")
    ).toBeInTheDocument();

  });



 test("shows validation errors when submitting empty form", async () => {

  renderRegister();


  await userEvent.click(
    screen.getByRole("button", {
      name: /create account/i,
    })
  );


  await waitFor(() => {

    expect(
      screen.getByPlaceholderText("First Name")
    ).toHaveAttribute(
      "aria-invalid",
      "true"
    );


    expect(
      screen.getByPlaceholderText("Last Name")
    ).toHaveAttribute(
      "aria-invalid",
      "true"
    );


    expect(
      screen.getByPlaceholderText("Email Address")
    ).toHaveAttribute(
      "aria-invalid",
      "true"
    );


    expect(
      screen.getByPlaceholderText("Password")
    ).toHaveAttribute(
      "aria-invalid",
      "true"
    );


    expect(
      screen.getByPlaceholderText("Confirm Password")
    ).toHaveAttribute(
      "aria-invalid",
      "true"
    );

  });

});

  test("shows invalid email validation error", async () => {

    renderRegister();


    await userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "wrongemail"
    );


    await userEvent.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );


    expect(
      await screen.findByText(
        "Enter a valid email"
      )
    ).toBeInTheDocument();


  });



  test("shows password length validation error", async () => {

    renderRegister();


    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "123"
    );


    await userEvent.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );


    expect(
      await screen.findByText(
        "Password must be at least 6 characters"
      )
    ).toBeInTheDocument();


  });



  test("shows password mismatch error", async () => {

    renderRegister();


    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "password123"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "different123"
    );


    await userEvent.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );


    expect(
      await screen.findByText(
        "Passwords must match"
      )
    ).toBeInTheDocument();


  });
    test("submits registration form successfully", async () => {

    mockRegisterUser.mockResolvedValue({
      success: true,
    });


    renderRegister();


    await userEvent.type(
      screen.getByPlaceholderText("First Name"),
      "Nikita"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Last Name"),
      "Yawalkar"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "nikita@test.com"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "password123"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "password123"
    );



    await userEvent.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );



    await waitFor(() => {

      expect(mockRegisterUser)
        .toHaveBeenCalledTimes(1);

    });



    expect(mockRegisterUser)
      .toHaveBeenCalledWith({
        firstName: "Nikita",
        lastName: "Yawalkar",
        email: "nikita@test.com",
        password: "password123",
        phone: "",
        address: "",
      });



    expect(mockNavigate)
      .toHaveBeenCalledWith(
        "/login",
        {
          replace: true,
        }
      );


  });



  test("sends optional phone and address when provided", async () => {


    mockRegisterUser.mockResolvedValue({});


    renderRegister();



    await userEvent.type(
      screen.getByPlaceholderText("First Name"),
      "John"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Last Name"),
      "Doe"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "john@test.com"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "password123"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "password123"
    );


    await userEvent.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );



    await waitFor(() => {

      expect(mockRegisterUser)
        .toHaveBeenCalled();

    });


    const submittedData =
      mockRegisterUser.mock.calls[0][0];


    expect(submittedData)
      .not
      .toHaveProperty("confirmPassword");


    expect(submittedData)
      .toHaveProperty(
        "phone",
        ""
      );


    expect(submittedData)
      .toHaveProperty(
        "address",
        ""
      );


  });



test("password visibility toggle works", async () => {

  renderRegister();


  const passwordInput =
    screen.getByPlaceholderText("Password");


  expect(passwordInput)
    .toHaveAttribute(
      "type",
      "password"
    );


  const toggleButton =
    screen.getByLabelText(
      "toggle password visibility"
    );


  await userEvent.click(toggleButton);


  expect(passwordInput)
    .toHaveAttribute(
      "type",
      "text"
    );

});
test("confirm password visibility toggle works", async () => {

  renderRegister();


  const confirmPasswordInput =
    screen.getByPlaceholderText(
      "Confirm Password"
    );


  expect(confirmPasswordInput)
    .toHaveAttribute(
      "type",
      "password"
    );


  const toggleButton =
    screen.getByLabelText(
      "toggle confirm password visibility"
    );


  await userEvent.click(toggleButton);


  expect(confirmPasswordInput)
    .toHaveAttribute(
      "type",
      "text"
    );

});

  test("shows loading text while submitting", async () => {


    let resolveRegister;


    mockRegisterUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRegister = resolve;
        })
    );



    renderRegister();



    await userEvent.type(
      screen.getByPlaceholderText("First Name"),
      "Test"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Last Name"),
      "User"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "test@test.com"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "password123"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "password123"
    );



    await userEvent.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );



    expect(
      await screen.findByText(
        "Creating account..."
      )
    ).toBeInTheDocument();



    resolveRegister({});


  });
    test("does not navigate when registration fails", async () => {

    mockRegisterUser.mockRejectedValue(
      new Error("Registration failed")
    );


    const consoleError =
      vi.spyOn(console, "error")
        .mockImplementation(() => {});


    renderRegister();



    await userEvent.type(
      screen.getByPlaceholderText("First Name"),
      "Nikita"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Last Name"),
      "Yawalkar"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "nikita@test.com"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "password123"
    );


    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "password123"
    );



    await userEvent.click(
      screen.getByRole("button", {
        name: /create account/i,
      })
    );



    await waitFor(() => {

      expect(mockRegisterUser)
        .toHaveBeenCalled();

    });



    expect(mockNavigate)
      .not
      .toHaveBeenCalled();



    expect(consoleError)
      .toHaveBeenCalled();



    consoleError.mockRestore();

  });




  test("Google signup button is displayed", () => {

    renderRegister();


    expect(
      screen.getByRole("button", {
        name: /sign up with google/i,
      })
    ).toBeInTheDocument();


  });




  test("login link is displayed", () => {

    renderRegister();


    const loginLink =
      screen.getByText(
        "Sign in instead"
      );


    expect(loginLink)
      .toBeInTheDocument();


    expect(loginLink)
      .toHaveAttribute(
        "href",
        "/login"
      );


  });




  test("security message is displayed", () => {

    renderRegister();


    expect(
      screen.getByText(
        "We keep your data safe and secure."
      )
    ).toBeInTheDocument();



    expect(
      screen.getByText(
        "Your privacy is our priority."
      )
    ).toBeInTheDocument();


  });


});