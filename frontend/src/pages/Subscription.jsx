import "./Subscription.css";
import { useLocation, useNavigate } from "react-router-dom";

function Subscription() {

    const navigate = useNavigate();
    const location = useLocation();

    const subscription = location.state || {

        name: "ReOwn Max",

        price: 1399,

        views: 100,

        duration: "30 Days",

        support: "Premium Support"

    };

    const remainingViews = subscription.views;

    return (

        <div className="subscription-page">

            <div className="subscription-card">

                <h1>ReOwniX Premium Subscription</h1>

                <span className="badge bg-success status-badge">

                    Active

                </span>

                <hr />

                <div className="subscription-grid">

                    <div className="subscription-item">

                        <h5>Current Plan</h5>

                        <p>{subscription.name}</p>

                    </div>

                    <div className="subscription-item">

                        <h5>Amount Paid</h5>

                        <p>₹{subscription.price}</p>

                    </div>

                    <div className="subscription-item">

                        <h5>Total Product Views</h5>

                        <p>{subscription.views}</p>

                    </div>

                    <div className="subscription-item">

                        <h5>Remaining Views</h5>

                        <p>{remainingViews}</p>

                    </div>

                    <div className="subscription-item">

                        <h5>Duration</h5>

                        <p>{subscription.duration}</p>

                    </div>

                    <div className="subscription-item">

                        <h5>Support</h5>

                        <p>{subscription.support}</p>

                    </div>

                </div>

                <div className="mt-4">

                    <h5>Remaining Product Views</h5>

                    <div className="progress">

                        <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "100%" }}
                        >

                            {remainingViews}/{subscription.views}

                        </div>

                    </div>

                </div>

                <div className="subscription-buttons">

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/plans")}
                    >

                        Renew Plan

                    </button>

                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/invoice")}
                    >

                        Download Invoice

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Subscription;