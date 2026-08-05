import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";


// ================= MOCKS =================


const mockLogin = vi.fn();
const mockNavigate = vi.fn();


// Auth Context
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));


// Theme Context
vi.mock("../context/ThemeContext", () => ({
  useColorMode: () => ({
    mode: "light",
  }),
}));


// Router hooks
vi.mock("react-router-dom", async () => {

  const actual = await vi.importActual(
    "react-router-dom"
  );

  return {
    ...actual,

    useNavigate: () => mockNavigate,

    useLocation: () => ({
      state: {
        from: {
          pathname: "/dashboard",
        },
      },
    }),

  };

});


// Child components

vi.mock("../components/auth/AuthShowcase", () => ({
  default: () => (
    <div>
      Auth Showcase
    </div>
  ),
}));


vi.mock("../components/auth/AuthFooter", () => ({
  default: () => (
    <div>
      Auth Footer
    </div>
  ),
}));




// ================= RENDER HELPER =================


const renderLogin = () => {

  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

};




// ================= TESTS =================


describe("Login Component", () => {


  beforeEach(() => {

    vi.clearAllMocks();

  });



  it("renders login page correctly", () => {


    renderLogin();


    expect(
      screen.getByText(
        "Welcome back!"
      )
    )
    .toBeInTheDocument();



    expect(
      screen.getByText(
        "Login to continue to ReOwnIX"
      )
    )
    .toBeInTheDocument();



    expect(
      screen.getByText(
        "Auth Showcase"
      )
    )
    .toBeInTheDocument();



  });





  it("shows validation error when fields are empty", async () => {


    renderLogin();



    await userEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Login"
        }
      )
    );



    expect(
      await screen.findByText(
        "Email is required"
      )
    )
    .toBeInTheDocument();



    expect(
      await screen.findByText(
        "Password is required"
      )
    )
    .toBeInTheDocument();



  });






  it("shows invalid email error", async () => {


    renderLogin();



    await userEvent.type(
      screen.getByPlaceholderText(
        "Email address"
      ),
      "wrongemail"
    );



    await userEvent.type(
      screen.getByPlaceholderText(
        "Password"
      ),
      "123456"
    );



    await userEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Login"
        }
      )
    );



    expect(
      await screen.findByText(
        "Enter a valid email"
      )
    )
    .toBeInTheDocument();



  });







  it("allows entering email and password", async () => {


    renderLogin();



    const email =
      screen.getByPlaceholderText(
        "Email address"
      );


    const password =
      screen.getByPlaceholderText(
        "Password"
      );



    await userEvent.type(
      email,
      "test@gmail.com"
    );



    await userEvent.type(
      password,
      "password123"
    );



    expect(email.value)
      .toBe(
        "test@gmail.com"
      );


    expect(password.value)
      .toBe(
        "password123"
      );



  });







  it("toggles password visibility", async () => {

  renderLogin();

  const password =
    screen.getByPlaceholderText("Password");

  const toggle =
    screen.getByTestId("password-toggle");


  expect(password.type)
    .toBe("password");


  await userEvent.click(toggle);


  expect(password.type)
    .toBe("text");

});

  it("calls login with correct credentials", async () => {


    mockLogin.mockResolvedValue({});



    renderLogin();



    await userEvent.type(
      screen.getByPlaceholderText(
        "Email address"
      ),
      "test@gmail.com"
    );



    await userEvent.type(
      screen.getByPlaceholderText(
        "Password"
      ),
      "password123"
    );



    await userEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Login"
        }
      )
    );



    await waitFor(() => {


      expect(mockLogin)
      .toHaveBeenCalledWith({

        email:"test@gmail.com",

        password:"password123"

      });


    });



  });








  it("navigates after successful login", async () => {


    mockLogin.mockResolvedValue({});



    renderLogin();



    await userEvent.type(
      screen.getByPlaceholderText(
        "Email address"
      ),
      "test@gmail.com"
    );



    await userEvent.type(
      screen.getByPlaceholderText(
        "Password"
      ),
      "password123"
    );



    await userEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Login"
        }
      )
    );



    await waitFor(() => {


      expect(mockNavigate)
      .toHaveBeenCalledWith(
        "/dashboard",
        {
          replace:true
        }
      );


    });



  });








  it("shows logging in state", async () => {


    mockLogin.mockImplementation(
      () => new Promise(() => {})
    );



    renderLogin();



    await userEvent.type(
      screen.getByPlaceholderText(
        "Email address"
      ),
      "test@gmail.com"
    );



    await userEvent.type(
      screen.getByPlaceholderText(
        "Password"
      ),
      "password123"
    );



    await userEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Login"
        }
      )
    );



    expect(
      screen.getByText(
        "Logging in..."
      )
    )
    .toBeInTheDocument();



  });



});