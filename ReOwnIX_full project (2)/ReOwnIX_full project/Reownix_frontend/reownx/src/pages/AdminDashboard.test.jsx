import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminDashboard from "./AdminDashboard";
import adminApi from "../services/adminApi";


// Mock API
vi.mock("../services/adminApi", () => ({
  default: {
    getUsers: vi.fn(),
    getProducts: vi.fn(),
    getAuctions: vi.fn(),
    getCategories: vi.fn(),
    getReviews: vi.fn(),
    getMetrics: vi.fn(),
  },
}));


// Mock sidebar
vi.mock("../components/AdminSidebar", () => ({
  default: () => (
    <div data-testid="admin-sidebar">
      Sidebar
    </div>
  ),
}));


// Mock table
vi.mock("../components/admin/DataTable", () => ({
  default: ({rows, loading}) => (
    <div data-testid="data-table">
      {loading 
        ? "Loading"
        : rows.map((r)=>(
          <div key={r.id}>
            {r.name || r.title}
          </div>
        ))
      }
    </div>
  ),
}));


// Mock recharts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({children}) => (
    <div>{children}</div>
  ),
  LineChart: () => <div>LineChart</div>,
  BarChart: () => <div>BarChart</div>,
  PieChart: () => <div>PieChart</div>,
  Line: () => <div />,
  Bar: () => <div />,
  Pie: () => <div />,
  Cell: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
}));


// Mock theme
vi.mock("@mui/material/styles", () => ({
  useTheme: () => ({
    palette:{
      primary:{
        main:"#000"
      },
      secondary:{
        main:"#000"
      }
    }
  })
}));



describe("AdminDashboard Component",()=>{


beforeEach(()=>{

vi.clearAllMocks();


adminApi.getUsers.mockResolvedValue({
items:[
{
id:1,
name:"John",
email:"john@test.com"
}
],
total:1
});


adminApi.getProducts.mockResolvedValue({
items:[],
total:0
});


adminApi.getAuctions.mockResolvedValue({
items:[],
total:0
});


adminApi.getCategories.mockResolvedValue({
items:[],
total:0
});


adminApi.getReviews.mockResolvedValue({
items:[],
total:0
});



adminApi.getMetrics.mockResolvedValue(10);


});



it("renders admin dashboard",async()=>{


render(
<AdminDashboard/>
);


expect(
screen.getByTestId("admin-sidebar")
).toBeInTheDocument();



await waitFor(()=>{

expect(
screen.getByText("Total Users")
).toBeInTheDocument();

});


});




it("loads users data in table",async()=>{


render(
<AdminDashboard/>
);



await waitFor(()=>{


expect(
screen.getByText("John")
).toBeInTheDocument();


});


expect(
adminApi.getUsers
).toHaveBeenCalled();



});





it("shows metric values",async()=>{


render(
<AdminDashboard/>
);



await waitFor(()=>{

  expect(
    screen.getAllByText("10").length
  ).toBeGreaterThan(0);

});

});





it("changes tab to products",async()=>{


render(
<AdminDashboard/>
);



const productsTab =
screen.getByRole(
"tab",
{
name:"Products"
}
);


fireEvent.click(productsTab);



await waitFor(()=>{


expect(
adminApi.getProducts
).toHaveBeenCalled();


});


});





it("search input updates value",()=>{


render(
<AdminDashboard/>
);



const search =
screen.getByPlaceholderText(
"Search..."
);



fireEvent.change(
search,
{
target:{
value:"phone"
}
}
);



expect(search.value)
.toBe("phone");

});





it("handles API error",async()=>{


adminApi.getUsers.mockRejectedValue(
new Error("Failed")
);



render(
<AdminDashboard/>
);



await waitFor(()=>{


expect(
screen.getByText(
"Failed to load data."
)
).toBeInTheDocument();


});


});



});