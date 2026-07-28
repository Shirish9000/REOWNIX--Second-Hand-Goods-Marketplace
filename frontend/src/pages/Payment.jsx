import "./Payment.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { makePayment } from "../services/paymentService";
import ToastMessage from "../components/common/ToastMessage";

function Payment() {

    const location = useLocation();
    const navigate = useNavigate();

    const selectedPlan = location.state || {
        planId: 3,
        name: "ReOwn Max",
        price: 1399,
        views: 100
    };

    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [loading, setLoading] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const handlePayment = async () => {

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {

            setToastMessage("Please login first.");
            setToastType("danger");
            setShowToast(true);

            return;
        }

        try {

            setLoading(true);

            const paymentRequest = {

                userId: Number(userId),

                planId: selectedPlan.planId,

                amount: selectedPlan.price,

                paymentMethod,

                transactionId: "TXN_" + Date.now()

            };

            console.log("Payment Request:", paymentRequest);

            await makePayment(paymentRequest);

            setToastMessage("Payment Successful");
            setToastType("success");
            setShowToast(true);

            setTimeout(() => {

                navigate("/subscription", {
                    state: selectedPlan
                });

            }, 1500);

        }
        catch (error) {

            console.error("Payment Error:", error);

            setToastMessage("Payment Failed.");
            setToastType("danger");
            setShowToast(true);

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <>

            <ToastMessage
                show={showToast}
                setShow={setShowToast}
                message={toastMessage}
                type={toastType}
            />

            <div className="payment-page">

                <div className="payment-container">

                    <div className="summary-card">

                        <h2>Order Summary</h2>

                        <hr />

                        <div className="summary-row">
                            <span>Selected Plan</span>
                            <strong>{selectedPlan.name}</strong>
                        </div>

                        <div className="summary-row">
                            <span>Product Views</span>
                            <strong>{selectedPlan.views}</strong>
                        </div>

                        <div className="summary-row">
                            <span>Validity</span>
                            <strong>30 Days</strong>
                        </div>

                        <div className="summary-row total">
                            <span>Total Amount</span>
                            <strong>₹{selectedPlan.price}</strong>
                        </div>

                    </div>

                    <div className="payment-card">

                        <h2>Secure Checkout</h2>

                        <p className="secure">
                            <i className="bi bi-shield-lock-fill"></i>{" "}
                            Secure JWT Protected Payment
                        </p>

                        <div className="mb-3">

                            <label className="form-label">
                                Payment Method
                            </label>

                            <select
                                className="form-select"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="UPI">UPI</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Net Banking">Net Banking</option>
                            </select>

                        </div>

                        <button
                            className="btn btn-primary pay-btn w-100"
                            onClick={handlePayment}
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Processing...
                                </>
                            ) : (
                                `Pay ₹${selectedPlan.price}`
                            )}

                        </button>

                        <p className="note mt-3">
                            Your payment is protected using secure JWT authentication.
                        </p>

                    </div>

                </div>

            </div>

        </>

    );

}

export default Payment;