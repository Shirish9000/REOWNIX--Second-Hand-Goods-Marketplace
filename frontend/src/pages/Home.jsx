import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (

        <div className="home-page">

            {/* ================= HERO ================= */}

            <section className="hero">

                <div className="hero-overlay"></div>

                <div className="container">

                    <div className="hero-content">

                        <img
                            src="/logo.jpeg"
                            alt="ReOwnix Logo"
                            className="hero-logo"
                        />

                        <span className="premium-badge">
                            <i className="bi bi-stars"></i>
                            Premium Membership
                        </span>

                        <h1>

                            Upgrade to <span>ReOwnix Premium</span>

                        </h1>

                        <p>

                            Unlock premium product browsing, secure payments,
                            faster access, and an enhanced marketplace
                            experience with ReOwnix Premium.

                        </p>

                        <div className="hero-buttons">

                            <button
                                className="btn btn-warning btn-lg"
                                onClick={() => navigate("/plans")}
                            >

                                <i className="bi bi-lightning-charge-fill me-2"></i>

                                Explore Plans

                            </button>

                            <button
                                className="btn btn-outline-light btn-lg"
                                onClick={() => navigate("/subscription")}
                            >

                                <i className="bi bi-person-check-fill me-2"></i>

                                My Subscription

                            </button>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= STATS ================= */}

            <section className="stats-section">

                <div className="container">

                    <div className="row text-center g-4">

                        <div className="col-lg-3 col-md-6">

                            <div className="stat-card">

                                <i className="bi bi-people-fill"></i>

                                <h2>25K+</h2>

                                <p>Premium Users</p>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6">

                            <div className="stat-card">

                                <i className="bi bi-box-seam"></i>

                                <h2>1M+</h2>

                                <p>Products Viewed</p>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6">

                            <div className="stat-card">

                                <i className="bi bi-shield-lock-fill"></i>

                                <h2>99.9%</h2>

                                <p>Secure Payments</p>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6">

                            <div className="stat-card">

                                <i className="bi bi-star-fill"></i>

                                <h2>4.9★</h2>

                                <p>User Rating</p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= FEATURES ================= */}

            <section className="features">

                <div className="container">

                    <div className="section-title">

                        <h2>

                            Why Choose ReOwnix Premium?

                        </h2>

                        <p>

                            Everything you need for a smarter marketplace
                            experience.

                        </p>

                    </div>

                    <div className="row g-4">

                        <div className="col-lg-3 col-md-6">

                            <div className="feature-card">

                                <i className="bi bi-stars"></i>

                                <h4>Premium Experience</h4>

                                <p>

                                    Enjoy an ad-free, smooth and premium
                                    browsing experience.

                                </p>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6">

                            <div className="feature-card">

                                <i className="bi bi-box2-heart-fill"></i>

                                <h4>More Product Views</h4>

                                <p>

                                    Unlock higher monthly product viewing
                                    limits with premium plans.

                                </p>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6">

                            <div className="feature-card">

                                <i className="bi bi-credit-card-2-front-fill"></i>

                                <h4>Secure Payments</h4>

                                <p>

                                    Safe JWT authenticated payment gateway
                                    with complete security.

                                </p>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6">

                            <div className="feature-card">

                                <i className="bi bi-receipt-cutoff"></i>

                                <h4>Digital Invoice</h4>

                                <p>

                                    Instantly access and download invoices
                                    after every purchase.

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>
                        {/* ================= PREMIUM PLANS PREVIEW ================= */}

            <section className="plans-preview">

                <div className="container">

                    <div className="section-title">

                        <h2>
                            Choose Your Premium Plan
                        </h2>

                        <p>
                            Select the plan that fits your product browsing needs.
                        </p>

                    </div>


                    <div className="row g-4">


                        <div className="col-lg-4 col-md-6">

                            <div className="plan-card">

                                <div className="plan-icon">

                                    <i className="bi bi-box"></i>

                                </div>


                                <h3>
                                    Own
                                </h3>


                                <h2>
                                    ₹799
                                    <span>/month</span>
                                </h2>


                                <ul>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        50 Product Views
                                    </li>


                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Monthly Renewal
                                    </li>


                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Premium Access
                                    </li>


                                </ul>


                                <button
                                    className="btn btn-dark"
                                    onClick={() => navigate("/plans")}
                                >
                                    Choose Plan
                                </button>


                            </div>


                        </div>



                        <div className="col-lg-4 col-md-6">


                            <div className="plan-card popular">


                                <div className="popular-tag">

                                    Most Popular

                                </div>


                                <div className="plan-icon">

                                    <i className="bi bi-gem"></i>

                                </div>



                                <h3>
                                    ReOwn
                                </h3>


                                <h2>
                                    ₹999
                                    <span>/month</span>
                                </h2>



                                <ul>

                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        75 Product Views
                                    </li>


                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Monthly Renewal
                                    </li>


                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Priority Experience
                                    </li>


                                </ul>



                                <button
                                    className="btn btn-warning"
                                    onClick={() => navigate("/plans")}
                                >

                                    Choose Plan

                                </button>


                            </div>


                        </div>




                        <div className="col-lg-4 col-md-6">


                            <div className="plan-card">


                                <div className="plan-icon">

                                    <i className="bi bi-trophy-fill"></i>

                                </div>



                                <h3>
                                    ReOwn Max
                                </h3>



                                <h2>
                                    ₹1399
                                    <span>/month</span>
                                </h2>



                                <ul>


                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        100 Product Views
                                    </li>


                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Monthly Renewal
                                    </li>


                                    <li>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Maximum Benefits
                                    </li>


                                </ul>



                                <button
                                    className="btn btn-dark"
                                    onClick={() => navigate("/plans")}
                                >

                                    Choose Plan

                                </button>


                            </div>


                        </div>


                    </div>


                </div>


            </section>




            {/* ================= CTA SECTION ================= */}


            <section className="cta-section">


                <div className="container">


                    <div className="cta-box">


                        <h2>

                            Ready to Upgrade Your Experience?

                        </h2>


                        <p>

                            Join ReOwnix Premium and unlock unlimited marketplace benefits.

                        </p>



                        <button

                            className="btn btn-warning btn-lg"

                            onClick={() => navigate("/plans")}

                        >

                            Get Premium Now

                            <i className="bi bi-arrow-right ms-2"></i>

                        </button>



                    </div>


                </div>


            </section>



            {/* ================= FOOTER ================= */}


            <footer className="home-footer">


                <div className="container">


                    <div className="row">


                        <div className="col-md-6">


                            <h4>

                                ReOwnix Premium

                            </h4>


                            <p>

                                Smart marketplace experience with premium benefits.

                            </p>


                        </div>



                        <div className="col-md-6 text-md-end">


                            <p>

                                © 2026 ReOwnix. All Rights Reserved.

                            </p>


                        </div>


                    </div>


                </div>


            </footer>



        </div>

    );

}


export default Home;