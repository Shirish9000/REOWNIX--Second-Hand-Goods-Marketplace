import "./UpgradePopup.css";
import { useNavigate } from "react-router-dom";

function UpgradePopup({ show, onClose }) {

    const navigate = useNavigate();

    if (!show) return null;

    return (

        <div className="popup-overlay">

            <div className="popup-card">

                <div className="popup-icon">

                    <i className="bi bi-lock-fill"></i>

                </div>

                <h2>Free Limit Reached</h2>

                <p>

                    You've used all your free product views.

                    Upgrade your membership to continue browsing.

                </p>

                <div className="popup-buttons">

                    <button
                        className="btn btn-primary"

                        onClick={() => navigate("/plans")}

                    >
                        View Plans
                    </button>

                    <button
                        className="btn btn-outline-secondary"

                        onClick={onClose}

                    >
                        Maybe Later
                    </button>

                </div>

            </div>

        </div>

    );

}

export default UpgradePopup;