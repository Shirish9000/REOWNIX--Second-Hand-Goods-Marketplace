import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {

    return (

        <footer className="footer">

            <div className="container">

                <div className="row gy-4">

                    <div className="col-lg-4">

                        <h3>
                            <i className="bi bi-recycle"></i> ReOwniX
                        </h3>

                        <p>
                            Buy • Sell • ReOwn
                        </p>

                        <p>
                            Upgrade to ReOwniX Premium and unlock more product
                            views, secure payments, and an enhanced marketplace
                            experience.
                        </p>

                    </div>

                    <div className="col-lg-2 col-md-4">

                        <h5>Quick Links</h5>

                        <ul>

                            <li><Link to="/">Home</Link></li>

                            <li><Link to="/plans">Plans</Link></li>

                            <li><Link to="/payment">Payment</Link></li>

                            <li><Link to="/subscription">Subscription</Link></li>

                            <li><Link to="/invoice">Invoice</Link></li>

                        </ul>

                    </div>

                    <div className="col-lg-3 col-md-4">

                        <h5>Premium Plans</h5>

                        <ul>

                            <li>Own</li>

                            <li>ReOwn</li>

                            <li>ReOwn Max</li>

                        </ul>

                    </div>

                    <div className="col-lg-3 col-md-4">

                        <h5>Connect With Us</h5>

                        <div className="social-icons">

                            <i className="bi bi-facebook"></i>

                            <i className="bi bi-instagram"></i>

                            <i className="bi bi-twitter-x"></i>

                            <i className="bi bi-linkedin"></i>

                        </div>

                    </div>

                </div>

                <hr />

                <div className="footer-bottom">

                    © 2026 ReOwniX. All Rights Reserved.

                </div>

            </div>

        </footer>

    );

}

export default Footer;