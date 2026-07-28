import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark">

            <div className="container">

                <Link
                    className="navbar-brand d-flex align-items-center"
                    to="/"
                >

                    <img
                        src="/logo.jpeg"
                        alt="ReOwnix Logo"
                        className="logo-img"
                    />

                    <div className="brand-text">

                        <span className="brand-title">
                            ReOwnix
                        </span>

                        <small className="brand-subtitle">
                            Premium
                        </small>

                    </div>

                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                >

                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/plans">
                                Plans
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/subscription">
                                Subscription
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/payment">
                                Payment
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/invoice">
                                Invoice
                            </Link>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;