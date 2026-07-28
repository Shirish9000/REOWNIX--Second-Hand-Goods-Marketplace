import "./Invoice.css";
import { useNavigate } from "react-router-dom";

function Invoice() {

    const navigate = useNavigate();

    // Temporary Data
    const invoice = {
        invoiceNo: "INV-2026-001",
        date: new Date().toLocaleDateString(),
        customer: "Premium User",
        plan: "ReOwn Max",
        amount: 1399,
        validity: "30 Days",
        paymentMethod: "UPI",
        status: "Paid"
    };

    return (

        <div className="invoice-page">

            <div className="invoice-card">

                {/* Header */}

                <div className="invoice-header">

                    <div>

                        <h1>ReOwniX</h1>

                        <p>Premium Marketplace</p>

                    </div>

                    <div className="text-end">

                        <h4>INVOICE</h4>

                        <p>{invoice.invoiceNo}</p>

                    </div>

                </div>

                <hr />

                {/* Customer Details */}

                <div className="invoice-details">

                    <div>

                        <h5>Customer</h5>

                        <p>{invoice.customer}</p>

                    </div>

                    <div>

                        <h5>Date</h5>

                        <p>{invoice.date}</p>

                    </div>

                </div>

                {/* Invoice Table */}

                <table className="table mt-4">

                    <thead>

                        <tr>

                            <th>Description</th>
                            <th>Validity</th>
                            <th>Status</th>
                            <th>Amount</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>{invoice.plan}</td>
                            <td>{invoice.validity}</td>

                            <td>

                                <span className="badge bg-success">

                                    {invoice.status}

                                </span>

                            </td>

                            <td>₹{invoice.amount}</td>

                        </tr>

                    </tbody>

                </table>

                {/* Total */}

                <div className="invoice-total">

                    Total Paid : ₹{invoice.amount}

                </div>

                {/* Buttons */}

                <div className="invoice-buttons">

                    <button

                        className="btn btn-primary"

                        onClick={() => navigate("/")}

                    >

                        <i className="bi bi-house-door-fill me-2"></i>

                        Back to Home

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Invoice;