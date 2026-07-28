import "./Plans.css";
import { useNavigate } from "react-router-dom";

function Plans() {

    const navigate = useNavigate();

    const handleChoosePlan = (plan) => {

        navigate("/payment", {
            state: plan
        });

    };

    return (

        <div className="plans-page">

            {/* Hero Section */}

            <section className="plans-hero">

                <div className="hero-overlay">

                    <h1>Choose Your ReOwniX Premium Plan</h1>

                    <p>
                        Unlock more product views and enjoy premium marketplace
                        benefits with ReOwniX Premium.
                    </p>

                </div>

            </section>

            {/* Pricing Cards */}

            <section className="pricing-section">

                <div className="container">

                    <div className="row g-4">

                        {/* Own */}

                        <div className="col-lg-4">

                            <div className="plan-card">

                                <h2>Own</h2>

                                <h1>₹799</h1>

                                <p>50 Product Views</p>

                                <ul>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        50 Product Views
                                    </li>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        30 Days Validity
                                    </li>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Invoice Included
                                    </li>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Secure Payment
                                    </li>

                                </ul>

                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        handleChoosePlan({
                                            planId: 1,
                                            name: "Own",
                                            price: 799,
                                            views: 50
                                        })
                                    }
                                >
                                    Choose Plan
                                </button>

                            </div>

                        </div>

                        {/* ReOwn */}

                        <div className="col-lg-4">

                            <div className="plan-card popular">

                                <div className="popular-badge">

                                    MOST POPULAR

                                </div>

                                <h2>ReOwn</h2>

                                <h1>₹999</h1>

                                <p>75 Product Views</p>

                                <ul>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        75 Product Views
                                    </li>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        30 Days Validity
                                    </li>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Priority Support
                                    </li>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Secure Payment
                                    </li>

                                </ul>

                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        handleChoosePlan({
                                            planId: 2,
                                            name: "ReOwn",
                                            price: 999,
                                            views: 75
                                        })
                                    }
                                >
                                    Choose Plan
                                </button>

                            </div>

                        </div>

                        {/* ReOwn Max */}

                        <div className="col-lg-4">

                            <div className="plan-card">

                                <h2>ReOwn Max</h2>

                                <h1>₹1399</h1>

                                <p>100 Product Views</p>

                                <ul>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        100 Product Views
                                    </li>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        30 Days Validity
                                    </li>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Premium Support
                                    </li>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Secure Payment
                                    </li>

                                </ul>

                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        handleChoosePlan({
                                            planId: 3,
                                            name: "ReOwn Max",
                                            price: 1399,
                                            views: 100
                                        })
                                    }
                                >
                                    Choose Plan
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* Comparison Table */}

            <section className="comparison-section">

                <div className="container">

                    <h2>Compare Premium Plans</h2>

                    <div className="table-responsive">

                        <table className="table comparison-table">

                            <thead>

                                <tr>

                                    <th>Feature</th>
                                    <th>Own</th>
                                    <th>ReOwn</th>
                                    <th>ReOwn Max</th>

                                </tr>

                            </thead>

                            <tbody>

                                <tr>

                                    <td>Product Views</td>

                                    <td>50</td>

                                    <td>75</td>

                                    <td>100</td>

                                </tr>

                                <tr>

                                    <td>Validity</td>

                                    <td>30 Days</td>

                                    <td>30 Days</td>

                                    <td>30 Days</td>

                                </tr>

                                <tr>

                                    <td>Priority Support</td>

                                    <td>❌</td>

                                    <td>✅</td>

                                    <td>✅</td>

                                </tr>

                                <tr>

                                    <td>Premium Support</td>

                                    <td>❌</td>

                                    <td>❌</td>

                                    <td>✅</td>

                                </tr>

                                <tr>

                                    <td>Invoice</td>

                                    <td>✅</td>

                                    <td>✅</td>

                                    <td>✅</td>

                                </tr>

                                <tr>

                                    <td>Secure Payment</td>

                                    <td>✅</td>

                                    <td>✅</td>

                                    <td>✅</td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>

            {/* FAQ */}

            <section className="faq-section">

                <div className="container">

                    <h2>Frequently Asked Questions</h2>

                    <div className="accordion" id="faqAccordion">

                        <div className="accordion-item">

                            <h2 className="accordion-header">

                                <button
                                    className="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq1"
                                >
                                    How long is my subscription valid?
                                </button>

                            </h2>

                            <div
                                id="faq1"
                                className="accordion-collapse collapse show"
                                data-bs-parent="#faqAccordion"
                            >

                                <div className="accordion-body">

                                    Every premium subscription is valid for 30 days.

                                </div>

                            </div>

                        </div>

                        <div className="accordion-item">

                            <h2 className="accordion-header">

                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq2"
                                >

                                    Can I renew my subscription?

                                </button>

                            </h2>

                            <div
                                id="faq2"
                                className="accordion-collapse collapse"
                                data-bs-parent="#faqAccordion"
                            >

                                <div className="accordion-body">

                                    Yes. You can renew your subscription anytime.

                                </div>

                            </div>

                        </div>

                        <div className="accordion-item">

                            <h2 className="accordion-header">

                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faq3"
                                >

                                    Can I upgrade to another plan?

                                </button>

                            </h2>

                            <div
                                id="faq3"
                                className="accordion-collapse collapse"
                                data-bs-parent="#faqAccordion"
                            >

                                <div className="accordion-body">

                                    Yes. You can upgrade to a higher plan whenever you want.

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="cta-section">

                <div className="container">

                    <h2>Ready to Experience ReOwniX Premium?</h2>

                    <p>

                        Choose the plan that best fits your needs and enjoy premium marketplace features.

                    </p>

                    <button
                        className="btn btn-warning btn-lg"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >

                        Choose Your Plan

                    </button>

                </div>

            </section>

        </div>

    );

}

export default Plans;